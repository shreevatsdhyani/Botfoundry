// "use client"

// import { useState } from "react"
// import { SharedLayout } from "@/components/shared-layout"
// import { FileUpload } from "@/components/file-upload"
// import { ResultCard } from "@/components/result-card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Loader2, Bot, Upload, Sparkles, AlertCircle, CheckCircle } from "lucide-react"
// import { create } from "domain"

// interface UploadedFile {
//   id: string
//   name: string
//   size: number
//   status: "uploading" | "success" | "error"
//   progress: number
//   error?: string
// }

// interface ChatbotResult {
//   id: string
//   name: string
//   apiKey: string
//   endpoint: string
//   createdAt: string
// }

// export default function CreateChatbot() {
//   const [businessName, setBusinessName] = useState("")
//   const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
//   const [isCreating, setIsCreating] = useState(false)
//   const [result, setResult] = useState<ChatbotResult | null>(null)
//   const [error, setError] = useState<string | null>(null)

//   const breadcrumbs = [{ label: "Dashboard", href: "/" }, { label: "Create Chatbot" }]

//   const handleCreateChatbot = async () => {
//     if (!businessName.trim()) {
//       setError("Please enter a business name")
//       return
//     }

//     const successfulFiles = uploadedFiles.filter((file) => file.status === "success")
//     if (successfulFiles.length === 0) {
//       setError("Please upload at least one file successfully")
//       return
//     }

//     setIsCreating(true)
//     setError(null)

//     // Simulate API call
//     try {
//       // Simulate API call delay
//       await createChatbotAPI(uploadedFiles, businessName)
      
//       // Simulate success/failure
//       if (Math.random() > 0.1) {
//         const newResult: ChatbotResult = {
//           id: `bot_${Math.random().toString(36).substr(2, 9)}`,
//           name: businessName,
//           apiKey: `sk-${Math.random().toString(36).substr(2, 32)}`,
//           endpoint: `https://api.botfoundry.com/v1/chatbots/bot_${Math.random().toString(36).substr(2, 9)}`,
//           createdAt: new Date().toISOString(),
//         }
//         setResult(newResult)
//       } else {
//         throw new Error("Failed to process training files. Please check file formats and try again.")
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "An unexpected error occurred")
//     } finally {
//       setIsCreating(false)
//     }
//   }

//   // Dummy API function to simulate chatbot creation
//   async function createChatbotAPI(files: UploadedFile[], businessName: string): Promise<void> {
//     // Simulate network delay
//     return new Promise((resolve) => setTimeout(resolve, 1500))
//   }

//   const canCreate = businessName.trim() && uploadedFiles.some((file) => file.status === "success") && !isCreating

//   return (
//     <SharedLayout breadcrumbs={breadcrumbs}>
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center space-x-3 mb-4">
//             <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
//               <Bot className="h-6 w-6 text-white" />
//             </div>
//             <div>
//               <h1 className="text-3xl font-bold text-black dark:text-white">Create New Chatbot</h1>
//               <p className="text-gray-600 dark:text-gray-400">
//                 Build an intelligent AI chatbot trained on your business data
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Success/Error Messages */}
//         {result && (
//           <div className="mb-8">
//             <Alert className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
//               <CheckCircle className="h-4 w-4 text-green-600" />
//               <AlertDescription className="text-green-800 dark:text-green-200">
//                 Chatbot created successfully! Your AI assistant is ready to use.
//               </AlertDescription>
//             </Alert>
//           </div>
//         )}

//         {error && (
//           <div className="mb-8">
//             <Alert variant="destructive">
//               <AlertCircle className="h-4 w-4" />
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           </div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Main Form */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* Business Details */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center space-x-2">
//                   <Sparkles className="h-5 w-5" />
//                   <span>Business Details</span>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div>
//                     <Label htmlFor="businessName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                       Business Name *
//                     </Label>
//                     <Input
//                       id="businessName"
//                       type="text"
//                       placeholder="e.g., Acme Inc."
//                       value={businessName}
//                       onChange={(e) => setBusinessName(e.target.value)}
//                       className="mt-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-black dark:focus:border-white focus:ring-black dark:focus:ring-white"
//                       disabled={isCreating}
//                     />
//                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                       This will be used to personalize your chatbot's responses
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* File Upload */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center space-x-2">
//                   <Upload className="h-5 w-5" />
//                   <span>Training Files</span>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <FileUpload onFilesChange={setUploadedFiles} />
//                 <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
//                   <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">💡 Tips for better results:</h4>
//                   <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
//                     <li>• Include FAQ documents, product manuals, and support guides</li>
//                     <li>• Use clear, well-structured content for better AI understanding</li>
//                     <li>• Multiple files help create more comprehensive responses</li>
//                   </ul>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Create Button */}
//             <div className="flex flex-col sm:flex-row gap-4">
//               <Button
//                 onClick={handleCreateChatbot}
//                 disabled={!canCreate}
//                 className="flex-1 h-12 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
//               >
//                 {isCreating ? (
//                   <>
//                     <Loader2 className="mr-2 h-5 w-5 animate-spin" />
//                     Creating...
//                   </>
//                 ) : (
//                   <>
//                     <Bot className="mr-2 h-5 w-5" />
//                     Create Chatbot
//                   </>
//                 )}
//               </Button>
//               <Button
//                 variant="outline"
//                 className="sm:w-auto w-full h-12 border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white"
//                 disabled={isCreating}
//               >
//                 Save as Draft
//               </Button>
//             </div>
//           </div>

//           {/* Sidebar */}
//           <div className="lg:col-span-1">
//             <div className="sticky top-24 space-y-6">
//               {/* Progress Indicator */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-lg">Creation Progress</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     <div className="flex items-center space-x-3">
//                       <div
//                         className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
//                           businessName.trim()
//                             ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
//                             : "bg-gray-100 dark:bg-gray-800 text-gray-500"
//                         }`}
//                       >
//                         {businessName.trim() ? "✓" : "1"}
//                       </div>
//                       <span
//                         className={`text-sm ${
//                           businessName.trim()
//                             ? "text-green-800 dark:text-green-200 font-medium"
//                             : "text-gray-600 dark:text-gray-400"
//                         }`}
//                       >
//                         Business Details
//                       </span>
//                     </div>

//                     <div className="flex items-center space-x-3">
//                       <div
//                         className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
//                           uploadedFiles.some((f) => f.status === "success")
//                             ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
//                             : "bg-gray-100 dark:bg-gray-800 text-gray-500"
//                         }`}
//                       >
//                         {uploadedFiles.some((f) => f.status === "success") ? "✓" : "2"}
//                       </div>
//                       <span
//                         className={`text-sm ${
//                           uploadedFiles.some((f) => f.status === "success")
//                             ? "text-green-800 dark:text-green-200 font-medium"
//                             : "text-gray-600 dark:text-gray-400"
//                         }`}
//                       >
//                         Training Files
//                       </span>
//                     </div>

//                     <div className="flex items-center space-x-3">
//                       <div
//                         className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
//                           result
//                             ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
//                             : "bg-gray-100 dark:bg-gray-800 text-gray-500"
//                         }`}
//                       >
//                         {result ? "✓" : "3"}
//                       </div>
//                       <span
//                         className={`text-sm ${
//                           result ? "text-green-800 dark:text-green-200 font-medium" : "text-gray-600 dark:text-gray-400"
//                         }`}
//                       >
//                         Chatbot Ready
//                       </span>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* File Summary */}
//               {uploadedFiles.length > 0 && (
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="text-lg">File Summary</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-2 text-sm">
//                       <div className="flex justify-between">
//                         <span className="text-gray-600 dark:text-gray-400">Total Files:</span>
//                         <span className="font-medium text-black dark:text-white">{uploadedFiles.length}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600 dark:text-gray-400">Successful:</span>
//                         <span className="font-medium text-green-600">
//                           {uploadedFiles.filter((f) => f.status === "success").length}
//                         </span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600 dark:text-gray-400">Failed:</span>
//                         <span className="font-medium text-red-600">
//                           {uploadedFiles.filter((f) => f.status === "error").length}
//                         </span>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Result Card */}
//         {result && (
//           <div className="mt-8">
//             <ResultCard result={result} />
//           </div>
//         )}
//       </div>
//     </SharedLayout>
//   )
// }



"use client"

import { FileUpload } from "@/components/file-upload"
import { ResultCard } from "@/components/result-card"
import { SharedLayout } from "@/components/shared-layout"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BotFoundryAPI } from "@/lib/api"
import { AlertCircle, Bot, CheckCircle, Loader2, Sparkles, Upload } from "lucide-react"
import { useState } from "react"

interface UploadedFile {
  id: string
  name: string
  size: number
  status: "uploading" | "success" | "error"
  progress: number
  error?: string
  file?: File // Real file object
}

interface ChatbotResult {
  id: string
  name: string
  apiKey: string
  endpoint: string
  createdAt: string
}

export default function CreateChatbot() {
  const [businessName, setBusinessName] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [result, setResult] = useState<ChatbotResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCreateChatbot = async () => {
    if (!businessName.trim()) {
      setError("Please enter a business name")
      return
    }

    const successfulFiles = uploadedFiles.filter((f) => f.status === "success" && f.file)
    if (successfulFiles.length === 0) {
      setError("Please upload at least one file successfully")
      return
    }

    setIsCreating(true)
    setError(null)

    try {
      const realFiles = successfulFiles.map((f) => f.file!) // Non-null asserted
      const res = await BotFoundryAPI.createChatbot(realFiles, businessName)

      setResult({
        id: res.chatbot_id!,
        name: businessName,
        apiKey: res.status,
        endpoint: res.vector_store,
        createdAt: new Date().toISOString(),
      })
    } catch (err: any) {
      setError(err.message || "Unexpected error")
    } finally {
      setIsCreating(false)
    }
  }

  const canCreate =
    businessName.trim() &&
    uploadedFiles.some((file) => file.status === "success") &&
    !isCreating

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Create Chatbot" },
  ]

  return (
    <SharedLayout breadcrumbs={breadcrumbs}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white">Create New Chatbot</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Build an intelligent AI chatbot trained on your business data
            </p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <Alert className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              Chatbot created successfully!
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5" />
              <span>Business Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="businessName">Business Name *</Label>
            <Input
              id="businessName"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              disabled={isCreating}
              placeholder="e.g. Acme Inc."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Training Files</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FileUpload onFilesChange={setUploadedFiles} />
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleCreateChatbot}
            disabled={!canCreate}
            className="flex-1 h-12 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Bot className="mr-2 h-5 w-5" />
                Create Chatbot
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="sm:w-auto w-full h-12 border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white"
            disabled={isCreating}
          >
            Save as Draft
          </Button>
        </div>

        {result && (
          <div className="mt-6">
            <ResultCard result={result} />
          </div>
        )}
      </div>
    </SharedLayout>
  )
}
