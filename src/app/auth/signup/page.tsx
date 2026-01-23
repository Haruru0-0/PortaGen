"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { PixelButton } from "@/components/pixel-button"
import { PixelCard } from "@/components/pixel-card"
import { PixelInput } from "@/components/pixel-input"
import { PixelPasswordInput } from "@/components/pixel-password-input"
import { PixelClouds } from "@/components/pixel-clouds"
import { PixelCharacter } from "@/components/pixel-character"

// Validation schema
const signupSchema = z
  .object({
    firstName: z.string().min(1, { message: "FIRST NAME REQUIRED" }),
    lastName: z.string().min(1, { message: "LAST NAME REQUIRED" }),
    username: z
      .string()
      .min(3, { message: "USERNAME MUST BE 3+ CHARACTERS" })
      .max(20, { message: "USERNAME MUST BE 20 OR FEWER CHARACTERS" })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: "USERNAME CAN ONLY CONTAIN LETTERS, NUMBERS, AND UNDERSCORES",
      }),
    email: z.string().email({ message: "INVALID EMAIL FORMAT" }),
    password: z
      .string()
      .min(8, { message: "PASSWORD MUST BE 8+ CHARACTERS" })
      .regex(/[a-z]/, { message: "PASSWORD NEEDS LOWERCASE LETTER" })
      .regex(/[A-Z]/, { message: "PASSWORD NEEDS UPPERCASE LETTER" })
      .regex(/[0-9]/, { message: "PASSWORD NEEDS NUMBER" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "PASSWORDS DO NOT MATCH",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignUpPage() {
  const supabase = createClient();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[^a-zA-Z0-9]/)) strength += 25;
    return strength;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("password", e.target.value);
    setPasswordStrength(calculatePasswordStrength(e.target.value));
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 25) return "bg-red-500";
    if (passwordStrength <= 50) return "bg-yellow-500";
    if (passwordStrength <= 75) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength <= 25) return "WEAK";
    if (passwordStrength <= 50) return "FAIR";
    if (passwordStrength <= 75) return "GOOD";
    return "STRONG";
  };

  const onSubmit = async (data: SignupFormValues) => {
    setLoading(true);
    setError("");

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            username: data.username,
            full_name: `${data.firstName} ${data.lastName}`,
            first_name: data.firstName,
            last_name: data.lastName,
          },
        },
      });

      if (signUpError) throw signUpError;

      // Note: In a production app, you'd usually have a trigger to sync users 
      // or redirect to a page that handles database insertion.
      // For now, if the user is automatically signed in (or we have authData.user),
      // we might want to try to create the user record via an API call or similar.
      // However, Supabase's signUp might just return the user but require verification.

      if (authData.user) {
        setVerifying(true);
      }
    } catch (err: any) {
      setError(err.message || "SIGNUP FAILED");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.verifyOtp({
        email: form.getValues("email"),
        token: code,
        type: 'signup'
      });

      if (error) throw error;

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "INVALID CODE");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignUp = async (
    provider: "google" | "github"
  ) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/sso-callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "OAUTH FAILED");
    }
  };

  const handleResendEmail = async () => {
    setResending(true);
    setResendMessage("");
    setError("");
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: form.getValues("email"),
      });
      if (error) throw error;
      setResendMessage("EMAIL RESENT! CHECK YOUR INBOX.");
    } catch (err: any) {
      setError(err.message || "FAILED TO RESEND EMAIL");
    } finally {
      setResending(false);
    }
  };

  // OTP Verification View
  if (verifying) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4">
        <PixelClouds />

        <div className="fixed bottom-0 left-0 right-0 h-48 z-0">
          <div className="absolute bottom-0 w-full h-32 bg-linear-to-t from-[#8B5CF6] to-[#EC4899]" />
          <div className="absolute bottom-0 w-full flex justify-around items-end">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="bg-[#6D28D9]"
                style={{
                  width: "40px",
                  height: `${Math.random() * 60 + 40}px`,
                  opacity: 0.8,
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          <PixelCard>
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <PixelCharacter color="#8B5CF6" size={60} />
                </div>
                <h1 className="text-xl pixel-text-shadow">VERIFY EMAIL</h1>
                <p className="text-xs text-muted-foreground leading-relaxed uppercase">
                  Check your email for a verification link.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-500/20 border-2 border-red-500 text-red-500 text-[10px] text-center">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                <div className="pixel-card bg-primary/20 border-2 border-primary p-6 text-center space-y-4">
                  <p className="text-sm font-bold pixel-text-shadow">CHECK YOUR MAIL</p>
                  <p className="text-[10px] leading-relaxed uppercase">
                    We've sent a verification link to your email address.
                    Please click the link to activate your account.
                  </p>
                </div>

                <div className="text-center space-y-4">
                  <p className="text-[9px] text-muted-foreground uppercase">
                    Didn't receive an email? Check your spam folder or try again later.
                  </p>

                  {resendMessage && (
                    <p className="text-[10px] text-green-500 font-bold animate-pulse">{resendMessage}</p>
                  )}

                  <PixelButton
                    className="w-full text-[10px] mb-2"
                    onClick={handleResendEmail}
                    disabled={resending}
                    variant="secondary"
                  >
                    {resending ? "SENDING..." : "RESEND EMAIL"}
                  </PixelButton>

                  <button
                    type="button"
                    onClick={() => setVerifying(false)}
                    className="w-full text-[10px] text-muted-foreground hover:text-primary"
                  >
                    ← BACK TO SIGNUP
                  </button>
                </div>
              </div>
            </div>
          </PixelCard>
        </div>
      </div>
    );
  }

  // Signup Form View
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <PixelClouds />

      <div className="fixed bottom-0 left-0 right-0 h-48 z-0">
        <div className="absolute bottom-0 w-full h-32 bg-linear-to-t from-[#8B5CF6] to-[#EC4899]" />
        <div className="absolute bottom-0 w-full flex justify-around items-end">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="bg-[#6D28D9]"
              style={{
                width: "40px",
                height: `${Math.random() * 60 + 40}px`,
                opacity: 0.8,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <PixelCard>
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <PixelCharacter color="#8B5CF6" size={60} />
              </div>
              <h1 className="text-xl pixel-text-shadow">SIGN UP</h1>
              <p className="text-xs text-muted-foreground leading-relaxed">
                CREATE YOUR PIXEL PORTFOLIO
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/20 border-2 border-red-500 text-red-500 text-[10px] text-center">
                {error}
              </div>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <PixelInput
                    label="FIRST NAME"
                    type="text"
                    placeholder="JOHN"
                    {...form.register("firstName")}
                  />
                  {form.formState.errors.firstName && (
                    <p className="text-red-500 text-[10px] mt-1">
                      {form.formState.errors.firstName.message}
                    </p>
                  )}
                </div>

                <div>
                  <PixelInput
                    label="LAST NAME"
                    type="text"
                    placeholder="DOE"
                    {...form.register("lastName")}
                  />
                  {form.formState.errors.lastName && (
                    <p className="text-red-500 text-[10px] mt-1">
                      {form.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <PixelInput
                  label="USERNAME"
                  type="text"
                  placeholder="YOURUSERNAME"
                  {...form.register("username")}
                />
                {form.formState.errors.username && (
                  <p className="text-red-500 text-[10px] mt-1">
                    {form.formState.errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <PixelInput
                  label="EMAIL"
                  type="email"
                  placeholder="YOU@EXAMPLE.COM"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-red-500 text-[10px] mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className={"flex justify-between items-start gap-3"}>
                <div>
                  <PixelPasswordInput
                    label="PASSWORD"
                    placeholder="********"
                    {...form.register("password")}
                    onChange={handlePasswordChange}
                  />
                  {form.formState.errors.password && (
                    <p className="text-red-500 text-[10px] mt-1">
                      {form.formState.errors.password.message}
                    </p>
                  )}

                  {form.watch("password") && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-2 flex-1 border-2 border-border ${i < passwordStrength / 25
                              ? getStrengthColor()
                              : "bg-muted"
                              }`}
                          />
                        ))}
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        STRENGTH: {getStrengthText()}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <PixelPasswordInput
                    label="CONFIRM PASSWORD"
                    placeholder="********"
                    {...form.register("confirmPassword")}
                  />
                  {form.formState.errors.confirmPassword && (
                    <p className="text-red-500 text-[10px] mt-1">
                      {form.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-center text-[10px] text-muted-foreground leading-relaxed">
                By creating an account, you agree to our{" "}
                <Link href="/privacy?from=Signup" className="text-primary hover:underline">
                  Privacy Policy
                </Link>.
              </div>

              <PixelButton
                type="submit"
                variant="primary"
                className="w-full"
                disabled={loading}
              >
                {loading ? "CREATING..." : "CREATE ACCOUNT"}
              </PixelButton>
            </form>

            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-border" />
                </div>
                <div className="relative flex justify-center text-[10px]">
                  <span className="bg-card px-2 text-muted-foreground">
                    OR CONTINUE WITH
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <PixelButton
                  variant="secondary"
                  className="w-full text-[10px]"
                  onClick={() => handleOAuthSignUp("google")}
                  disabled={loading}
                  type="button"
                >
                  GOOGLE
                </PixelButton>
                <PixelButton
                  variant="secondary"
                  className="w-full text-[10px]"
                  onClick={() => handleOAuthSignUp("github")}
                  disabled={loading}
                  type="button"
                >
                  GITHUB
                </PixelButton>
              </div>
            </div>

            <p className="text-center text-[10px] text-muted-foreground leading-relaxed">
              ALREADY HAVE AN ACCOUNT?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                LOG IN
              </Link>
            </p>
          </div>
        </PixelCard>
      </div>
    </div>
  );
}
