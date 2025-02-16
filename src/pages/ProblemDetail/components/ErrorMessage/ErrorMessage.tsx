import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { statusMapping } from "@/utils/status"
import { AlertCircle } from "lucide-react"

interface ErrorMessageProps {
    message: string
    status: number
}

export default function ErrorMessage({message, status}: ErrorMessageProps) {
  return (
    <Alert className="mt-6 border-[1px] border-red-600 text-red-600 bg-red-100 rounded-xl">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{statusMapping[status]}
      </AlertTitle>
      <AlertDescription>
        {message}
      </AlertDescription>
    </Alert>
  )
}
