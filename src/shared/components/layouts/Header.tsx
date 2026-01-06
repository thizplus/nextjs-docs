'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { User, Heart, Folder, LogOut, MapPin, LayoutDashboard } from 'lucide-react';
import { ModeToggle } from './toggle-mode';
import { LanguageSwitcher } from '@/shared/components/common/LanguageSwitcher';

export function Header() {
  const { user, isAuthenticated, isGuest, logout, hasHydrated } = useAuth();
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
            <MapPin className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl leading-none">STOU</span>
            <span className="text-xs text-muted-foreground leading-none">Smart Tour</span>
          </div>
        </Link>

        {/* Auth Section */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ModeToggle />

          {!hasHydrated ? (
            <div className="w-20 h-9 bg-muted animate-pulse rounded-md" />
          ) : isAuthenticated && user ? (
            <>
              {/* Dashboard Link */}
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2 hidden sm:flex">
                  <LayoutDashboard className="h-4 w-4" />
                  {tCommon('dashboard')}
                </Button>
              </Link>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>
                        {user.firstName?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline text-sm">
                      {user.firstName || user.username}
                    </span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      {tCommon('dashboard')}
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      {t('profile')}
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/my-folder" className="flex items-center cursor-pointer">
                      <Folder className="mr-2 h-4 w-4" />
                      {t('myFolder')}
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={logout}
                    className="text-destructive cursor-pointer focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {tCommon('logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {/* Guest - Login Button */}
              <Link href="/login">
                <Button size="sm">{tCommon('login')}</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
