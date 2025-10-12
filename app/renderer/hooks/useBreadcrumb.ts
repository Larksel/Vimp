import { matchPath, useLocation } from 'react-router-dom';
import { routes } from '@renderer/routes/routes';
import useLibraryStore from '@renderer/stores/useLibraryStore';

interface BreadcrumbItem {
  name: string;
  path: string;
}

export default function useBreadcrumb() {
  const { pathname } = useLocation();
  const pathnames = pathname.split('/').filter((x) => x);

  const routePatterns = Object.values(routes).map((route) => route.path);
  const breadcrumbs: BreadcrumbItem[] = [];
  let currentPath = '';

  // Include default root route
  breadcrumbs.push({
    name: routes.HOME.displayName,
    path: '/',
  });

  pathnames.forEach((value, index) => {
    if (value === routes.HOME.path) return;

    currentPath += `/${value}`;
    const previousSegment = index > 0 ? pathnames[index - 1] : '';

    const matchingPattern = routePatterns.find((pattern) =>
      matchPath(pattern, currentPath),
    );

    const routeDefinition = Object.values(routes).find(
      (route) => route.path === matchingPattern,
    );

    if (!routeDefinition) return;

    let name = '';
    if (matchingPattern?.includes('/:')) {
      // Is a dinamic route
      if (!previousSegment) name = routeDefinition.displayName;

      breadcrumbs.push({
        name: previousSegment,
        path: '',
      });

      // Usar o segmento anterior como o tipo de recurso
      const dynamicName = fetchDynamicName(previousSegment, value);

      if (dynamicName) {
        name = dynamicName;
      } else {
        name = `Detalhes`;
      }
    } else {
      // Is a static route
      name = routeDefinition.displayName;
    }

    if (name) {
      breadcrumbs.push({
        name: name,
        path: currentPath,
      });
    }
  });

  return breadcrumbs;
}

function fetchDynamicName(resourceType: string, id: string) {
  const libraryAPI = useLibraryStore.getState().api;

  if (resourceType === 'playlist') {
    const playlist = libraryAPI.getPlaylistFromID(id);
    if (!playlist) return;

    return playlist.title;
  }

  return;
}
