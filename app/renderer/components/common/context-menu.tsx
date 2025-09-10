import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import { CaretRightIcon } from '@phosphor-icons/react/dist/csr/CaretRight';
import { CircleIcon } from '@phosphor-icons/react/dist/csr/Circle';
import { CheckIcon } from '@phosphor-icons/react/dist/csr/Check';

import { cn } from '@renderer/utils/utils';
import {
  ComponentPropsWithRef,
  HTMLAttributes,
  ReactNode,
} from 'react';

const itemColors =
  'bg-elevated-base text-text-primary hover:bg-elevated-highlight active:bg-elevated-active';

const ContextMenu = ContextMenuPrimitive.Root;

const ContextMenuTrigger = ContextMenuPrimitive.Trigger;

const ContextMenuGroup = ContextMenuPrimitive.Group;

const ContextMenuPortal = ContextMenuPrimitive.Portal;

const ContextMenuSub = ContextMenuPrimitive.Sub;

const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

const ContextMenuSubTrigger = ({
  className,
  inset,
  children,
  ref,
  ...props
}: ComponentPropsWithRef<typeof ContextMenuPrimitive.SubTrigger> & {
  inset?: boolean;
}) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      itemColors,
      'text-text-primary data-[state=open]:bg-elevated-highlight flex h-10 cursor-default items-center gap-2 pr-4 pl-11 text-sm outline-none select-none',
      inset && 'pl-8',
      className,
    )}
    {...props}
  >
    {children}
    <CaretRightIcon className='ml-auto size-5' />
  </ContextMenuPrimitive.SubTrigger>
);
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName;

const ContextMenuSubContent = ({
  className,
  ref,
  ...props
}: ComponentPropsWithRef<typeof ContextMenuPrimitive.SubContent>) => (
  <ContextMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      'animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 border-elevated-highlight bg-elevated-base text-text-primary z-50 min-w-[8rem] overflow-hidden rounded-md border shadow-md',
      className,
    )}
    {...props}
  />
);
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName;

const ContextMenuContent = ({
  className,
  ref,
  ...props
}: ComponentPropsWithRef<typeof ContextMenuPrimitive.Content>) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(
        'animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 border-elevated-highlight bg-elevated-base text-text-primary z-50 min-w-[8rem] overflow-hidden rounded-md border shadow-md',
        className,
      )}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
);
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName;

const ContextMenuItem = ({
  className,
  inset,
  icon,
  children,
  ref,
  ...props
}: ComponentPropsWithRef<typeof ContextMenuPrimitive.Item> & {
  inset?: boolean;
  icon?: ReactNode;
}) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(
      'hover:bg-elevated-highlight active:bg-elevated-active relative flex h-10 cursor-default items-center pr-4 pl-11 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      inset && 'pl-8',
      className,
    )}
    {...props}
  >
    <span className='absolute left-4 flex size-5 items-center justify-center'>
      {icon}
    </span>
    {children}
  </ContextMenuPrimitive.Item>
);
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName;

const ContextMenuCheckboxItem = ({
  className,
  children,
  checked,
  ref,
  ...props
}: ComponentPropsWithRef<typeof ContextMenuPrimitive.CheckboxItem>) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      itemColors,
      'relative flex h-10 cursor-default items-center pr-4 pl-11 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className='absolute left-4 flex size-5 items-center justify-center'>
      <ContextMenuPrimitive.ItemIndicator>
        <CheckIcon className='size-5' />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
);
ContextMenuCheckboxItem.displayName =
  ContextMenuPrimitive.CheckboxItem.displayName;

const ContextMenuRadioItem = ({
  className,
  children,
  ref,
  ...props
}: ComponentPropsWithRef<typeof ContextMenuPrimitive.RadioItem>) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      itemColors,
      'relative flex h-10 cursor-default items-center pr-4 pl-11 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    {...props}
  >
    <span className='absolute left-4 flex size-5 items-center justify-center'>
      <ContextMenuPrimitive.ItemIndicator>
        <CircleIcon weight='fill' className='text-text-primary size-3' />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.RadioItem>
);
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName;

const ContextMenuLabel = ({
  className,
  inset,
  ref,
  ...props
}: ComponentPropsWithRef<typeof ContextMenuPrimitive.Label> & {
  inset?: boolean;
}) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn(
      'text-text-primary flex h-10 items-center px-4 text-sm font-semibold',
      inset && 'pl-8',
      className,
    )}
    {...props}
  />
);
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName;

const ContextMenuSeparator = ({
  className,
  ref,
  ...props
}: ComponentPropsWithRef<typeof ContextMenuPrimitive.Separator>) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    className={cn('bg-text-sub -mx-1 my-1 h-px', className)}
    {...props}
  />
);
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName;

const ContextMenuShortcut = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        'text-text-secondary ml-auto text-xs tracking-widest',
        className,
      )}
      {...props}
    />
  );
};
ContextMenuShortcut.displayName = 'ContextMenuShortcut';

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};
