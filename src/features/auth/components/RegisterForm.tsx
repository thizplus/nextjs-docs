"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRegister } from "../hooks/useAuth";
import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { FORM_LIMITS } from "@/shared/config/constants";

const registerSchema = z.object({
  username: z
    .string()
    .min(FORM_LIMITS.AUTH.USERNAME_MIN, { message: `Username ต้องมีอย่างน้อย ${FORM_LIMITS.AUTH.USERNAME_MIN} ตัวอักษร` })
    .max(FORM_LIMITS.AUTH.USERNAME_MAX, { message: `Username ต้องไม่เกิน ${FORM_LIMITS.AUTH.USERNAME_MAX} ตัวอักษร` })
    .regex(/^[a-zA-Z0-9]+$/, { message: "Username ต้องเป็นตัวอักษรและตัวเลขเท่านั้น" }),
  firstName: z.string().min(1, { message: "กรุณากรอกชื่อ" }).max(FORM_LIMITS.AUTH.NAME_MAX),
  lastName: z.string().min(1, { message: "กรุณากรอกนามสกุล" }).max(FORM_LIMITS.AUTH.NAME_MAX),
  email: z.string().email({ message: "กรุณากรอกอีเมลให้ถูกต้อง" }).max(FORM_LIMITS.AUTH.EMAIL_MAX),
  password: z
    .string()
    .min(FORM_LIMITS.AUTH.PASSWORD_MIN, { message: `รหัสผ่านต้องมีอย่างน้อย ${FORM_LIMITS.AUTH.PASSWORD_MIN} ตัวอักษร` })
    .max(FORM_LIMITS.AUTH.PASSWORD_MAX),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "รหัสผ่านไม่ตรงกัน",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegister();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setError(null);
    try {
      await registerMutation.mutateAsync({
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });
      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการลงทะเบียน";
      setError(message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8 bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">ลงทะเบียน</CardTitle>
          <CardDescription>สร้างบัญชีผู้ใช้ STOU Smart Tour</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ชื่อ</FormLabel>
                      <FormControl>
                        <Input placeholder="สมชาย" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>นามสกุล</FormLabel>
                      <FormControl>
                        <Input placeholder="ใจดี" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>อีเมล</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@stou.ac.th"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>รหัสผ่าน</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ยืนยันรหัสผ่าน</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                {registerMutation.isPending ? "กำลังลงทะเบียน..." : "ลงทะเบียน"}
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center text-sm">
            มีบัญชีแล้ว?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              เข้าสู่ระบบ
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
