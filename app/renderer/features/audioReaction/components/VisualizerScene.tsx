import { Canvas } from '@react-three/fiber';
import RingVisualizer from './RingVisualizer';

export default function VisualizerScene() {
  return (
    <div className='absolute inset-0 flex h-full w-full items-center justify-center'>
      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        orthographic
        camera={{ position: [0, 0, 10], zoom: 100 }}
      >
        <RingVisualizer />
      </Canvas>
    </div>
  );
}
