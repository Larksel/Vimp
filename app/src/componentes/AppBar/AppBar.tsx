declare module 'csstype' {
  interface Properties {
    WebkitAppRegion?: 'drag' | 'no-drag';
  }
}

export default function AppBar() {
  return (
    <div
      className='col-span-4 row-span-1 h-full w-full select-none bg-black'
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
