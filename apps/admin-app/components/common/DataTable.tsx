interface Column<T> {
  key:      keyof T | string
  label:    string
  width?:   string
  render?:  (value: any, row: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns:   Column<T>[]
  data:      T[]
  isLoading: boolean
  emptyText: string
}

export default function DataTable<T>({ columns, data, isLoading, emptyText }: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-[#E2E8E4] overflow-hidden">
        <div className="space-y-0">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="h-16 bg-[#F4F6F4] animate-pulse border-b border-[#E2E8E4]" />
          ))}
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#E2E8E4] p-16 text-center">
        <div className="text-4xl mb-3">📋</div>
        <p className="font-semibold text-[#1A2420]">
          {emptyText}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8E4] overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-[#F4F6F4] border-b border-[#E2E8E4]">
            {columns.map((column) => (
              <th
                key={column.key as string}
                className="px-5 py-3 text-left text-xs font-semibold text-[#4A5E58] uppercase tracking-wider"
                style={{ width: column.width }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E2E8E4]">
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-[#F8FAF9] transition-colors">
              {columns.map((column) => (
                <td key={column.key as string} className="px-5 py-4">
                  {column.render 
                    ? column.render((row[column.key as keyof T] as any), row)
                    : (row[column.key as keyof T] as any)
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
