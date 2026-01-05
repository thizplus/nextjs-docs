'use client';

import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Sparkles, Heart, Folder, Languages, Search } from 'lucide-react';

interface LoginPromptModalProps {
  open: boolean;
  onClose: () => void;
  feature?: string;
  message?: string;
}

export function LoginPromptModal({ open, onClose, feature, message }: LoginPromptModalProps) {
  const router = useRouter();

  const handleLogin = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('redirectTo', window.location.pathname);
    }
    router.push('/login');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>เข้าสู่ระบบเพื่อใช้งาน</DialogTitle>
          <DialogDescription>
            {message || `กรุณาเข้าสู่ระบบเพื่อใช้งาน${feature || 'ฟีเจอร์นี้'}`}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="p-4 bg-primary/5 rounded-lg border">
            <h4 className="font-medium mb-3">
              สิทธิประโยชน์เมื่อเข้าสู่ระบบ:
            </h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" />
                ค้นหาได้ไม่จำกัด
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                ใช้งาน AI สรุปข้อมูล
              </li>
              <li className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                บันทึกรายการโปรด
              </li>
              <li className="flex items-center gap-2">
                <Folder className="h-4 w-4 text-primary" />
                สร้างโฟลเดอร์เก็บข้อมูล
              </li>
              <li className="flex items-center gap-2">
                <Languages className="h-4 w-4 text-primary" />
                แปลภาษา
              </li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            ยกเลิก
          </Button>
          <Button onClick={handleLogin} className="flex-1">
            เข้าสู่ระบบ
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
