'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Header } from '@/shared/components/layouts';
import { SearchBar } from '@/features/search';
import { PlaceCard, usePlaceSearch } from '@/features/places';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { useAuth } from '@/shared/hooks';
import {
  MapPin,
  Sparkles,
  AlertCircle,
  X,
  Heart,
  Folder,
  ChevronRight,
  Search,
} from 'lucide-react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated, isGuest } = useAuth();
  const isSearching = searchQuery.trim().length > 0;

  const t = useTranslations('homepage');
  const tCommon = useTranslations('common');
  const tSearch = useTranslations('search');

  // Only call API when user is searching
  // Note: Google Places API returns all results at once (max ~20), no pagination support
  const { data: placesData, isLoading, error } = usePlaceSearch(
    {
      q: searchQuery,
      pageSize: 20, // Google max is ~20
    },
    isSearching // Only enable when searching
  );

  const places = placesData?.results || [];
  const totalCount = placesData?.totalCount || 0;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                {t('heroTitle')}
              </h1>
              <p className="text-lg text-muted-foreground">
                {t('heroSubtitle')}
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <SearchBar
                  initialQuery={searchQuery}
                  placeholder={t('searchPlaceholder')}
                  onSearch={handleSearch}
                />
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap justify-center gap-3 pt-4">
                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard/ai">
                      <Button className="gap-2">
                        <Sparkles className="h-4 w-4" />
                        {t('aiMode')}
                      </Button>
                    </Link>
                    <Link href="/dashboard">
                      <Button variant="outline" className="gap-2">
                        <MapPin className="h-4 w-4" />
                        {tCommon('dashboard')}
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button className="gap-2">
                        <Sparkles className="h-4 w-4" />
                        {t('loginToUseAI')}
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Guest Banner */}
        {isGuest && (
          <section className="bg-primary/5 border-y">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{t('guestBannerTitle')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('guestBannerDesc')}
                    </p>
                  </div>
                </div>
                <Link href="/login">
                  <Button size="sm">
                    {tCommon('login')}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Search Results - Only show when searching */}
        {isSearching && (
          <section className="py-8 md:py-12">
            <div className="container mx-auto px-4 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    {t('searchResults')} &quot;{searchQuery}&quot;
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    {isLoading ? tSearch('searching') : tCommon('foundPlaces', { count: totalCount })}
                  </p>
                </div>
                <Button variant="ghost" onClick={clearSearch} className="gap-2">
                  <X className="h-4 w-4" />
                  {tCommon('clearSearch')}
                </Button>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="h-48 w-full rounded-lg" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              )}

              {/* Error State */}
              {error && !isLoading && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error instanceof Error
                      ? error.message
                      : tCommon('loadError')}
                  </AlertDescription>
                </Alert>
              )}

              {/* Places Grid */}
              {/* Note: Google Places API returns all results at once (max ~20) */}
              {!isLoading && !error && places.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {places.map((place) => (
                    <PlaceCard key={place.placeId} place={place} showDistance={false} />
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!isLoading && !error && places.length === 0 && (
                <div className="text-center py-12">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {t('noPlaceFound')} &quot;{searchQuery}&quot;
                  </p>
                  <Button variant="outline" onClick={clearSearch} className="mt-4">
                    {tCommon('clearSearch')}
                  </Button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Quick Search Tags - Show when not searching */}
        {!isSearching && (
          <section className="py-8 bg-muted/30">
            <div className="container mx-auto px-4 space-y-4">
              <h2 className="text-xl font-bold">{t('quickSearch')}</h2>
              <div className="flex flex-wrap gap-2">
                {(["chatuchak", "grandPalace", "lumphini", "iconsiam", "watArun", "chaoPhraya", "floatingMarket", "ayutthaya", "chiangmai", "phuket"] as const).map((placeKey) => (
                  <Button
                    key={placeKey}
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => handleSearch(t(`quickSearchPlaces.${placeKey}`))}
                  >
                    <Search className="h-3 w-3 mr-1" />
                    {t(`quickSearchPlaces.${placeKey}`)}
                  </Button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Features Section (Login Required) */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">{t('memberFeatures')}</h2>
              <p className="text-muted-foreground mt-2">
                {t('memberFeaturesDesc')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* AI Search */}
              <div className="p-6 rounded-lg border bg-card">
                <div className="p-3 bg-primary/10 rounded-full w-fit mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t('aiSummaryTitle')}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {t('aiSummaryDesc')}
                </p>
                {isAuthenticated ? (
                  <Link href="/dashboard/ai">
                    <Button size="sm">{t('useAI')}</Button>
                  </Link>
                ) : (
                  <Link href="/login">
                    <Button size="sm" variant="outline">
                      {tCommon('login')}
                    </Button>
                  </Link>
                )}
              </div>

              {/* Favorites */}
              <div className="p-6 rounded-lg border bg-card">
                <div className="p-3 bg-primary/10 rounded-full w-fit mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t('saveFavoritesTitle')}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {t('saveFavoritesDesc')}
                </p>
                {isAuthenticated ? (
                  <Link href="/dashboard/my-folder">
                    <Button size="sm">{t('viewFavorites')}</Button>
                  </Link>
                ) : (
                  <Link href="/login">
                    <Button size="sm" variant="outline">
                      {tCommon('login')}
                    </Button>
                  </Link>
                )}
              </div>

              {/* Folders */}
              <div className="p-6 rounded-lg border bg-card">
                <div className="p-3 bg-primary/10 rounded-full w-fit mb-4">
                  <Folder className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t('createFolderTitle')}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {t('createFolderDesc')}
                </p>
                {isAuthenticated ? (
                  <Link href="/dashboard/my-folder">
                    <Button size="sm">{t('manageFolders')}</Button>
                  </Link>
                ) : (
                  <Link href="/login">
                    <Button size="sm" variant="outline">
                      {tCommon('login')}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <div className="flex flex-col leading-tight">
                <span className="font-bold">STOU</span>
                <span className="text-[10px] text-muted-foreground">Smart Tour</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('footerDesc')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
