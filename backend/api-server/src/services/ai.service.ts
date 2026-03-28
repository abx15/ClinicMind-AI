import axios from 'axios';
import FormData from 'form-data';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

export class AIService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = AI_SERVICE_URL;
  }

  async callTriage(symptoms: string[], age: number, gender: string) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/v1/ai/triage`, {
        symptoms,
        age,
        gender
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`AI triage failed: ${error.response?.data?.detail || error.message}`);
    }
  }

  async callVoicePrescription(audioBuffer: Buffer) {
    try {
      const formData = new FormData();
      formData.append('audio', audioBuffer, {
        filename: 'audio.wav',
        contentType: 'audio/wav'
      });

      const response = await axios.post(
        `${this.baseUrl}/api/v1/ai/prescription/voice`,
        formData,
        {
          headers: {
            ...formData.getHeaders()
          }
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`AI voice prescription failed: ${error.response?.data?.detail || error.message}`);
    }
  }

  async callDrugCheck(medications: string[]) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/v1/ai/drug-check`, {
        medications
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`AI drug check failed: ${error.response?.data?.detail || error.message}`);
    }
  }

  async getDemandAnalytics(hospitalId: string, days: number = 30) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/api/v1/ai/analytics/demand`,
        {
          params: { hospitalId, days }
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`AI demand analytics failed: ${error.response?.data?.detail || error.message}`);
    }
  }

  async getPlatformAnalytics(userRole: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/api/v1/ai/analytics/platform`,
        {
          headers: {
            'X-User-Role': userRole
          }
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`AI platform analytics failed: ${error.response?.data?.detail || error.message}`);
    }
  }
}

export const aiService = new AIService();
