'use client'

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-syne font-bold text-2xl text-[#1A2420]">Dashboard Overview</h1>
      
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#E2E8E4] p-5">
          <div className="font-syne font-bold text-3xl text-[#1A2420]">2</div>
          <div className="text-xs text-[#8A9E98] mt-1">Total Hospitals</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E2E8E4] p-5">
          <div className="font-syne font-bold text-3xl text-[#B86E0A]">0</div>
          <div className="text-xs text-[#8A9E98] mt-1">Pending Approvals</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E2E8E4] p-5">
          <div className="font-syne font-bold text-3xl text-[#534AB7]">4</div>
          <div className="text-xs text-[#8A9E98] mt-1">Total Doctors</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E2E8E4] p-5">
          <div className="font-syne font-bold text-3xl text-[#1D63B5]">5</div>
          <div className="text-xs text-[#8A9E98] mt-1">Total Patients</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6">
        <h3 className="font-syne font-bold text-lg text-[#1A2420] mb-5">
          Pending Hospital Approvals
        </h3>
        <div className="text-center py-10">
          <div className="text-4xl mb-2">✅</div>
          <p className="font-semibold text-[#1A2420]">No pending approvals</p>
          <p className="text-sm text-[#8A9E98] mt-1">
            All hospital registrations have been reviewed
          </p>
        </div>
      </div>
    </div>
  )
}
