interface HospitalTableProps {
  hospitals: any[]
  isLoading: boolean
  onApprove: (id: string) => void
  onReject: (id: string, name: string) => void
}

export default function HospitalTable({
  hospitals, isLoading, onApprove, onReject
}: HospitalTableProps) {
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

  if (hospitals.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#E2E8E4] p-16 text-center">
        <div className="text-4xl mb-3">🏥</div>
        <p className="font-semibold text-[#1A2420]">
          No hospitals found
        </p>
        <p className="text-sm text-[#8A9E98] mt-1">
          Try adjusting your search or filters
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8E4] overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-[#F4F6F4] border-b border-[#E2E8E4]">
            <th className="px-5 py-3 text-left text-xs font-semibold text-[#4A5E58] uppercase tracking-wider">
              Hospital
            </th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-[#4A5E58] uppercase tracking-wider">
              Location
            </th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-[#4A5E58] uppercase tracking-wider">
              Admin
            </th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-[#4A5E58] uppercase tracking-wider">
              Status
            </th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-[#4A5E58] uppercase tracking-wider">
              Joined
            </th>
            <th className="px-5 py-3 text-right text-xs font-semibold text-[#4A5E58] uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E2E8E4]">
          {hospitals.map((hospital) => (
            <tr key={hospital._id} className="hover:bg-[#F8FAF9] transition-colors">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E1F5EE] flex items-center justify-center
                                  font-syne font-extrabold text-sm text-[#0F6E56] flex-shrink-0">
                    {hospital.name?.charAt(0) || 'H'}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-[#1A2420]">
                      {hospital.name || 'Unknown Hospital'}
                    </div>
                    <div className="text-xs text-[#8A9E98]">
                      {hospital.specializations?.slice(0, 2).join(', ') || 'General'}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4">
                <div className="text-sm text-[#4A5E58]">
                  {hospital.city || 'N/A'}, {hospital.pincode || 'N/A'}
                </div>
              </td>
              <td className="px-5 py-4">
                <div className="text-sm text-[#4A5E58]">
                  {hospital.adminName || 'N/A'}
                </div>
                <div className="text-xs text-[#8A9E98]">
                  {hospital.adminEmail || 'N/A'}
                </div>
              </td>
              <td className="px-5 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${
                    hospital.status === 'verified' ? 'bg-[#E1F5EE] text-[#0F6E56]' :
                    hospital.status === 'rejected' ? 'bg-[#FCEBEB] text-[#A32D2D]' :
                    hospital.status === 'suspended' ? 'bg-[#EEEDFE] text-[#534AB7]' :
                    'bg-[#FEF3E2] text-[#B86E0A]'
                  }`}>
                  {hospital.status || 'pending'}
                </span>
              </td>
              <td className="px-5 py-4">
                <div className="text-sm text-[#8A9E98]">
                  {new Date(hospital.createdAt).toLocaleDateString()}
                </div>
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center justify-end gap-2">
                  {hospital.status === 'pending' && (
                    <>
                      <button
                        onClick={() => onApprove(hospital._id)}
                        className="px-3 py-1.5 bg-[#E1F5EE] text-[#0F6E56] rounded-lg text-xs
                                 font-semibold hover:bg-[#0F6E56] hover:text-white transition-all"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onReject(hospital._id, hospital.name)}
                        className="px-3 py-1.5 bg-[#FCEBEB] text-[#A32D2D] rounded-lg text-xs
                                 font-semibold hover:bg-[#A32D2D] hover:text-white transition-all"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {hospital.status === 'verified' && (
                    <button
                      onClick={() => onReject(hospital._id, hospital.name)}
                      className="px-3 py-1.5 bg-[#EEEDFE] text-[#534AB7] rounded-lg text-xs
                               font-semibold hover:bg-[#534AB7] hover:text-white transition-all"
                    >
                      Suspend
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
