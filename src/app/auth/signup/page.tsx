"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import Link from "@/components/workspace/workspace-link";
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { WorkspaceAction as PixelButton } from "@/components/workspace/workspace-primitives"
import { useWorkspaceExperience } from "@/components/workspace/workspace-experience-provider"
import { AuthScene } from "@/components/workspace/auth-scene"
import { WorkspaceInput as PixelInput } from "@/components/workspace/workspace-primitives"
import { WorkspacePasswordInput as PixelPasswordInput } from "@/components/workspace/workspace-primitives"

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
  const { cancelPendingTransition } = useWorkspaceExperience()
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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "SIGNUP FAILED");
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

      cancelPendingTransition()
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "INVALID CODE");
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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "OAUTH FAILED");
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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "FAILED TO RESEND EMAIL");
    } finally {
      setResending(false);
    }
  };

  // OTP Verification View
  if (verifying) {
    return (
      <AuthScene artwork="/artwork/eighty-six/reference-set/03-lena-wind.webp" artworkLayout="left-panel" title="Verify your email" description="Check your inbox to activate your account.">
            <div className="space-y-6">


              {error && (
                <div role="alert" className="p-3 bg-red-500/20 border border-red-500 text-[#ffb2c5] font-[family-name:var(--font-workspace-body)] text-sm text-center">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                <div className="workspace-panel bg-primary/20 border border-primary p-6 text-center space-y-4">
                  <p className="text-sm font-bold ">CHECK YOUR MAIL</p>
                  <p className="text-sm leading-relaxed uppercase">
                    We&apos;ve sent a verification link to your email address.
                    Please click the link to activate your account.
                  </p>
                </div>

                <div className="text-center space-y-4">
                  <p className="text-sm text-[#bdd3f3]">Didn’t receive an email? Check your spam folder or try again later.</p>
                  {resendMessage && <p role="status" className="text-sm text-[#83efbd]">{resendMessage}</p>}
                  <PixelButton className="w-full" onClick={handleResendEmail} disabled={resending} variant="secondary">{resending ? "Sending…" : "Resend email"}</PixelButton>
                  <button type="button" onClick={() => setVerifying(false)} className="w-full min-h-11 text-[#44e4ff] hover:underline">Back to signup</button>
                </div>
              </div>
            </div>
          </AuthScene>
    );
  }

  // Signup Form View
  return (
    <AuthScene artwork="/artwork/eighty-six/reference-set/03-lena-wind.webp" artworkLayout="left-panel" title="Create an account" description="Make a portfolio people can explore.">
          <div className="space-y-6">


            {error && (
              <div role="alert" className="p-3 bg-red-500/20 border border-red-500 text-[#ffb2c5] font-[family-name:var(--font-workspace-body)] text-sm text-center">
                {error}
              </div>
            )}

            <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <PixelInput
                    label="FIRST NAME"
                    type="text"
                    placeholder="JOHN"
                    {...form.register("firstName")} aria-invalid={!!form.formState.errors.firstName} autoComplete="given-name"
                  />
                  {form.formState.errors.firstName && (
                    <p role="alert" className="font-[family-name:var(--font-workspace-body)] text-[#ffb2c5] text-sm mt-1">
                      {form.formState.errors.firstName.message}
                    </p>
                  )}
                </div>

                <div>
                  <PixelInput
                    label="LAST NAME"
                    type="text"
                    placeholder="DOE"
                    {...form.register("lastName")} aria-invalid={!!form.formState.errors.lastName} autoComplete="family-name"
                  />
                  {form.formState.errors.lastName && (
                    <p role="alert" className="font-[family-name:var(--font-workspace-body)] text-[#ffb2c5] text-sm mt-1">
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
                  {...form.register("username")} aria-invalid={!!form.formState.errors.username} autoComplete="username"
                />
                {form.formState.errors.username && (
                  <p role="alert" className="font-[family-name:var(--font-workspace-body)] text-[#ffb2c5] text-sm mt-1">
                    {form.formState.errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <PixelInput
                  label="EMAIL"
                  type="email"
                  placeholder="YOU@EXAMPLE.COM"
                  {...form.register("email")} aria-invalid={!!form.formState.errors.email} autoComplete="email"
                />
                {form.formState.errors.email && (
                  <p role="alert" className="font-[family-name:var(--font-workspace-body)] text-[#ffb2c5] text-sm mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className={"grid grid-cols-1 lg:grid-cols-2 gap-4"}>
                <div>
                  <PixelPasswordInput
                    label="PASSWORD"
                    placeholder="********"
                    {...form.register("password")} aria-invalid={!!form.formState.errors.password} autoComplete="new-password"
                    onChange={handlePasswordChange}
                  />
                  {form.formState.errors.password && (
                    <p role="alert" className="font-[family-name:var(--font-workspace-body)] text-[#ffb2c5] text-sm mt-1">
                      {form.formState.errors.password.message}
                    </p>
                  )}

                  {form.watch("password") && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-2 flex-1 border border-border ${i < passwordStrength / 25
                              ? getStrengthColor()
                              : "bg-muted"
                              }`}
                          />
                        ))}
                      </div>
                      <p className="font-[family-name:var(--font-workspace-body)] text-sm text-[#bdd3f3]">
                        STRENGTH: {getStrengthText()}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <PixelPasswordInput
                    label="CONFIRM PASSWORD"
                    placeholder="********"
                    {...form.register("confirmPassword")} aria-invalid={!!form.formState.errors.confirmPassword} autoComplete="new-password"
                  />
                  {form.formState.errors.confirmPassword && (
                    <p role="alert" className="font-[family-name:var(--font-workspace-body)] text-[#ffb2c5] text-sm mt-1">
                      {form.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="font-[family-name:var(--font-workspace-body)] text-center text-sm text-[#bdd3f3] leading-relaxed">
                By creating an account, you agree to our{" "}
                <Link href="/privacy?from=Signup" className="text-[#44e4ff] hover:underline">
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
                <div className="relative flex justify-center font-[family-name:var(--font-workspace-body)] text-sm">
                  <span className="bg-[#071657] px-2 text-[#bdd3f3]">
                    OR CONTINUE WITH
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <PixelButton
                  variant="secondary"
                  className="w-full text-sm"
                  onClick={() => handleOAuthSignUp("google")}
                  disabled={loading}
                  type="button"
                >
                  GOOGLE
                </PixelButton>
                <PixelButton
                  variant="secondary"
                  className="w-full text-sm"
                  onClick={() => handleOAuthSignUp("github")}
                  disabled={loading}
                  type="button"
                >
                  GITHUB
                </PixelButton>
              </div>
            </div>

            <p className="font-[family-name:var(--font-workspace-body)] text-center text-sm text-[#bdd3f3] leading-relaxed">
              ALREADY HAVE AN ACCOUNT?{" "}
              <Link href="/auth/login" className="text-[#44e4ff] hover:underline">
                LOG IN
              </Link>
            </p>
          </div>
        </AuthScene>
  );
}
