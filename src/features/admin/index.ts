// Admin Feature - Barrel Export

// Types
export * from './types';

// Service
export { adminService } from './service';

// Hooks
export {
  adminKeys,
  useAdminDashboard,
  usePageAnalytics,
  useFolderAnalytics,
  useFavoriteAnalytics,
  useCleanupPageViews,
  useTrackPageView,
} from './hooks/useAdminStats';

// Components
export { StatsCard } from './components/StatsCard';
export { TopItemsTable, TypeBadge } from './components/TopItemsTable';
export { TrendChart } from './components/TrendChart';
export { TypePieChart } from './components/TypePieChart';
