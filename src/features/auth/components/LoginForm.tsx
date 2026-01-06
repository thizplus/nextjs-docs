"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { AlertCircle, Mail, KeyRound, Eye, EyeOff } from "lucide-react";
import { authService } from "@/services/auth/auth.service";
import { useLogin } from "../hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email({ message: "กรุณากรอกอีเมลให้ถูกต้อง" }),
  password: z.string().min(1, { message: "กรุณากรอกรหัสผ่าน" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<'google' | 'line' | null>(null);
  const [isLineBrowser, setIsLineBrowser] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();
  const t = useTranslations("auth");

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Detect LINE in-app browser
  useEffect(() => {
    const userAgent = navigator.userAgent || "";
    const isLine = /Line/i.test(userAgent);
    setIsLineBrowser(isLine);
  }, []);

  const handleGoogleLogin = () => {
    setIsLoading('google');
    authService.redirectToGoogle();
  };

  const handleLineLogin = () => {
    setIsLoading('line');
    authService.redirectToLine();
  };

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);
    try {
      await loginMutation.mutateAsync(data);
      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการเข้าสู่ระบบ";
      setError(message);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">{t("loginTitle")}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {isLineBrowser
              ? t("loginWithLineOnly")
              : t("loginDescription")}
          </p>
        </div>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">{t("emailLogin")}</TabsTrigger>
            <TabsTrigger value="oauth">{t("socialLogin")}</TabsTrigger>
          </TabsList>

          {/* OAuth Login */}
          <TabsContent value="oauth" className="space-y-4 mt-4">
            <Button
              variant="outline"
              type="button"
              className="w-full bg-[#00B900] hover:bg-[#00A000] text-white border-[#00B900] hover:border-[#00A000]"
              onClick={handleLineLogin}
              disabled={isLoading !== null}
            >
              {isLoading === 'line' ? (
                <span className="animate-pulse">{t("loggingIn")}</span>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4" fill="currentColor">
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                  </svg>
                  {t("loginWithLine")}
                </>
              )}
            </Button>

            {/* Show Google login only if NOT in LINE browser */}
            {!isLineBrowser && (
              <Button
                variant="outline"
                type="button"
                className="w-full"
                onClick={handleGoogleLogin}
                disabled={isLoading !== null}
              >
                {isLoading === 'google' ? (
                  <span className="animate-pulse">{t("loggingIn")}</span>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    {t("loginWithGoogle")}
                  </>
                )}
              </Button>
            )}
          </TabsContent>

          {/* Email/Password Login */}
          <TabsContent value="email" className="space-y-4 mt-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@stou.ac.th"
                    className="pl-10"
                    {...form.register("email")}
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t("password")}</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    {...form.register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? t("loggingIn") : t("login")}
              </Button>
            </form>

            <div className="text-center text-sm">
              {t("noAccount")}{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                {t("register")}
              </Link>
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm text-muted-foreground">
          {t("loginBenefit")}
        </div>
      </div>
    </div>
  );
}
