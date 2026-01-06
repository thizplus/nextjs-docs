import Link from "next/link";
import { MapPin } from "lucide-react";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { LoginAnimation } from "@/features/auth/components/LoginAnimation";
import { LanguageSwitcher } from "@/shared/components/common/LanguageSwitcher";

export default function RegisterPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <MapPin className="size-4" />
            </div>
            STOU Smart Tour
          </Link>
          <LanguageSwitcher />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <RegisterForm />
          </div>
        </div>
      </div>
      <div className="relative hidden lg:block overflow-hidden">
        <LoginAnimation />
      </div>
    </div>
  );
}
