import axios from 'axios';

export class WhatsAppService {
  private phoneNumberId: string;
  private accessToken: string;
  private baseUrl: string;

  constructor() {
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID!;
    this.accessToken = process.env.WHATSAPP_TOKEN!;
    this.baseUrl = `https://graph.facebook.com/v19.0/${this.phoneNumberId}/messages`;
  }

  async sendTextMessage(to: string, message: string) {
    try {
      const response = await axios.post(
        this.baseUrl,
        {
          messaging_product: 'whatsapp',
          to: to.replace(/[^\d]/g, ''), // Remove non-digits
          text: { body: message }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`WhatsApp send failed: ${error.response?.data || error.message}`);
    }
  }

  async sendTemplateMessage(to: string, templateName: string, params: string[] = []) {
    try {
      const response = await axios.post(
        this.baseUrl,
        {
          messaging_product: 'whatsapp',
          to: to.replace(/[^\d]/g, ''),
          template: {
            name: templateName,
            language: { code: 'en' },
            components: params.length > 0 ? [{
              type: 'body',
              parameters: params.map(param => ({ type: 'text', text: param }))
            }] : undefined
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`WhatsApp template send failed: ${error.response?.data || error.message}`);
    }
  }

  async sendAppointmentReminder(phone: string, patientName: string, doctorName: string, date: string, time: string) {
    const message = `Hi ${patientName},\n\nReminder: Your appointment with Dr. ${doctorName} is scheduled for ${date} at ${time}.\n\nPlease arrive 15 minutes early. If you need to reschedule, reply "RESCHEDULE".\n\n- ClinicMind`;
    return this.sendTextMessage(phone, message);
  }

  async sendQueueUpdate(phone: string, tokenNumber: number, estimatedMinutes: number) {
    const message = `Your token #${tokenNumber} — estimated wait: ${estimatedMinutes} minutes.\n\nWe'll notify you when it's your turn. Thank you for your patience!\n\n- ClinicMind`;
    return this.sendTextMessage(phone, message);
  }

  async sendWelcomeMessage(phone: string, name: string) {
    const message = `Welcome to ClinicMind, ${name}! 🏥\n\nBook appointments easily at app.clinicmind.in or reply "BOOK" to get started.\n\nNeed help? Reply "HELP" for options.\n\n- ClinicMind Team`;
    return this.sendTextMessage(phone, message);
  }

  async sendHelpMenu(phone: string) {
    const message = `🏥 ClinicMind WhatsApp Services:\n\n• Reply "BOOK" to book an appointment\n• Reply "STATUS" to check queue status\n• Reply "DOCTORS" to see available doctors\n• Reply "HELP" to see this menu\n\nFor emergencies, call your hospital directly.\n\n- ClinicMind`;
    return this.sendTextMessage(phone, message);
  }

  async sendBookingInstructions(phone: string) {
    const message = `📅 To book an appointment:\n\n1. Visit app.clinicmind.in\n2. Select your hospital and preferred doctor\n3. Choose date and time\n4. Confirm booking\n\nOr call our helpline for assistance.\n\n- ClinicMind`;
    return this.sendTextMessage(phone, message);
  }
}

export const whatsappService = new WhatsAppService();
