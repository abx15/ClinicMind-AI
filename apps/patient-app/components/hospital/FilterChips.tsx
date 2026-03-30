'use client'

import { useState } from 'react'

const specializations = [
  'All Specialties',
  'General Medicine',
  'Cardiology',
  'Orthopedic',
  'Pediatrics',
  'Dermatology',
  'Neurology',
  'Gynecology',
]

interface FilterChipsProps {
  onFilterChange?: (specialization: string) => void
}

export default function FilterChips({ onFilterChange }: FilterChipsProps) {
  const [activeFilter, setActiveFilter] = useState('All Specialties')

  const handleFilterClick = (specialization: string) => {
    setActiveFilter(specialization)
    onFilterChange?.(specialization === 'All Specialties' ? '' : specialization)
  }

  return (
    <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
      {specializations.map((spec) => (
        <button
          key={spec}
          onClick={() => handleFilterClick(spec)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
            activeFilter === spec
              ? 'bg-primary text-white shadow-md'
              : 'bg-card border border-border text-text-2 hover:border-primary hover:text-primary'
          }`}
        >
          {spec}
        </button>
      ))}
    </div>
  )
}
