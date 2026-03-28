import { HospitalDataForm } from '../../../components/admin/HospitalDataForm'

export const metadata = {
  title: 'Hospital Admin Management',
  description: 'Manage hospital details and administrative settings',
}

export default function AdminPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Hospital Administration
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Manage your hospital's profile, capacity, and administrative contact information.
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-900 shadow rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
          Update Hospital Profile
        </h2>
        <HospitalDataForm />
      </div>
    </div>
  )
}
