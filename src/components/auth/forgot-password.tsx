
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Loader2, ArrowLeft, Mail } from "lucide-react"

interface ForgotPasswordComponentProps {
  email: string
  setEmail: (email: string) => void
  password: string
  setPassword: (pw: string) => void
  code: string
  setCode: (code: string) => void
  isSubmitting: boolean
  isCodeSent: boolean
  onSendCode: (e: React.FormEvent) => void
  onResetPassword: (e: React.FormEvent) => void
  onBack: () => void
  error?: string
}

export default function ForgotPasswordComponent({
  email,
  setEmail,
  password,
  setPassword,
  code,
  setCode,
  isSubmitting,
  isCodeSent,
  onSendCode,
  onResetPassword,
  onBack,
  error,
}: ForgotPasswordComponentProps) {
  return (
    <Card className="w-full max-w-md mx-auto bg-black/40 backdrop-blur-sm border-gray-700/50">
      <CardHeader className="text-center pb-6">
        <div className="mx-auto w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mb-4">
          <Mail className="h-6 w-6 text-purple-400" />
        </div>
        <CardTitle className="text-2xl font-bold text-white mb-3">
          {isCodeSent ? "Check your email" : "Forgot your password?"}
        </CardTitle>
        <CardDescription className="text-gray-300 text-base">
          {isCodeSent
            ? `We've sent a password reset code to ${email}`
            : "Enter your email address and we'll send you a code to reset your password."}
        </CardDescription>
      </CardHeader>

      <Separator className="bg-gray-700/50" />

      <CardContent className="space-y-6 pt-6 px-8 pb-8">
        <form onSubmit={isCodeSent ? onResetPassword : onSendCode} className="space-y-6">
          {!isCodeSent ? (
            <div className="space-y-3">
              <Label htmlFor="email" className="text-gray-200 text-sm font-medium">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800/50 border-gray-600/50 text-white placeholder:text-gray-400 py-3 backdrop-blur-sm"
                required
              />
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <Label htmlFor="password" className="text-gray-200 text-sm font-medium">
                  New password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="code" className="text-gray-200 text-sm font-medium">
                  Reset code
                </Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-base font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isCodeSent ? "Resetting..." : "Sending..."}
              </>
            ) : isCodeSent ? (
              "Reset password"
            ) : (
              "Send reset code"
            )}
          </Button>
        </form>

        <Separator className="bg-gray-700/50 my-6" />

        <div className="flex items-center justify-center gap-2 text-sm text-gray-300 pt-2">
          <Button
            variant="link"
            className="p-0 h-auto font-normal text-purple-400 hover:text-purple-300 underline-offset-4"
            onClick={onBack}
          >
            <ArrowLeft className="mr-1 h-3 w-3" />
            Back to sign in
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
