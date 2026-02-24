import { useRef } from 'react';
import { extend, useFrame, ThreeElements } from '@react-three/fiber';
import useAudioData from '../hooks/useAudioData';
import * as THREE from 'three';
import { RingVisualizerMaterial } from './Materials/RingVisualizerMaterial';

extend({ RingVisualizerMaterial });

export default function RingVisualizer() {
  const { audioDataRef } = useAudioData();
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<ThreeElements['ringVisualizerMaterial']>(null);

  useFrame((state) => {
    const { frequencyData, bass, rmsLevel } = audioDataRef.current;

    const mat = materialRef.current;
    if (!mat) return;

    const tex = mat.uAudioData as THREE.DataTexture;
    tex.image.data?.set(frequencyData);
    tex.needsUpdate = true;

    mat.uTime = state.clock.getElapsedTime();
    mat.uAmplitude = 0.5 + rmsLevel * 0.5;

    if (meshRef.current) {
      const scale = 1 + bass * 0.2;
      meshRef.current.scale.set(scale, scale, 1);
    }
  });

  return (
    <group>
      <mesh ref={meshRef} rotation={[0, 0, -90 * (Math.PI / 180)]}>
        <ringGeometry args={[0.1, 1.5, 256]} />
        <ringVisualizerMaterial ref={materialRef} transparent />
      </mesh>
    </group>
  );
};
