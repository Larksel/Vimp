declare module 'csstype' {
  interface Properties {
    WebkitAppRegion?: 'drag' | 'no-drag';
  }
}

export default function AppBar() {
  return (
    <div
      className='h-(--appbar-height) w-full select-none bg-black'
      style={{
        WebkitAppRegion: 'drag',
      }}
    />
  );
}
