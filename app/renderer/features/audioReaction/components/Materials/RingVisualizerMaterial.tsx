import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { audioDispatcher } from '@renderer/core/audioDispatcher';
import { ThreeElement } from '@react-three/fiber';

export const RingVisualizerMaterial = shaderMaterial(
  {
    uTime: 0,
    uAudioData: new THREE.DataTexture(
      new Float32Array(audioDispatcher.numPoints),
      audioDispatcher.numPoints,
      1,
      THREE.RedFormat,
      THREE.FloatType,
    ),
    uColor: new THREE.Color('#00f2ff'),
    uAmplitude: 1.0,
  },
  // Vertex Shader: Manipula a forma
  `
    varying vec2 vUv;
    uniform sampler2D uAudioData;
    uniform float uTime;
    uniform float uAmplitude;

    float readAudio(float t) {
      return texture2D(uAudioData, vec2(t, 0.0)).r;
    }

    void main() {
      vUv = uv;

      // uv.x em uma RingGeometry vai de 0 a 1 contornando o círculo.
      float angle = uv.x;
      float frequencyValue = readAudio(angle);

      // Deslocar o vértice radialmente
      vec2 radial2D = normalize(position.xy);
      vec3 radial = vec3(radial2D, 0.0);
      float displacement = frequencyValue * uAmplitude;
      vec3 newPosition = position + radial * displacement;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  // Fragment Shader: Manipula a cor e o brilho
  `
    varying vec2 vUv;
    uniform vec3 uColor;

    void main() {
      // Cria um leve degradê ou mantém a cor sólida para o Bloom agir
      gl_FragColor = vec4(uColor, 1.0);
    }
  `,
);

declare module '@react-three/fiber' {
  interface ThreeElements {
    ringVisualizerMaterial: ThreeElement<typeof RingVisualizerMaterial>;
  }
}
