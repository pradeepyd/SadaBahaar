"use client";
import { useSignUp } from "@clerk/nextjs";
import { useState } from "react";
import * as z from "zod";
import { SignUpSchema } from "../../../schemas/signUpSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@heroui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { CardWrapper } from "../CardWrapper";
import { OauthProvider } from "./oauth";
import { FormError } from "./formError";
import { FormSuccess } from "./formSuccess";

export const SignUpForm = () => {
  const router = useRouter();
  const [verifying, setVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState<string | null>(
    null
  );
  const { signUp, isLoaded, setActive } = useSignUp();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [sendEmail, setSendEmail] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");

  const oauthSignIn = async (provider: "oauth_google" | "oauth_github") => {
    try {
      provider === "oauth_google"
        ? setIsGoogleLoading(true)
        : setIsGithubLoading(true);

      await signUp?.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch {
      setAuthError("OAuth authentication failed");
    } finally {
      setIsGoogleLoading(false);
      setIsGithubLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof SignUpSchema>) => {
    if (!isLoaded) return;
    setIsSubmitting(true);
    setAuthError(null);

    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setVerifying(true);
    } catch (error: any) {
      setAuthError(
        error.errors?.[0]?.message ||
          "An error occured during the signup. Please try again!"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;
    setIsSubmitting(true);
    setAuthError(null);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });
      //todo:console result
      if (result.status === "complete") {
        await setActive({
          session: result.createdSessionId,
        });
        router.push("/dashboard");
      } else {
        setVerificationError("Verification could not be complete");
      }
    } catch (error: any) {
      setVerificationError(
        error.errors?.[0]?.message ||
          "An error occured during the signup. Please try again!"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setSendEmail("sending");
    try {
      if (signUp) {
        await signUp?.prepareEmailAddressVerification({
          strategy: "email_code",
        });
        setSendEmail("sent");
        setTimeout(() => setSendEmail("idle"), 2000);
      }
    } catch (error) {
      setSendEmail("error");
      setTimeout(() => setSendEmail("idle"), 2000);
    }
  };
  if (verifying) {
    return (
      <CardWrapper
        titleLabel="Verify your email"
        titleDescriptionLabel="We've sent a verification code to your email"
        footerDescription="Didn't receive a code?"
        backButtonHref=""
        backButtonLabel="Resend code"
        backButtonDisabled={sendEmail === "sending"} 
        onClick={handleResend}
      >
        {sendEmail === "sending" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending email...
          </>
        ) : (
          sendEmail === "sent" && <FormSuccess message="Email has been sent" />
        )}

        {verificationError && <FormError message={verificationError} />}

        <form onSubmit={handleVerificationSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label
              htmlFor="verificationCode"
              className="text-gray-200 text-sm font-medium"
            >
              Verification code
            </Label>
            <Input
              id="verificationCode"
              placeholder="Enter verification code"
              className="text-center text-lg tracking-widest bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 py-3"
              value={verificationCode ?? ""}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-base font-medium rounded-md"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </Button>
        </form>
      </CardWrapper>
    );
  }
  return (
    <CardWrapper
      titleLabel="Create your account"
      titleDescriptionLabel="Enter your details to get started"
      footerDescription="Already have an account?"
      backButtonHref="/sign-in"
      backButtonLabel="Sign in"
    >
      {authError && <FormError message={authError} />}

      <OauthProvider
        onGithubClick={() => oauthSignIn("oauth_github")}
        onGoogleClick={() => oauthSignIn("oauth_google")}
        isGithubLoading={isGithubLoading}
        isGoogleLoading={isGoogleLoading}
      ></OauthProvider>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-3">
          <Label htmlFor="email" className="text-gray-200 text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 py-3"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
        </div>
        {/* Password Field */}
        <div className="space-y-4">
          <Label
            htmlFor="password"
            className="text-gray-200 text-sm font-medium"
          >
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 py-3 pr-12"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </Button>
          </div>
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-4">
          <Label
            htmlFor="confirmPassword"
            className="text-gray-200 text-sm font-medium"
          >
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 py-3 pr-12"
              {...register("confirmPassword", {
                required: "Please confirm your password",
              })}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </Button>
          </div>
         
        </div>
        <div
          id="clerk-captcha"
          data-cl-theme="dark"
          data-cl-size="normal"
          className="my-4"
        />
        <div className="mt-4 pt-3">
          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3  text-base font-medium rounded-md"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </div>
      </form>
    </CardWrapper>
  );
};
