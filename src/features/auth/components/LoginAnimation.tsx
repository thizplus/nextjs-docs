"use client";

export function LoginAnimation() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 bg-primary overflow-hidden">
      {/* Multiple animated blobs */}
      <div className="absolute inset-0">
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-primary-foreground/20 rounded-full filter blur-3xl animate-blob" />
        <div className="absolute top-20 -right-32 w-[600px] h-[600px] bg-primary-foreground/15 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/4 w-[550px] h-[550px] bg-primary-foreground/15 rounded-full filter blur-3xl animate-blob animation-delay-3000" />
        <div className="absolute bottom-20 -right-20 w-[450px] h-[450px] bg-primary-foreground/20 rounded-full filter blur-3xl animate-blob animation-delay-4000" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-primary-foreground/10 rounded-full filter blur-3xl animate-blob animation-delay-5000" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <h2 className="text-4xl font-bold text-primary-foreground">STOU Smart Tour</h2>
        <p className="mt-4 text-xl text-primary-foreground/80">
          ระบบค้นหาสถานที่ท่องเที่ยวอัจฉริยะ
        </p>
        <p className="mt-2 text-primary-foreground/60">
          สำหรับมัคคุเทศก์และนักท่องเที่ยว
        </p>
      </div>
    </div>
  );
}
