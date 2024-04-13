declare module 'csstype' {
  interface Properties {
    WebkitAppRegion?: 'drag' | 'no-drag';
  }
}

export default function AppBar({ className }) {
  return (
    <div
      className={className}
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
