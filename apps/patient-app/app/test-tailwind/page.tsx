export default function TestTailwindPage() {
  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-text1 font-heading mb-4">
          Tailwind Test Page
        </h1>
        
        <div className="card p-6 mb-6">
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            Card Component Test
          </h2>
          <p className="text-text-secondary mb-4">
            This should use the custom .card class with proper Tailwind styling.
          </p>
          <button className="btn-primary mr-2">
            Primary Button
          </button>
          <button className="btn-outline">
            Outline Button
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary-light p-4 rounded-lg">
            <h3 className="text-primary font-semibold">Primary Light</h3>
          </div>
          <div className="bg-accent-light p-4 rounded-lg">
            <h3 className="text-accent font-semibold">Accent Light</h3>
          </div>
          <div className="bg-warn-light p-4 rounded-lg">
            <h3 className="text-warn font-semibold">Warn Light</h3>
          </div>
        </div>

        <div className="mt-6">
          <input 
            type="text" 
            placeholder="Test input field" 
            className="input-field"
          />
        </div>
      </div>
    </div>
  )
}
