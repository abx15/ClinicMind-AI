'use client'

interface FilterChipsProps {
  filters: string[]
  activeFilter: string
  onFilterChange: (filter: string) => void
}

export default function FilterChips({ filters, activeFilter, onFilterChange }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${
            activeFilter === filter
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  )
}
