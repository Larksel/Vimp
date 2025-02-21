declare module 'csstype' {
  interface Properties {
    WebkitAppRegion?: 'drag' | 'no-drag';
  }
}

export default function AppBar() {
  return (
    <div
      className='bg-background h-(--appbar-height) w-full shrink-0 select-none'
      style={{
        WebkitAppRegion: 'drag',
      }}
    />
  );
}
