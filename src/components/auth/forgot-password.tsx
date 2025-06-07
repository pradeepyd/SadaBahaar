"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { Loader2, ArrowLeft, Mail } from "lucide-react"
import { clerkClient } from "@clerk/nextjs/server"
import { SignIn } from "@clerk/nextjs"

interface ForgotPasswordFormData {
  email: string
}

export default function ForgotPasswordComponent() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>()

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true)
    try {
      // Simulate Clerk password reset API call
    //   await new Promise((resolve) => setTimeout(resolve, 2000))
    //   console.log("Password reset email sent to:", data.email)

      // In a real app, you would call Clerk's password reset function:
    //   await SignIn.create({
    //     strategy: "reset_password_email_code",
    //     identifier: data.email,
    //   })

      setIsEmailSent(true)
    } catch (error) {
      console.error("Password reset failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendEmail = async () => {
    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log("Password reset email resent to:", getValues("email"))
    } catch (error) {
      console.error("Failed to resend email:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isEmailSent) {
    return (
      <Card className="w-full max-w-md mx-auto bg-black/40 backdrop-blur-sm border-gray-700/50">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-purple-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-white mb-3">Check your email</CardTitle>
          <CardDescription className="text-gray-300 text-base">
            We've sent a password reset link to your email address
          </CardDescription>
        </CardHeader>

        <Separator className="bg-gray-700/50" />

        <CardContent className="space-y-6 pt-6 px-8 pb-8">
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-400">Didn't receive the email? Check your spam folder or try again.</p>

            <Button
              variant="outline"
              className="w-full bg-gray-800/50 border-gray-600/50 text-white hover:bg-gray-700/50 py-3 backdrop-blur-sm"
              onClick={handleResendEmail}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Resend email"
              )}
            </Button>
          </div>

          <Separator className="bg-gray-700/50 my-6" />

          <div className="flex items-center justify-center gap-2 text-sm text-gray-300 pt-2">
            <Button
              variant="link"
              className="p-0 h-auto font-normal text-purple-400 hover:text-purple-300 underline-offset-4"
            >
              <ArrowLeft className="mr-1 h-3 w-3" />
              Back to sign in
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-black/40 backdrop-blur-sm border-gray-700/50">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-white mb-3">Forgot your password?</CardTitle>
        <CardDescription className="text-gray-300 text-base">
          Enter your email address and we'll send you a link to reset your password
        </CardDescription>
      </CardHeader>

      <Separator className="bg-gray-700/50" />

      <CardContent className="space-y-6 pt-6 px-8 pb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="email" className="text-gray-200 text-sm font-medium">
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              className="bg-gray-800/50 border-gray-600/50 text-white placeholder:text-gray-400 py-3 backdrop-blur-sm"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-base font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending reset link...
              </>
            ) : (
              "Send reset link"
            )}
          </Button>
        </form>

        <Separator className="bg-gray-700/50 my-6" />

        <div className="flex items-center justify-center gap-2 text-sm text-gray-300 pt-2">
          <span>Remember your password?</span>
          <Button
            variant="link"
            className="p-0 h-auto font-normal text-purple-400 hover:text-purple-300 underline-offset-4"
          >
            <ArrowLeft className="mr-1 h-3 w-3" />
            Back to sign in
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
