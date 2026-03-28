'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { aiService } from '@/lib/services/aiService'

export default function DrugCheckerWidget() {
  const [drugs, setDrugs] = useState<string[]>([''])
  const [results, setResults] = useState<any[]>([])

  const checkMutation = useMutation({
    mutationFn: () => {
      console.log('Checking drug interactions for:', drugs.filter(Boolean))
      // Mock AI service call
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            data: {
              interactions: [
                {
                  severity: 'mild',
                  description: 'Paracetamol and Ibuprofen can be taken together safely, but monitor for stomach upset'
                }
              ]
            }
          })
        }, 1500)
      })
    },
    onSuccess: (res) => setResults(res.data.interactions || []),
  })

  const severityColor = {
    none:     { bg: '#E1F5EE', text: '#085041' },
    mild:     { bg: '#FEF3E2', text: '#B86E0A' },
    moderate: { bg: '#FEF3E2', text: '#B86E0A' },
    severe:   { bg: '#FCEBEB', text: '#A32D2D' },
  }

  return (
    <div className="space-y-3">
      {/* Drug inputs */}
      {drugs.map((drug, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={drug}
            onChange={(e) => {
              const n = [...drugs]; n[i] = e.target.value; setDrugs(n)
            }}
            placeholder={`Drug ${i+1} e.g. Aspirin 75mg`}
            className="flex-1 border border-[#E2E8E4] rounded-lg px-3 py-2 text-xs
                         text-[#1A2420] placeholder:text-[#8A9E98] outline-none
                         focus:border-[#0F6E56] focus:ring-1 focus:ring-[#0F6E56]/20"
          />
          {drugs.length > 1 && (
            <button
              onClick={() => setDrugs(drugs.filter((_, j) => j !== i))}
              className="text-[#A32D2D] px-2 hover:bg-[#FCEBEB] rounded-lg transition-colors"
            >
              ×
            </button>
          )}
        </div>
      ))}

      <div className="flex gap-2">
        <button
          onClick={() => setDrugs([...drugs, ''])}
          className="flex-1 py-2 border border-dashed border-[#E2E8E4] rounded-lg
                     text-xs text-[#8A9E98] hover:bg-[#F4F6F4] transition-colors"
        >
          + Add drug
        </button>
        <button
          onClick={() => checkMutation.mutate()}
          disabled={checkMutation.isPending || drugs.filter(Boolean).length < 2}
          className="flex-1 py-2 bg-[#0F6E56] text-white rounded-lg text-xs font-semibold
                     hover:bg-[#094D3C] disabled:opacity-50 transition-colors"
        >
          {checkMutation.isPending ? 'Checking...' : 'Check'}
        </button>
      </div>

      {/* Results */}
      {results.length === 0 && checkMutation.isSuccess && (
        <div className="bg-[#E1F5EE] rounded-lg px-3 py-2 text-xs text-[#0F6E56] font-medium">
          No interactions found ✓
        </div>
      )}
      {results.map((r, i) => {
        const colors = severityColor[r.severity as keyof typeof severityColor]
          || severityColor.mild
        return (
          <div key={i} className="rounded-lg px-3 py-2.5"
               style={{ background: colors.bg }}>
            <p className="text-xs font-bold" style={{ color: colors.text }}>
              ⚠ {r.severity?.toUpperCase()} interaction
            </p>
            <p className="text-xs mt-0.5 text-[#4A5E58]">{r.description}</p>
          </div>
        )
      })}
    </div>
  )
}
