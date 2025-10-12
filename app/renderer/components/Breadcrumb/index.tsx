import { Link } from 'react-router-dom';
import useBreadcrumb from '@renderer/hooks/useBreadcrumb';
import { CaretRightIcon } from '@phosphor-icons/react/dist/csr/CaretRight';

export default function Breadcrumb() {
  const breadcrumbs = useBreadcrumb();

  return (
    <nav aria-label='breadcrumb' className='flex items-center gap-2 capitalize'>
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const hasPath = !!crumb.path;

        const item =
          hasPath && !isLast ? (
            <Link to={crumb.path}>{crumb.name}</Link>
          ) : (
            <span>{crumb.name}</span>
          );

        const separator = !isLast && <CaretRightIcon weight='bold' />;

        return (
          <div key={crumb.path} className='flex items-center gap-2'>
            {item}
            {separator}
          </div>
        );
      })}
    </nav>
  );
}
