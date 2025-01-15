import { InputHTMLAttributes, useState } from 'react';
import { Input } from '@components/common/input';
import { cn } from '@render-utils/utils';
import { MagnifyingGlass } from '@phosphor-icons/react';

interface SearchBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  canChangeVisibility: boolean;
}

export default function SearchBox(props: SearchBoxProps) {
  const { name, canChangeVisibility, className, placeholder, ...rest } = props;
  const [searchTerm, setSearchTerm] = useState('');
  // Using the negation of the 'canChangeVisibility' prop to achieve the following behavior:
  // - When 'canChangeVisibility' is true, the search box will be hidden by default.
  // - When 'canChangeVisibility' is false, the search box will always be visible.
  const [isVisible, setIsVisible] = useState(!canChangeVisibility);

  const toggleVisibility = () => {
    if (!canChangeVisibility) return;

    if (isVisible) {
      setSearchTerm('');
    }

    setIsVisible(!isVisible);
  };

  return (
    <div
      className={cn(
        `relative flex h-8 w-full items-center overflow-hidden rounded`,
        className,
      )}
    >
      <button
        onClick={toggleVisibility}
        className={`absolute left-0 flex aspect-square h-full items-center justify-center text-neutral-400 transition-all ${canChangeVisibility && 'hover:text-white'} ${!isVisible && 'rounded-full'}`}
      >
        <MagnifyingGlass className='size-full max-w-5' />
      </button>
      <Input
        type='search'
        name={name}
        id={name}
        value={searchTerm}
        placeholder={isVisible ? (placeholder ?? 'Pesquisar...') : ''}
        className={`h-full pl-8 pr-2 transition-all ${!isVisible && 'invisible w-8 px-0'}`}
        {...rest}
      />
    </div>
  );
}
