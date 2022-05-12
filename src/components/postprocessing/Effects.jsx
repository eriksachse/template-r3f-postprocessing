import * as THREE from "three";
import React, { useEffect, useRef, useMemo, useState } from "react";
import { extend, useFrame, useThree, createPortal } from "@react-three/fiber";
import {
  EffectComposer,
  ShaderPass,
  RenderPass,
  UnrealBloomPass,
  FilmPass,
} from "three-stdlib";
import { AfterPass } from "./AfterPass";
import { EffectPass } from "./EffectPass";

extend({
  EffectComposer,
  ShaderPass,
  RenderPass,
  EffectPass,
  UnrealBloomPass,
  FilmPass,
  AfterPass,
});

export default function Effects({ children, v1 }) {
  const [scene] = useState(() => new THREE.Scene());
  const composer = useRef();
  const effect = useRef();
  const water = useRef();
  const bloom = useRef();
  const after = useRef();
  const { gl, size, camera } = useThree();
  useEffect(
    () => void composer.current.setSize(size.width, size.height),
    [size]
  );
  useFrame(() => {
    bloom.current.strength = 0.1;
    effect.current.factor = 0.2;

    after.current.value1 = 0.2;
    gl.autoClear = true;
    composer.current.render();
  }, 1);
  return createPortal(
    <>
      <effectComposer ref={composer} args={[gl]}>
        <renderPass attach="passes-0" scene={scene} camera={camera} />
        <effectPass attach="passes-1" ref={effect} />
        <unrealBloomPass
          attach="passes-2"
          ref={bloom}
          args={[undefined, 0.0, 1, 0.0]}
        />
        <afterPass attach="passes-3" ref={after} />
      </effectComposer>
      {children}
    </>,
    scene
  );
}
