import { Link } from 'react-router-dom';
import { useBreadcrumb } from '@renderer/hooks/useBreadcrumb';

export default function Breadcrumbs() {
  const breadcrumbs = useBreadcrumb();

  if (breadcrumbs.length < 1) {
    return null;
  }

  return (
    <nav aria-label='breadcrumb'>
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return (
          <span key={crumb.path} className='breadcrumb-item'>
            {isLast ? (
              <span className='breadcrumb-name current-page'>{crumb.name}</span>
            ) : (
              <>
                <Link to={crumb.path} className='breadcrumb-link'>
                  {crumb.name}
                </Link>
                <span className='breadcrumb-separator'> / </span>
              </>
            )}
          </span>
        );
      })}
    </nav>
  );
}
