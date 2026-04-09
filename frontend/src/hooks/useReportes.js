import { useEffect, useMemo, useState } from 'react';
import { getReportesData } from '../services/reportesService';
import {
  buildPeriodOptions,
  getBudgetGap,
  getCategoryAnalysis,
  getComparisonCategories,
  getSelectedPeriodLabel,
  getSelectedPeriodParts,
  getServiceErrorMessage
} from '../utils/reportes';

const INITIAL_CATEGORY_REPORT = { categorias: [], total_gastado: 0 };

export const useReportes = () => {
  const periodOptions = useMemo(() => buildPeriodOptions(), []);
  const [selectedPeriod, setSelectedPeriod] = useState(periodOptions[0]?.value || '');
  const [categoryReport, setCategoryReport] = useState(INITIAL_CATEGORY_REPORT);
  const [comparisonReport, setComparisonReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedYear, selectedMonth] = useMemo(
    () => getSelectedPeriodParts(selectedPeriod),
    [selectedPeriod]
  );

  useEffect(() => {
    if (!selectedMonth || !selectedYear) return;

    const loadReportes = async () => {
      try {
        setIsLoading(true);
        setError('');

        const reportesData = await getReportesData({
          mes: selectedMonth,
          anio: selectedYear
        });

        setCategoryReport(reportesData.categorias);
        setComparisonReport(reportesData.comparativa);
      } catch (requestError) {
        setError(getServiceErrorMessage(requestError, 'No se pudieron cargar los reportes.'));
      } finally {
        setIsLoading(false);
      }
    };

    loadReportes();
  }, [selectedMonth, selectedYear]);

  const selectedPeriodLabel = useMemo(
    () => getSelectedPeriodLabel(periodOptions, selectedPeriod),
    [periodOptions, selectedPeriod]
  );
  const topCategory = categoryReport.categorias?.[0];
  const comparisonDelta = Number(comparisonReport?.diferencia_gastado || 0);
  const budgetGap = getBudgetGap(comparisonReport);
  const budgetGapTone = budgetGap > 0 ? 'danger' : 'success';
  const categoryAnalysis = useMemo(
    () => getCategoryAnalysis(categoryReport.categorias),
    [categoryReport.categorias]
  );
  const comparisonCategories = useMemo(
    () => getComparisonCategories(comparisonReport),
    [comparisonReport]
  );

  return {
    budgetGap,
    budgetGapTone,
    categoryAnalysis,
    comparisonCategories,
    comparisonDelta,
    comparisonReport,
    error,
    isLoading,
    periodOptions,
    selectedPeriod,
    selectedPeriodLabel,
    setSelectedPeriod,
    topCategory
  };
};
