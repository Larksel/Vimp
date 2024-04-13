declare module 'csstype' {
  interface Properties {
    WebkitAppRegion?: 'drag' | 'no-drag';
  }
}

export default function AppBar() {
  return (
    <div
      className='h-full w-full select-none'
      style={{
        WebkitAppRegion: 'drag',
      }}
    >
      {
        //TODO to be decided
      }
    </div>
  );
}
