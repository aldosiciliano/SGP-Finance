export const monthlyExpenseSeries = [
  { month: 'Nov', gastos: 176000, presupuesto: 185000, inversiones: 42000 },
  { month: 'Dic', gastos: 189500, presupuesto: 190000, inversiones: 38000 },
  { month: 'Ene', gastos: 162200, presupuesto: 180000, inversiones: 46000 },
  { month: 'Feb', gastos: 171900, presupuesto: 182000, inversiones: 52000 },
  { month: 'Mar', gastos: 143100, presupuesto: 178000, inversiones: 61000 },
  { month: 'Abr', gastos: 125430, presupuesto: 175000, inversiones: 57500 }
];

export const expenseCategories = [
  { name: 'Hogar', value: 35, amount: '$43.900', color: '#163a70' },
  { name: 'Alimentos', value: 24, amount: '$30.100', color: '#1d8a67' },
  { name: 'Transporte', value: 17, amount: '$21.300', color: '#4f7db8' },
  { name: 'Servicios', value: 14, amount: '$17.600', color: '#7a92b2' },
  { name: 'Ocio', value: 10, amount: '$12.530', color: '#c85757' }
];

export const recentExpenses = [
  { merchant: 'Supermercado Atlas', category: 'Alimentos', date: 'Hoy · 14:32', amount: '$12.540', usd: 'USD 11,94', status: 'Procesado' },
  { merchant: 'YPF Centro', category: 'Transporte', date: 'Hoy · 09:10', amount: '$8.200', usd: 'USD 7,81', status: 'Procesado' },
  { merchant: 'Fibertel', category: 'Servicios', date: 'Ayer · 18:20', amount: '$14.800', usd: 'USD 14,09', status: 'Débito automático' },
  { merchant: 'Farmacia Plaza', category: 'Salud', date: 'Ayer · 12:40', amount: '$5.700', usd: 'USD 5,43', status: 'Procesado' }
];

export const plannedExpenses = [
  { category: 'Alquiler', dueDate: '05 Abr', amount: '$65.000', status: 'Confirmado' },
  { category: 'Tarjeta Visa', dueDate: '08 Abr', amount: '$21.400', status: 'Pendiente' },
  { category: 'Internet + TV', dueDate: '10 Abr', amount: '$14.800', status: 'Automático' },
  { category: 'Seguro auto', dueDate: '14 Abr', amount: '$9.500', status: 'Pendiente' }
];

export const expensesBoard = [
  { item: 'Compra mayorista', category: 'Alimentos', paymentMethod: 'Débito', date: '03 Abr', amount: '$18.240', note: 'Reposición quincenal' },
  { item: 'Nafta premium', category: 'Transporte', paymentMethod: 'Crédito', date: '02 Abr', amount: '$9.820', note: 'Tanque completo' },
  { item: 'Netflix + Spotify', category: 'Suscripciones', paymentMethod: 'Crédito', date: '01 Abr', amount: '$8.900', note: 'Renovación mensual' },
  { item: 'Edenor', category: 'Servicios', paymentMethod: 'Transferencia', date: '31 Mar', amount: '$16.120', note: 'Factura venc. 12 Abr' },
  { item: 'Cena familiar', category: 'Ocio', paymentMethod: 'Débito', date: '30 Mar', amount: '$22.600', note: 'Cumpleaños mamá' }
];

export const investmentPortfolio = [
  { asset: 'FCI Money Market', allocation: '35%', amount: '$420.000', return: '+3,8%', risk: 'Bajo' },
  { asset: 'Bonos CER', allocation: '25%', amount: '$310.000', return: '+6,2%', risk: 'Medio' },
  { asset: 'Cedears Tech', allocation: '22%', amount: '$275.000', return: '+11,4%', risk: 'Alto' },
  { asset: 'Dólar MEP', allocation: '18%', amount: '$220.000', return: '+2,1%', risk: 'Bajo' }
];

export const reportHighlights = [
  { label: 'Mejor semana de ahorro', value: 'Semana 3', detail: 'Ahorro neto de $41.200' },
  { label: 'Rubro más volátil', value: 'Ocio', detail: 'Subió 18% vs marzo' },
  { label: 'Ticket promedio', value: '$11.740', detail: 'Distribuido en 46 movimientos' }
];
