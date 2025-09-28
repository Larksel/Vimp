import { useLocation } from 'react-router-dom';
import { routes } from '@renderer/routes/routes';

interface BreadcrumbItem {
  name: string;
  path: string;
}

export const useBreadcrumb = (): BreadcrumbItem[] => {
  const { pathname } = useLocation();
  const pathnames = pathname.split('/').filter((x) => x);

  const breadcrumbs: BreadcrumbItem[] = [];
  let currentPath = '';

  // Include default root route
  breadcrumbs.push({
    name: routes.HOME.displayName,
    path: '/',
  });

  pathnames.forEach((value) => {
    if (value === routes.HOME.path) return;

    currentPath += `/${value}`;
    const routeKey = Object.keys(routes).find(
      (key) =>
        routes[key].path === value || routes[key].path === currentPath.slice(1),
    );

    if (routeKey) {
      const routeMeta = routes[routeKey];

      breadcrumbs.push({
        name: routeMeta.displayName,
        path: currentPath,
      });
    } else {
      breadcrumbs.push({
        name: value.charAt(0).toUpperCase() + value.slice(1),
        path: currentPath,
      });
    }
  });

  return breadcrumbs;
};
