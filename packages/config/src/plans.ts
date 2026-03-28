export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    maxDoctors: 2,
    maxPatientsPerDay: 20,
    features: ['basic_queue', 'appointments', 'prescriptions'],
  },
  pro: {
    name: 'Pro',
    price: 2499,
    maxDoctors: 10,
    maxPatientsPerDay: 999,
    features: ['basic_queue', 'appointments', 'prescriptions', 'ai_triage', 'voice_prescription', 'whatsapp', 'analytics'],
  },
  growth: {
    name: 'Growth',
    price: 5999,
    maxDoctors: 999,
    maxPatientsPerDay: 999,
    features: ['all'],
  },
}
