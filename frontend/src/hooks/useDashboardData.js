import { useEffect, useMemo, useState } from 'react';
import { getDashboardData } from '../services/dashboardService';
import { formatCurrency } from '../utils/formatters';
import {
  buildCategoriesById,
  buildMonthRange,
  getCurrentMonthData,
  getDashboardStats,
  getExpenseCategories,
  getMonthlyExpenseSeries,
  getRecentExpenses,
  getServiceErrorMessage
} from '../utils/dashboard';

const INITIAL_RESUMEN = {
  total_presupuestado: 0,
  total_gastado: 0,
  total_restante: 0,
  categorias: []
};

export const useDashboardData = () => {
  const [categorias, setCategorias] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [resumen, setResumen] = useState(INITIAL_RESUMEN);
  const [monthlyExpenseSeries, setMonthlyExpenseSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      setError('');

      const monthRange = buildMonthRange(6);
      const { categorias, gastos: gastosData, resumen, monthlyResumes } = await getDashboardData(monthRange);

      setCategorias(categorias);
      setGastos(gastosData);
      setResumen(resumen);
      setMonthlyExpenseSeries(getMonthlyExpenseSeries(monthRange, gastosData, monthlyResumes));
    } catch (requestError) {
      setError(getServiceErrorMessage(requestError, 'No se pudo cargar el dashboard.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const categoriasById = useMemo(() => buildCategoriesById(categorias), [categorias]);
  const currentMonthData = useMemo(() => getCurrentMonthData(gastos), [gastos]);
  const expenseCategories = useMemo(
    () => getExpenseCategories(currentMonthData, categoriasById),
    [categoriasById, currentMonthData]
  );
  const recentExpenses = useMemo(
    () => getRecentExpenses(gastos, categoriasById, formatCurrency),
    [categoriasById, gastos]
  );
  const stats = useMemo(
    () => getDashboardStats(resumen, currentMonthData),
    [currentMonthData, resumen]
  );
  const summaryItems = useMemo(
    () => [
      {
        label: 'Movimientos',
        value: `${stats.count}`,
        detail: 'este mes'
      },
      {
        label: 'Promedio',
        value: formatCurrency(stats.average),
        detail: 'por gasto'
      },
      {
        label: 'Categoría líder',
        value: expenseCategories[0]?.name || 'Sin datos',
        detail: expenseCategories[0] ? `${expenseCategories[0].value}% del gasto` : 'sin datos'
      }
    ],
    [expenseCategories, stats.average, stats.count]
  );

  return {
    error,
    expenseCategories,
    isLoading,
    monthlyExpenseSeries,
    recentExpenses,
    stats,
    summaryItems,
    reload: loadDashboard
  };
};
