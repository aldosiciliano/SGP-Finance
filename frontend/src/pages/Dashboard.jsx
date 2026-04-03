import React from 'react'
import { DollarSign, TrendingUp, CreditCard, AlertCircle } from 'lucide-react'

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-600">
          Mes: Abril 2026
        </div>
      </div>
      
      {/* Resumen mensual */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Gastos del mes</p>
              <p className="text-2xl font-bold text-gray-900">$125,430</p>
              <p className="text-sm text-gray-500">≈ $147 USD</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">vs mes anterior</p>
              <p className="text-2xl font-bold text-green-600">-12%</p>
              <p className="text-sm text-gray-500">Mejora</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Presupuesto usado</p>
              <p className="text-2xl font-bold text-orange-600">78%</p>
              <p className="text-sm text-gray-500">$195k / $250k</p>
            </div>
            <CreditCard className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cotización USD</p>
              <p className="text-2xl font-bold text-gray-900">$850</p>
              <p className="text-sm text-gray-500">Blue: $920</p>
            </div>
            <AlertCircle className="w-8 h-8 text-gray-600" />
          </div>
        </div>
      </div>
      
      {/* Últimos gastos */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Últimos gastos</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b last:border-b-0">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">Supermercado</p>
                    <p className="text-sm text-gray-600">Hoy</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">$12,540</p>
                  <p className="text-sm text-gray-600">≈ $14.75 USD</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
