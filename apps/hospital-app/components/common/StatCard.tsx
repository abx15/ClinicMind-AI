interface StatCardProps {
  label: string
  value: string | number
  trend: string
  color: 'teal' | 'purple' | 'amber' | 'blue' | 'red'
  icon?: React.ReactNode
}

const colorConfig = {
  teal: {
    bg: 'bg-[#E1F5EE]',
    text: 'text-[#0F6E56]',
    trend: 'text-[#085041]',
  },
  purple: {
    bg: 'bg-[#EEEDFE]',
    text: 'text-[#534AB7]',
    trend: 'text-[#433A8F]',
  },
  amber: {
    bg: 'bg-[#FEF3E2]',
    text: 'text-[#B86E0A]',
    trend: 'text-[#965608]',
  },
  blue: {
    bg: 'bg-[#E6F1FB]',
    text: 'text-[#1D63B5]',
    trend: 'text-[#1A5498]',
  },
  red: {
    bg: 'bg-[#FCEBEB]',
    text: 'text-[#A32D2D]',
    trend: 'text-[#8B2424]',
  },
}

export default function StatCard({ label, value, trend, color, icon }: StatCardProps) {
  const config = colorConfig[color]

  return (
    <div className="stat-card">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${config.bg} rounded-xl flex items-center justify-center`}>
          <span className={`text-xl ${config.text}`}>
            {icon}
          </span>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${config.bg} ${config.trend}`}>
          {trend}
        </span>
      </div>
      
      <div className="space-y-1">
        <div className="font-syne font-bold text-2xl text-[#1A2420]">
          {value}
        </div>
        <div className="text-xs text-[#8A9E98]">
          {label}
        </div>
      </div>
    </div>
  )
}
