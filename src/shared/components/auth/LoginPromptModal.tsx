'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');

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
          <DialogTitle>{t('loginToUse')}</DialogTitle>
          <DialogDescription>
            {message || (feature ? t('loginPrompt', { feature }) : t('loginPromptDefault'))}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="p-4 bg-primary/5 rounded-lg border">
            <h4 className="font-medium mb-3">
              {t('benefitsTitle')}
            </h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" />
                {t('benefitUnlimitedSearch')}
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                {t('benefitAI')}
              </li>
              <li className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                {t('benefitFavorites')}
              </li>
              <li className="flex items-center gap-2">
                <Folder className="h-4 w-4 text-primary" />
                {t('benefitFolders')}
              </li>
              <li className="flex items-center gap-2">
                <Languages className="h-4 w-4 text-primary" />
                {t('benefitTranslate')}
              </li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            {tCommon('cancel')}
          </Button>
          <Button onClick={handleLogin} className="flex-1">
            {tCommon('login')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
