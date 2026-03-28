export default function AdminSettingsPage() {
  return (
    <div className="max-w-2xl space-y-5">
      {/* Platform info card */}
      <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6">
        <h3 className="font-syne font-bold text-base text-[#1A2420] mb-5">
          Platform information
        </h3>
        {[
          { label: 'Platform name',   value: 'ClinicMind AI'         },
          { label: 'Version',         value: '1.0.0'                 },
          { label: 'Support email',   value: 'support@clinicmind.in' },
          { label: 'API base URL',    value: 'api.clinicmind.in'     },
        ].map((item) => (
          <div key={item.label}
               className="flex justify-between py-3 border-b border-[#E2E8E4] last:border-0">
            <span className="text-sm text-[#8A9E98]">{item.label}</span>
            <span className="text-sm font-medium text-[#1A2420]">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Notification preferences */}
      <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6">
        <h3 className="font-syne font-bold text-base text-[#1A2420] mb-5">
          Notifications
        </h3>
        {[
          { label: 'New hospital registration', enabled: true  },
          { label: 'Hospital approval required', enabled: true  },
          { label: 'Weekly revenue report',      enabled: false },
        ].map((item) => (
          <div key={item.label}
               className="flex items-center justify-between py-3
                          border-b border-[#E2E8E4] last:border-0">
            <span className="text-sm text-[#4A5E58]">{item.label}</span>
            <div className={`relative w-10 h-6 rounded-full
              ${item.enabled ? 'bg-[#0F6E56]' : 'bg-[#E2E8E4]'}`}>
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all
                ${item.enabled ? 'left-5' : 'left-1'}`} />
            </div>
          </div>
        ))}
      </div>

      {/* API Keys */}
      <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6">
        <h3 className="font-syne font-bold text-base text-[#1A2420] mb-5">
          API Keys
        </h3>
        {[
          { label: 'Public API Key',     value: 'pk_live_51H2...2Kf' },
          { label: 'Webhook Secret',     value: 'whsec_1a2b3c...9xyz' },
          { label: 'AI Service Key',     value: 'sk-IA1...7B2' },
        ].map((item) => (
          <div key={item.label}
               className="flex justify-between py-3 border-b border-[#E2E8E4] last:border-0">
            <span className="text-sm text-[#8A9E98]">{item.label}</span>
            <span className="text-sm font-mono text-[#4A5E58] bg-[#F4F6F4] px-2 py-1 rounded">
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-2xl border border-[#FCEBEB] p-6">
        <h3 className="font-syne font-bold text-base text-[#A32D2D] mb-5">
          Danger Zone
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-[#FCEBEB] last:border-0">
            <div>
              <div className="text-sm font-medium text-[#1A2420]">Reset platform data</div>
              <div className="text-xs text-[#8A9E98] mt-0.5">
                This will reset all platform statistics and analytics
              </div>
            </div>
            <button className="px-3 py-1.5 border border-[#A32D2D] text-[#A32D2D] rounded-lg text-xs
                           font-semibold hover:bg-[#A32D2D] hover:text-white transition-all">
              Reset
            </button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="text-sm font-medium text-[#1A2420]">Emergency maintenance mode</div>
              <div className="text-xs text-[#8A9E98] mt-0.5">
                Temporarily disable all user access to the platform
              </div>
            </div>
            <button className="px-3 py-1.5 bg-[#A32D2D] text-white rounded-lg text-xs
                           font-semibold hover:bg-[#791F1F] transition-all">
              Enable
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
