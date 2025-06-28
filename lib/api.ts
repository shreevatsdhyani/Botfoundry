const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export interface ChatbotCreationResponse {
  status: string
  vector_store: string
  chatbot_id?: string
}

export interface ChatResponse {
  answer: string
  sources: string[]
}

export class BotFoundryAPI {
  static async createChatbot(files: File[], businessName: string): Promise<ChatbotCreationResponse> {
    console.log("hello")
    const formData = new FormData()
    
    // Add files to form data
    files.forEach((file) => {
      formData.append('files', file)
    })
    
    // Add business name as metadata
    formData.append('business_name', businessName)
    
    try {
      const response = await fetch(`${API_BASE_URL}/create`, {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create chatbot')
      }
      
      const data = await response.json()
      
      // Generate a unique chatbot ID for the frontend
      const chatbotId = `bot_${Math.random().toString(36).substr(2, 9)}`
      
      return {
        ...data,
        chatbot_id: chatbotId
      }
    } catch (error) {
      console.error('Error creating chatbot:', error)
      throw error
    }
  }
  
  static async askChatbot(query: string): Promise<ChatResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to get response from chatbot')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error asking chatbot:', error)
      throw error
    }
  }
  
//   static async healthCheck(): Promise<boolean> {
//     try {
//       const response = await fetch(`${API_BASE_URL}/health`, {
//         method: 'GET',
//       })
//       return response.ok
//     } catch (error) {
//       console.error('Health check failed:', error)
//       return false
//     }
//   }
}
