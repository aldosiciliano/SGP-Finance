import React from 'react'

const Gastos = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gastos</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Nuevo Gasto
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <p className="text-gray-600">Módulo de gastos en desarrollo...</p>
      </div>
    </div>
  )
}

export default Gastos
