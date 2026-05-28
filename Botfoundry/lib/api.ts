// lib/api.ts - BotFoundry API Client v2.0

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ==================== Types ====================

export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string | null;
  is_active: boolean;
  is_premium: boolean;
  created_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface Chatbot {
  id: number;
  chatbot_id: string;
  name: string;
  description: string | null;
  status: "training" | "active" | "inactive";
  total_conversations: number;
  total_messages: number;
  avg_response_time: number;
  accuracy_score: number;
  created_at: string;
  last_active: string;
}

export interface ChatbotWithAPI extends Chatbot {
  api_endpoint: string;
  api_keys: APIKey[];
}

export interface APIKey {
  id: number;
  key: string;
  name: string | null;
  is_active: boolean;
  total_requests: number;
  created_at: string;
  expires_at: string | null;
  last_used: string | null;
}

export interface ChatbotCreationResponse {
  chatbot_id: string;
  name: string;
  status: string;
  vector_store_path: string;
  documents_processed: number;
  chunks_created: number;
  api_key: string;
  api_endpoint: string;
}

export interface MessageResponse {
  answer: string;
  sources: string[];
  response_time: number;
  conversation_id: string;
  agent_actions: any[] | null;
}

export interface Conversation {
  id: number;
  conversation_id: string;
  chatbot_id: number;
  started_at: string;
  message_count: number;
  avg_response_time: number;
}

// ==================== Helper Functions ====================

class AuthManager {
  private static TOKEN_KEY = "botfoundry_access_token";
  private static REFRESH_KEY = "botfoundry_refresh_token";

  static setTokens(access: string, refresh: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.TOKEN_KEY, access);
      localStorage.setItem(this.REFRESH_KEY, refresh);
    }
  }

  static getAccessToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  static getRefreshToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.REFRESH_KEY);
    }
    return null;
  }

  static clearTokens() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_KEY);
    }
  }

  static isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

// ==================== API Client ====================

export class BotFoundryAPI {
  private static async fetchWithAuth(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const token = AuthManager.getAccessToken();

    const headers: HeadersInit = {
      ...options.headers,
    };

    // Add auth header if token exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Add content-type for JSON requests
    if (options.body && typeof options.body === "string") {
      headers["Content-Type"] = "application/json";
    }

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
        mode: "cors",
      });

      // Handle 401 Unauthorized - token expired
      if (response.status === 401) {
        AuthManager.clearTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }

      return response;
    } catch (error) {
      console.error("API request failed:", error);
      throw new Error("Cannot connect to server. Please ensure the backend is running.");
    }
  }

  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `Server error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.error || errorMessage;
      } catch {
        // If JSON parsing fails, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // ==================== Health & Status ====================

  static async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, { mode: "cors" });
      return response.ok;
    } catch {
      return false;
    }
  }

  // ==================== Authentication ====================

  static async register(data: {
    email: string;
    username: string;
    password: string;
    full_name?: string;
  }): Promise<User> {
    const response = await this.fetchWithAuth("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return this.handleResponse<User>(response);
  }

  static async login(email: string, password: string): Promise<AuthTokens> {
    const response = await this.fetchWithAuth("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const tokens = await this.handleResponse<AuthTokens>(response);

    // Store tokens
    AuthManager.setTokens(tokens.access_token, tokens.refresh_token);

    return tokens;
  }

  static async logout() {
    AuthManager.clearTokens();
  }

  static async getCurrentUser(): Promise<User> {
    const response = await this.fetchWithAuth("/auth/me");
    return this.handleResponse<User>(response);
  }

  static isAuthenticated(): boolean {
    return AuthManager.isAuthenticated();
  }

  // ==================== Chatbot Management ====================

  static async createChatbot(
    name: string,
    description: string | null,
    files: File[]
  ): Promise<ChatbotCreationResponse> {
    const formData = new FormData();
    formData.append("name", name);
    if (description) {
      formData.append("description", description);
    }
    files.forEach((file) => {
      formData.append("files", file);
    });

    const token = AuthManager.getAccessToken();
    const response = await fetch(`${API_BASE_URL}/chatbots/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      mode: "cors",
    });

    return this.handleResponse<ChatbotCreationResponse>(response);
  }

  static async getChatbots(): Promise<Chatbot[]> {
    const response = await this.fetchWithAuth("/chatbots");
    return this.handleResponse<Chatbot[]>(response);
  }

  static async getChatbot(chatbotId: string): Promise<ChatbotWithAPI> {
    const response = await this.fetchWithAuth(`/chatbots/${chatbotId}`);
    return this.handleResponse<ChatbotWithAPI>(response);
  }

  static async deleteChatbot(chatbotId: string): Promise<void> {
    const response = await this.fetchWithAuth(`/chatbots/${chatbotId}`, {
      method: "DELETE",
    });
    await this.handleResponse<{ message: string }>(response);
  }

  static async updateChatbotStatus(
    chatbotId: string,
    status: "active" | "inactive"
  ): Promise<void> {
    const response = await this.fetchWithAuth(
      `/chatbots/${chatbotId}/status?status=${status}`,
      {
        method: "PATCH",
      }
    );
    await this.handleResponse<{ message: string }>(response);
  }

  // ==================== Chat ====================

  static async chat(
    chatbotId: string,
    query: string,
    conversationId?: string
  ): Promise<MessageResponse> {
    const response = await this.fetchWithAuth(`/chatbots/${chatbotId}/chat`, {
      method: "POST",
      body: JSON.stringify({
        query,
        conversation_id: conversationId,
      }),
    });
    return this.handleResponse<MessageResponse>(response);
  }

  // Alias for backward compatibility
  static async askChatbot(
    chatbotId: string,
    query: string,
    conversationId?: string
  ): Promise<MessageResponse> {
    return this.chat(chatbotId, query, conversationId);
  }

  // ==================== API Keys ====================

  static async createAPIKey(
    chatbotId: string,
    name?: string,
    expiresInDays?: number
  ): Promise<APIKey> {
    const response = await this.fetchWithAuth(`/chatbots/${chatbotId}/api-keys`, {
      method: "POST",
      body: JSON.stringify({
        name,
        expires_in_days: expiresInDays,
      }),
    });
    return this.handleResponse<APIKey>(response);
  }

  static async getAPIKeys(chatbotId: string): Promise<APIKey[]> {
    const response = await this.fetchWithAuth(`/chatbots/${chatbotId}/api-keys`);
    return this.handleResponse<APIKey[]>(response);
  }

  static async deleteAPIKey(chatbotId: string, keyId: number): Promise<void> {
    const response = await this.fetchWithAuth(
      `/chatbots/${chatbotId}/api-keys/${keyId}`,
      {
        method: "DELETE",
      }
    );
    await this.handleResponse<{ message: string }>(response);
  }

  // ==================== Conversations ====================

  static async getConversations(chatbotId: string): Promise<Conversation[]> {
    const response = await this.fetchWithAuth(
      `/chatbots/${chatbotId}/conversations`
    );
    return this.handleResponse<Conversation[]>(response);
  }

  // ==================== Public API (for testing) ====================

  static async publicChat(
    chatbotId: string,
    apiKey: string,
    query: string,
    conversationId?: string
  ): Promise<MessageResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/${chatbotId}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        api_key: apiKey,
        conversation_id: conversationId,
      }),
      mode: "cors",
    });
    return this.handleResponse<MessageResponse>(response);
  }
}

// Export AuthManager for use in components
export { AuthManager };
