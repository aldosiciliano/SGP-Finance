import React from 'react'
import { DollarSign, TrendingUp, FileText, PieChart } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const location = useLocation()
  
  const isActive = (path) => location.pathname === path
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: DollarSign },
    { path: '/gastos', label: 'Gastos', icon: FileText },
    { path: '/inversiones', label: 'Inversiones', icon: TrendingUp },
    { path: '/reportes', label: 'Reportes', icon: PieChart }
  ]
  
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-gray-900">SGP Finance</h1>
            <div className="hidden md:flex space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                      isActive(item.path)
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">USD:</span> $850
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
