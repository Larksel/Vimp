declare module 'csstype' {
  interface Properties {
    WebkitAppRegion?: 'drag' | 'no-drag';
  }
}

export default function AppBar() {
  return (
    <div
      className='bg-background-base h-(--appbar-height) w-full select-none'
      style={{
        WebkitAppRegion: 'drag',
      }}
    />
  );
}
