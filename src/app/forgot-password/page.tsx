"use client"

import { useState, useEffect } from "react"
import { useAuth, useSignIn } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import type { NextPage } from "next"
import ForgotPasswordComponent from "@/components/auth/forgot-password"

const ForgotPasswordPage: NextPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { isSignedIn } = useAuth()
  const { isLoaded, signIn, setActive } = useSignIn()
  const router = useRouter()

  useEffect(() => {
    if (isSignedIn) router.push("/dashboard")
  }, [isSignedIn, router])

  if (!isLoaded) return null

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    try {
      await signIn?.create({
        strategy: "reset_password_email_code",
        identifier: email,
      })
      setIsCodeSent(true)
    } catch (err:any) {
      setError(err?.errors?.[0]?.longMessage || "Failed to send code")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    try {
      const result = await signIn?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      })

    if(result?.status === "complete") {
        await setActive({ session: result.createdSessionId })
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage || "Failed to reset password")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ForgotPasswordComponent
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      code={code}
      setCode={setCode}
      isSubmitting={isSubmitting}
      isCodeSent={isCodeSent}
      onSendCode={handleSendCode}
      onResetPassword={handleResetPassword}
      onBack={() => router.push("/sign-in")}
      error={error}
    />
  )
}

export default ForgotPasswordPage
