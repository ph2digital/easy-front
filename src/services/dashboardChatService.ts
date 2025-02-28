import axios from 'axios';

interface AggregatedData {
  totalImpressions: number;
  totalClicks: number;
  totalSpend: number;
  avgCTR: number;
  impressionsGrowth: number;
  clicksGrowth: number;
  spendGrowth: number;
  platforms: {
    google: { impressions: number; clicks: number; spend: number };
    meta: { impressions: number; clicks: number; spend: number };
  };
}

interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  thread_id?: string;
}

interface ThreadData {
  id: string;
  messages?: ChatMessage[];
  metadata?: Record<string, any>;
}

class DashboardChatService {
  private baseUrl = '/api/gpt';

  async createThread(userId: string): Promise<ThreadData> {
    try {
      const response = await axios.post(`${this.baseUrl}/threads`, {
        metadata: {
          type: 'dashboard',
          userId
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating thread:', error);
      throw error;
    }
  }

  async sendMessage(
    threadId: string,
    content: string,
    dashboardData: AggregatedData
  ): Promise<ChatMessage> {
    try {
      const response = await axios.post(`${this.baseUrl}/threads/${threadId}/messages`, {
        role: 'user',
        content,
        metadata: {
          dashboardData: {
            aggregatedData: dashboardData,
            timestamp: Date.now()
          }
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async createAndExecuteRun(threadId: string, dashboardData: AggregatedData): Promise<string> {
    try {
      const runResponse = await axios.post(`${this.baseUrl}/threads/${threadId}/runs`, {
        assistant_id: process.env.REACT_APP_OPENAI_ASSISTANT_ID,
        instructions: `Você é um assistente especializado em análise de campanhas de marketing.
          Analise os dados fornecidos e forneça insights relevantes.
          Dados atuais das campanhas: ${JSON.stringify(dashboardData)}`,
      });
      return runResponse.data.id;
    } catch (error) {
      console.error('Error creating run:', error);
      throw error;
    }
  }

  async checkRunStatus(threadId: string, runId: string): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/threads/${threadId}/runs/${runId}/check`);
      return response.data.status === 'completed';
    } catch (error) {
      console.error('Error checking run status:', error);
      throw error;
    }
  }

  async getThreadMessages(threadId: string): Promise<ChatMessage[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/threads/${threadId}/messages`);
      return response.data.reverse().map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.created_at).getTime()
      }));
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  async processMessage(
    threadId: string,
    content: string,
    dashboardData: AggregatedData
  ): Promise<ChatMessage[]> {
    try {
      // Send the message
      await this.sendMessage(threadId, content, dashboardData);

      // Create and monitor run
      const runId = await this.createAndExecuteRun(threadId, dashboardData);
      
      // Poll for completion
      let isCompleted = false;
      while (!isCompleted) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        isCompleted = await this.checkRunStatus(threadId, runId);
      }

      // Get updated messages
      return await this.getThreadMessages(threadId);
    } catch (error) {
      console.error('Error processing message:', error);
      throw error;
    }
  }
}

export const dashboardChatService = new DashboardChatService();
