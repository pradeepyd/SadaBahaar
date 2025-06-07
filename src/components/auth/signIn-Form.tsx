"use client";

import { SignIn, useClerk, useSignIn, useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signInSchema } from "../../../schemas/signInSchema";
import * as z from "zod";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { CardWrapper } from "../CardWrapper";
import { OauthProvider } from "./oauth";
import { FormError } from "./formError";
import { toast } from "sonner";

export const SignInForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { signIn, isLoaded, setActive } = useSignIn();
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
    const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [password,setPassword] = useState("");
  const { redirectToSignIn } = useClerk();
  const handleForgotPassword = async() => {
     if (!isLoaded) return;

    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier:email,
      });

      toast.success('Reset password email sent!');
      setSent(true);
    } catch (err: any) {
      toast.error(err.errors?.[0]?.message || 'Something went wrong');
    }
  }
  const oauthSignIn = async (provider: "oauth_google" | "oauth_github") => {
    try {
      provider === "oauth_google"
        ? setIsGoogleLoading(true)
        : setIsGithubLoading(true);

      await signIn?.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (error) {
      console.error(error);
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
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    if (!isLoaded) return;

    setIsSubmitting(true);
    setAuthError(null);

    try {
      const result = await signIn.create({
        identifier: data.identifier,
        password: data.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        // console.error("Sign-in incomplete:", result);
        setAuthError("Sign-in could not be completed. Please try again.");
      }
    } catch (error: any) {
      // console.error("Sign-in error:", error);
      setAuthError(
        error.errors?.[0]?.message ||
          "An error occurred during sign-in. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <CardWrapper
      titleLabel="Welcome back"
      titleDescriptionLabel="Sign in to your account"
      footerDescription="Don't have an account?"
      backButtonHref="/sign-up"
      backButtonLabel="Sign up"
    >
      <OauthProvider
        onGithubClick={() => oauthSignIn("oauth_github")}
        onGoogleClick={() => oauthSignIn("oauth_google")}
        isGithubLoading={isGithubLoading}
        isGoogleLoading={isGoogleLoading}
      ></OauthProvider>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-3">
          <Label htmlFor="email" className="text-gray-200 text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 py-3 rounded-md"
            {...register("identifier", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
          <FormError message={authError}/>
         
        </div>

        {/* Password Field */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="text-gray-200 text-sm font-medium"
            >
              Password
            </Label>
            <button onClick={handleForgotPassword} className="p-0 h-auto text-xs font-normal text-purple-400 hover:text-purple-300 underline-offset-4">
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 py-3 pr-12 rounded-md"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
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
          <FormError message={errors.password?.message}/>
        </div>

        <Button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-base font-medium rounded-md"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </CardWrapper>
  );
};
