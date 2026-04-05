interface AppBarProps {
  absolutePos?: boolean;
}

export default function AppBar({ absolutePos }: AppBarProps) {
  return (
    <div
      className={`bg-background h-(--appbar-height) w-full shrink-0 select-none ${absolutePos && 'absolute top-0 right-0 left-0'}`}
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties & { WebkitAppRegion: string }}
    />
  );
}
