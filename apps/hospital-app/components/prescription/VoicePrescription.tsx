'use client'

import { useState, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import { aiService } from '@/lib/services/aiService'

type RecordingState = 'idle' | 'recording' | 'processing' | 'done'

export default function VoicePrescriptionWidget() {
  const [state, setState] = useState<RecordingState>('idle')
  const [result, setResult] = useState<any>(null)
  const mediaRef   = useRef<MediaRecorder | null>(null)
  const chunksRef  = useRef<Blob[]>([])

  const processMutation = useMutation({
    mutationFn: (formData: FormData) => {
      console.log('Processing voice prescription...')
      // Mock AI service call
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            data: {
              transcript: "Patient presents with fever, headache, and body pain for 3 days. Prescribing paracetamol 500mg for fever and pain management.",
              prescription: {
                diagnosis: "Viral fever with body ache",
                medications: [
                  { name: "Paracetamol", dosage: "500mg", frequency: "3 times daily" },
                  { name: "Ibuprofen", dosage: "400mg", frequency: "as needed for pain" }
                ]
              }
            }
          })
        }, 2000)
      })
    },
    onSuccess: (res) => {
      setResult(res.data)
      setState('done')
    },
    onError: () => setState('idle'),
  })

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      chunksRef.current = []
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data)
      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const formData = new FormData()
        formData.append('audio', blob, 'recording.webm')
        setState('processing')
        await processMutation.mutateAsync(formData)
        stream.getTracks().forEach(t => t.stop())
      }
      recorder.start()
      mediaRef.current = recorder
      setState('recording')
    } catch {
      alert('Microphone permission required')
    }
  }

  const stopRecording = () => {
    mediaRef.current?.stop()
  }

  // UI based on state:
  if (state === 'idle') return (
    <div
      onClick={startRecording}
      className="bg-[#E1F5EE] border-2 border-dashed border-[#5DCAA5] rounded-xl
                 p-6 text-center cursor-pointer hover:bg-[#0F6E56] group transition-all"
    >
      <div className="text-3xl mb-2">🎙️</div>
      <p className="text-sm font-semibold text-[#0F6E56] group-hover:text-white">
        Tap to Record
      </p>
      <p className="text-xs text-[#8A9E98] group-hover:text-white/70">
        Speak prescription details
      </p>
    </div>
  )

  if (state === 'recording') return (
    <div
      onClick={stopRecording}
      className="bg-[#FCEBEB] border-2 border-dashed border-[#A32D2D] rounded-xl
                 p-6 text-center cursor-pointer"
    >
      <div className="flex items-center justify-center gap-1 mb-2">
        {[0,1,2,3].map(i => (
          <div key={i}
               className="w-1 bg-[#A32D2D] rounded-full animate-pulse"
               style={{ height: `${16 + i * 8}px`, animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
      <p className="text-sm font-semibold text-[#A32D2D]">Recording... Tap to stop</p>
    </div>
  )

  if (state === 'processing') return (
    <div className="bg-[#E6F1FB] rounded-xl p-6 text-center">
      <div className="animate-spin text-2xl mb-2">⚙️</div>
      <p className="text-sm text-[#1D63B5] font-medium">AI processing...</p>
    </div>
  )

  if (state === 'done' && result) return (
    <div className="space-y-3">
      <div className="bg-[#E1F5EE] rounded-xl p-3">
        <p className="text-xs text-[#0F6E56] font-semibold mb-1">Transcript</p>
        <p className="text-xs text-[#4A5E58]">{result.transcript}</p>
      </div>
      <div className="bg-[#F4F6F4] rounded-xl p-3">
        <p className="text-xs font-semibold text-[#1A2420] mb-2">
          {result.prescription?.diagnosis}
        </p>
        {result.prescription?.medications?.map((m: any, i: number) => (
          <div key={i} className="text-xs text-[#4A5E58] py-1 border-b border-[#E2E8E4]
                                  last:border-0">
            {m.name} — {m.dosage} × {m.frequency}
          </div>
        ))}
      </div>
      <button
        onClick={() => setState('idle')}
        className="w-full py-2 border border-[#E2E8E4] rounded-lg text-xs
                   text-[#8A9E98] hover:bg-[#F4F6F4] transition-colors"
      >
        Record again
      </button>
    </div>
  )

  return null
}
