// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// export interface ChatbotCreationResponse {
//   status: string
//   vector_store: string
//   chatbot_id?: string
// }

// export interface ChatResponse {
//   answer: string
//   sources: string[]
// }

// export class BotFoundryAPI {
//   static async createChatbot(files: File[], businessName: string): Promise<ChatbotCreationResponse> {
//     console.log("hello")
//     const formData = new FormData()
    
//     // Add files to form data
//     files.forEach((file) => {
//       formData.append('files', file)
//     })
    
//     // Add business name as metadata
//     // formData.append('business_name', businessName)
//     console.log(API_BASE_URL)
//     try {
//       const response = await fetch(`${API_BASE_URL}/create`, {
//         method: 'POST',
//         body: formData,
//       })
      
//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.error || 'Failed to create chatbot')
//       }
      
//       const data = await response.json()
      
//       // Generate a unique chatbot ID for the frontend
//       const chatbotId = `bot_${Math.random().toString(36).substr(2, 9)}`
      
//       return {
//         ...data,
//         chatbot_id: chatbotId
//       }
//     } catch (error) {
//       console.error('Error creating chatbot:', error)
//       throw error
//     }
//   }
  
//   static async askChatbot(query: string): Promise<ChatResponse> {
//     try {
//       const response = await fetch(`${API_BASE_URL}/ask`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ query }),
//       })
      
//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.error || 'Failed to get response from chatbot')
//       }
      
//       return await response.json()
//     } catch (error) {
//       console.error('Error asking chatbot:', error)
//       throw error
//     }
//   }
  
// //   static async healthCheck(): Promise<boolean> {
// //     try {
// //       const response = await fetch(`${API_BASE_URL}/health`, {
// //         method: 'GET',
// //       })
// //       return response.ok
// //     } catch (error) {
// //       console.error('Health check failed:', error)
// //       return false
// //     }
// //   }
// }



// lib/api.ts

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Response shape from POST /create
export interface ChatbotCreationResponse {
  status: string;         // e.g. "Vector DB created successfully"
  vector_store: string;   // e.g. "rag_bot_store"
  chatbot_id?: string;    // optional unique ID you generate client‑side
}

// Response shape from POST /ask
export interface ChatResponse {
  answer: string;
  sources: string[];
}

export class BotFoundryAPI {
  /**
   * Create a new chatbot by uploading training files and business name.
   * @param files Array of File objects selected by the user
   * @param businessName The name to associate with this chatbot
   */
  static async createChatbot(
    files: File[],
    businessName: string
  ): Promise<ChatbotCreationResponse> {
    // Build the multipart form data
    const formData = new FormData();
    formData.append("business_name", businessName);
    files.forEach((file) => {
      formData.append("files", file);
    });

    // Send to your Flask backend
    const res = await fetch(`${API_BASE_URL}/create`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      // Try to extract a JSON error message
      let msg = "Failed to create chatbot";
      try {
        const err = await res.json();
        msg = err.error || msg;
      } catch {}
      throw new Error(msg);
    }

    const data = (await res.json()) as ChatbotCreationResponse;

    // Optionally generate a client‑side ID
    if (!data.chatbot_id) {
      data.chatbot_id = `bot_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
    }

    return data;
  }

  /**
   * Ask a question to your created chatbot.
   * @param chatbotId (optional) to select which bot; remove if single‑bot
   * @param query The user’s question
   */
  static async askChatbot(
    query: string,
    chatbotId?: string
  ): Promise<ChatResponse> {
    const payload: Record<string, any> = { query };
    if (chatbotId) payload.chatbot_id = chatbotId;

    const res = await fetch(`${API_BASE_URL}/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      let msg = "Failed to get response from chatbot";
      try {
        const err = await res.json();
        msg = err.error || msg;
      } catch {}
      throw new Error(msg);
    }

    return (await res.json()) as ChatResponse;
  }
}
