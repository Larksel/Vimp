declare module 'csstype' {
  interface Properties {
    WebkitAppRegion?: 'drag' | 'no-drag';
  }
}

export default function AppBar() {
  return (
    <div
      className='w-full h-9 select-none shrink-0'
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
