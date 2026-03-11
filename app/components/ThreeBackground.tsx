"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/app/context/ThemeContext";
import * as THREE from "three";

function buildMobius(
  R = 1.4,
  w = 0.55,
  uSegs = 220,
  vSegs = 12,
): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  const verts: number[] = [],
    norms: number[] = [],
    uvs: number[] = [],
    idxs: number[] = [];

  for (let i = 0; i <= uSegs; i++) {
    const u = (i / uSegs) * Math.PI * 2;
    for (let j = 0; j <= vSegs; j++) {
      const v = (j / vSegs - 0.5) * w;
      const x = (R + v * Math.cos(u / 2)) * Math.cos(u);
      const y = (R + v * Math.cos(u / 2)) * Math.sin(u);
      const z = v * Math.sin(u / 2);
      verts.push(x, y, z);
      norms.push(0, 0, 1);
      uvs.push(i / uSegs, j / vSegs);
    }
  }
  for (let i = 0; i < uSegs; i++) {
    for (let j = 0; j < vSegs; j++) {
      const a = i * (vSegs + 1) + j;
      const b = a + vSegs + 1;
      idxs.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(norms, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(idxs);
  geo.computeVertexNormals();
  return geo;
}

export default function ThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
    });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      innerWidth / innerHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0, 5);

    let tX = 0,
      tY = 0,
      cX = 0,
      cY = 0;
    const onMouseMove = (e: MouseEvent) => {
      tX = (e.clientX / innerWidth - 0.5) * 2;
      tY = -(e.clientY / innerHeight - 0.5) * 2;
    };
    document.addEventListener("mousemove", onMouseMove);

    // Möbius strip
    const mGeo = buildMobius();

    const mMat = new THREE.MeshStandardMaterial({
      color: 0x0a0806,
      metalness: 1,
      roughness: 0.06,
      side: THREE.DoubleSide,
    });
    const mobius = new THREE.Mesh(mGeo, mMat);
    mobius.position.set(3, 0, -0.5);
    scene.add(mobius);

    const wMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      wireframe: true,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide,
    });
    const mobiusWire = new THREE.Mesh(mGeo, wMat);
    mobiusWire.position.copy(mobius.position);
    scene.add(mobiusWire);

    // Particles
    const pN = 2000;
    const pPos = new Float32Array(pN * 3);
    for (let i = 0; i < pN; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 22;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 22;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 12 - 3;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xf59e0b,
      size: 0.022,
      transparent: true,
      opacity: 0.3,
      sizeAttenuation: true,
    });
    scene.add(new THREE.Points(pGeo, pMat));

    // Floaters
    const floatersData: [
      THREE.BufferGeometry,
      number,
      number,
      number,
      number,
    ][] = [
      [new THREE.OctahedronGeometry(0.26), -4.5, 2.5, -1, 0.5],
      [new THREE.TetrahedronGeometry(0.2), -1.5, -2.8, 0, 0.65],
      [new THREE.IcosahedronGeometry(0.16), 1, 3, -2, 0.35],
      [new THREE.OctahedronGeometry(0.13), 5, -2, -1, 0.75],
      [new THREE.TetrahedronGeometry(0.28), -3.5, -1, -3, 0.45],
    ];
    const floaters: THREE.Mesh[] = [];
    floatersData.forEach(([geo, x, y, z, spd]) => {
      const m = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        wireframe: true,
        transparent: true,
        opacity: 0.16,
      });
      const mesh = new THREE.Mesh(geo, m);
      mesh.position.set(x, y, z);
      mesh.userData = { spd, off: Math.random() * Math.PI * 2 };
      scene.add(mesh);
      floaters.push(mesh);
    });

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.2));
    const pl1 = new THREE.PointLight(0xf59e0b, 3.5, 14);
    pl1.position.set(5, 3, 3);
    scene.add(pl1);
    const pl2 = new THREE.PointLight(0xfbbf24, 2, 14);
    pl2.position.set(-5, -3, 2);
    scene.add(pl2);

    function syncBg(isLight: boolean) {
      renderer.setClearColor(isLight ? 0xe8ecf0 : 0x0a0908, 1);
    }

    function updateSceneTheme(isLight: boolean) {
      const a = isLight ? 0x1d4ed8 : 0xf59e0b;
      const a2 = isLight ? 0x3b82f6 : 0xfbbf24;
      wMat.color.setHex(a);
      pMat.color.setHex(a);
      pl1.color.setHex(a);
      pl2.color.setHex(a2);
      floaters.forEach((f) =>
        (f.material as THREE.MeshBasicMaterial).color.setHex(a),
      );
      if (isLight) {
        mMat.color.setHex(0xe8ecf0);
        mMat.transparent = true;
        mMat.opacity = 0;
        wMat.opacity = 0.22;
        pMat.opacity = 0.5;
        floaters.forEach((f) => {
          (f.material as THREE.MeshBasicMaterial).opacity = 0.28;
        });
      } else {
        mMat.color.setHex(0x0a0806);
        mMat.transparent = false;
        mMat.opacity = 1;
        wMat.opacity = 0.1;
        pMat.opacity = 0.3;
        floaters.forEach((f) => {
          (f.material as THREE.MeshBasicMaterial).opacity = 0.16;
        });
      }
      syncBg(isLight);
    }

    syncBg(themeRef.current === "light");

    const clk = new THREE.Clock();
    let animId: number;
    let prevTheme = themeRef.current;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clk.getElapsedTime();

      // Sync theme changes
      if (themeRef.current !== prevTheme) {
        prevTheme = themeRef.current;
        updateSceneTheme(themeRef.current === "light");
      }

      cX += (tX - cX) * 0.035;
      cY += (tY - cY) * 0.035;
      camera.position.x = cX * 0.4;
      camera.position.y = cY * 0.25;
      camera.lookAt(0, 0, 0);

      const s = t * 0.09;
      mobius.rotation.x = s * 0.7 + Math.sin(t * 0.18) * 0.35;
      mobius.rotation.y = s * 1.0;
      mobius.rotation.z = s * 0.5 + Math.cos(t * 0.14) * 0.22;
      mobiusWire.rotation.copy(mobius.rotation);

      const floatY = Math.sin(t * 0.6) * 0.2;
      mobius.position.y = floatY;
      mobiusWire.position.y = floatY;

      scene.children.forEach((c) => {
        if ((c as THREE.Points).isPoints) {
          c.rotation.y = t * 0.016;
          c.rotation.x = t * 0.008;
        }
      });

      floaters.forEach((f) => {
        f.rotation.x += 0.008 * f.userData.spd;
        f.rotation.y += 0.013 * f.userData.spd;
        f.position.y += Math.sin(t * f.userData.spd + f.userData.off) * 0.003;
      });

      pl1.intensity = 3 + Math.sin(t * 1.3) * 0.5;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  return <canvas id="bg-canvas" ref={canvasRef} />;
}
