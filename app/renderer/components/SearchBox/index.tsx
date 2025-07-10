import { InputHTMLAttributes, useCallback, useState } from 'react';
import { Input } from '@components/common/input';
import { cn } from '@render-utils/utils';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import debounce from 'lodash/debounce';
import { Button } from '@components/common/button';

interface SearchBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  canChangeVisibility: boolean;
  onSearch: (search: string) => void;
}

export default function SearchBox(props: SearchBoxProps) {
  const {
    name,
    canChangeVisibility,
    onSearch,
    className,
    placeholder,
    ...rest
  } = props;
  // Using the negation of the 'canChangeVisibility' prop to achieve the following behavior:
  // - When 'canChangeVisibility' is true, the search box will be hidden by default.
  // - When 'canChangeVisibility' is false, the search box will always be visible.
  const [isVisible, setIsVisible] = useState(!canChangeVisibility);
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSetSearch = useCallback(
    debounce((value) => {
      onSearch(value);
    }, 300),
    [],
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    debouncedSetSearch(value);
  };

  const toggleVisibility = () => {
    if (!canChangeVisibility) return;

    if (isVisible) {
      handleSearchChange('');
    }

    setIsVisible(!isVisible);
  };

  return (
    <div
      className={cn(
        `relative flex h-full max-h-10 w-full items-center overflow-hidden rounded-full`,
        className,
      )}
    >
      <Button
        onClick={toggleVisibility}
        variant={'surface'}
        className={`text-text-secondary absolute left-0 flex aspect-square h-full max-h-10 items-center justify-center p-0 transition-all ${canChangeVisibility ? 'hover:text-text-primary' : 'cursor-default hover:bg-transparent active:bg-transparent'} ${isVisible ? 'bg-transparent hover:bg-transparent active:bg-transparent' : 'rounded-full'}`}
      >
        <MagnifyingGlassIcon className='size-full max-w-5' />
      </Button>
      <Input
        type='search'
        name={name}
        id={name}
        value={searchTerm}
        placeholder={isVisible ? (placeholder ?? 'Pesquisar...') : ''}
        className={`h-full pr-2 pl-8 transition-all ${!isVisible && 'invisible w-8 rounded-full'}`}
        onChange={({ target }) => handleSearchChange(target.value)}
        {...rest}
      />
    </div>
  );
}
