"use client";

import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent,
} from "react";
import * as THREE from "three";
import type { Project } from "./data";

interface ProjectMapProps {
  projects: Project[];
  onSelect: (project: Project) => void;
}

interface ProjectEntry {
  project: Project;
  mesh: THREE.Mesh;
  baseY: number;
  phase: number;
}

const PROJECT_POSITIONS: [number, number, number][] = [
  [-1.35, 0.45, 0.15],
  [0.15, -0.7, 0.95],
  [1.35, 0.4, -0.55],
  [-0.45, 1.4, -1.05],
  [1.15, -1.05, 1.1],
];

const COVER_PALETTES = [
  { background: "#e7ebe4", line: "#bac5b7", shape: "#9dad98" },
  { background: "#ece9e2", line: "#c9c1b5", shape: "#c0b29e" },
  { background: "#e5eaeb", line: "#bbc8ca", shape: "#a6babd" },
  { background: "#eee9e5", line: "#cabdb1", shape: "#c4ad9f" },
  { background: "#e8e9e2", line: "#c3c6b8", shape: "#b1b89e" },
];

function createCoverTexture(project: Project, index: number) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Unable to create a canvas texture for the project map.");
  }

  const palette = COVER_PALETTES[index % COVER_PALETTES.length];
  context.fillStyle = palette.background;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = palette.line;
  context.lineWidth = 1;
  for (let position = 0; position <= 256; position += 32) {
    context.beginPath();
    context.moveTo(position, 0);
    context.lineTo(position, 256);
    context.stroke();
    context.beginPath();
    context.moveTo(0, position);
    context.lineTo(256, position);
    context.stroke();
  }

  context.save();
  context.translate(132, 128);
  context.rotate(-0.28 + (index % 3) * 0.12);
  context.fillStyle = palette.shape;
  context.fillRect(-34, -88, 76, 160);
  context.fillStyle = "rgba(255, 255, 255, 0.58)";
  context.fillRect(6, -62, 54, 116);
  context.strokeStyle = "rgba(36, 37, 32, 0.35)";
  context.strokeRect(-34, -88, 94, 160);
  context.restore();

  context.fillStyle = "#34362f";
  context.font = '500 30px "DM Mono", monospace';
  context.fillText(project.num.slice(0, 2), 18, 42);
  context.font = '500 12px "DM Sans", Arial, sans-serif';
  context.fillText(project.name.slice(0, 24), 18, 232);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createEdge(geometry: THREE.BufferGeometry, opacity = 0.85) {
  const edges = new THREE.EdgesGeometry(geometry);
  const material = new THREE.LineBasicMaterial({
    color: "#c6c8bf",
    transparent: true,
    opacity,
  });
  return new THREE.LineSegments(edges, material);
}

export default function ProjectMap({ projects, onSelect }: ProjectMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mapShellRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const pointerActiveRef = useRef(false);
  const isDraggingRef = useRef(false);
  const didDragRef = useRef(false);
  const dragPositionRef = useRef({ x: 0, y: 0 });
  const rotationYRef = useRef(0.12);
  const rotationXRef = useRef(0);
  const hoveredEntryRef = useRef<ProjectEntry | null>(null);
  const pickProjectRef = useRef<((x: number, y: number) => Project | null) | null>(
    null,
  );
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const mapShell = mapShellRef.current;
    if (!canvas || !mapShell) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch (error) {
      console.error("Unable to initialize the interactive project map.", error);
      mapShell.classList.add("webgl-unavailable");
      return;
    }

    mapShell.classList.remove("webgl-unavailable");
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#f8f8f5");

    const camera = new THREE.PerspectiveCamera(
      43,
      canvas.clientWidth / Math.max(canvas.clientHeight, 1),
      0.1,
      60,
    );
    camera.position.set(4.9, 4.2, 7.2);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight("#ffffff", 2.15));
    const keyLight = new THREE.DirectionalLight("#ffffff", 2.1);
    keyLight.position.set(4, 7, 5);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight("#e8ece4", 1.15);
    fillLight.position.set(-4, 2, -4);
    scene.add(fillLight);

    const group = new THREE.Group();
    scene.add(group);

    const projectEntries: ProjectEntry[] = [];
    const entryByMesh = new Map<THREE.Object3D, ProjectEntry>();
    const raycaster = new THREE.Raycaster();

    projects.forEach((project, index) => {
      const geometry = new THREE.BoxGeometry(0.92, 0.92, 0.92);
      const displayFace = [4, 0, 2][index % 3];
      const texture =
        project.featured && index === 0
          ? new THREE.TextureLoader().load("/ProjectImage.jpg")
          : createCoverTexture(project, index);
      texture.colorSpace = THREE.SRGBColorSpace;

      const materials: THREE.Material[] = Array.from(
        { length: 6 },
        (_, face) =>
          face === displayFace
            ? new THREE.MeshBasicMaterial({ map: texture })
            : new THREE.MeshStandardMaterial({
                color: "#fdfdfa",
                roughness: 0.95,
                metalness: 0,
                transparent: true,
                opacity: 0.74,
              }),
      );

      const mesh = new THREE.Mesh(geometry, materials);
      const fallbackPosition: [number, number, number] = [
        ((index % 3) - 1) * 1.35,
        (Math.floor(index / 3) - 0.5) * 1.35,
        (index % 2) * 1.1 - 0.45,
      ];
      const position = PROJECT_POSITIONS[index] ?? fallbackPosition;
      mesh.position.set(...position);
      mesh.add(createEdge(geometry));
      group.add(mesh);

      const entry = {
        project,
        mesh,
        baseY: position[1],
        phase: index * 1.13,
      };
      projectEntries.push(entry);
      entryByMesh.set(mesh, entry);
    });

    const decorativePositions: [number, number, number, number][] = [
      [-2.2, 0.5, -0.15, 0.55],
      [-1.8, -1.25, 0.75, 0.42],
      [-0.2, 2, 0.25, 0.5],
      [1.95, 1.3, 0.1, 0.48],
      [2.15, -0.65, -0.8, 0.6],
      [-0.9, -1.9, -1.1, 0.48],
      [0.8, 1.8, 1.4, 0.42],
      [2.3, -1.55, 0.8, 0.44],
    ];

    decorativePositions.forEach(([x, y, z, size]) => {
      const geometry = new THREE.BoxGeometry(size, size, size);
      const material = new THREE.MeshBasicMaterial({
        color: "#ffffff",
        transparent: true,
        opacity: 0.45,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      mesh.add(createEdge(geometry, 0.52));
      group.add(mesh);
    });

    const mouse = new THREE.Vector2();
    const pickProject = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      mouse.set(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(mouse, camera);
      const hit = raycaster.intersectObjects(
        projectEntries.map((entry) => entry.mesh),
        false,
      )[0];
      return hit ? entryByMesh.get(hit.object)?.project ?? null : null;
    };
    pickProjectRef.current = pickProject;

    const resize = () => {
      const width = Math.max(canvas.clientWidth, 1);
      const height = Math.max(canvas.clientHeight, 1);
      camera.aspect = width / height;
      camera.fov = width < 560 ? 48 : 43;
      camera.position.set(
        width < 560 ? 4.2 : 4.9,
        width < 560 ? 4.6 : 4.2,
        width < 560 ? 7.7 : 7.2,
      );
      group.scale.setScalar(width < 560 ? 1.08 : 1.28);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const clock = new THREE.Clock();
    let animationFrame = 0;
    rotationYRef.current = 0.12;
    rotationXRef.current = 0;

    const animate = () => {
      animationFrame = window.requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.elapsedTime;

      if (!isDraggingRef.current) {
        if (!reducedMotion) {
          rotationYRef.current +=
            delta * (pointerActiveRef.current ? 0.045 : 0.09);
        }
        rotationXRef.current +=
          (Math.sin(elapsed * 0.28) * 0.035 - rotationXRef.current) * 0.04;
      }
      group.rotation.y = rotationYRef.current;
      group.rotation.x = rotationXRef.current;

      if (pointerActiveRef.current && !isDraggingRef.current) {
        mouse.set(pointerRef.current.x, pointerRef.current.y);
        raycaster.setFromCamera(mouse, camera);
        const hit = raycaster.intersectObjects(
          projectEntries.map((entry) => entry.mesh),
          false,
        )[0];
        const nextEntry = hit ? entryByMesh.get(hit.object) ?? null : null;
        if (nextEntry !== hoveredEntryRef.current) {
          hoveredEntryRef.current = nextEntry;
          setHoveredProject(nextEntry?.project ?? null);
        }
      }

      projectEntries.forEach((entry) => {
        const targetScale = entry === hoveredEntryRef.current ? 1.1 : 1;
        entry.mesh.scale.setScalar(
          entry.mesh.scale.x + (targetScale - entry.mesh.scale.x) * 0.12,
        );
        entry.mesh.position.y =
          entry.baseY +
          (entry === hoveredEntryRef.current
            ? 0
            : Math.sin(elapsed * 0.72 + entry.phase) * 0.045);
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      pickProjectRef.current = null;
      mapShell.classList.remove("webgl-unavailable");
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh || object instanceof THREE.LineSegments)) {
          return;
        }
        object.geometry.dispose();
        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];
        materials.forEach((material) => {
          if (
            material instanceof THREE.MeshBasicMaterial ||
            material instanceof THREE.MeshStandardMaterial
          ) {
            material.map?.dispose();
          }
          material.dispose();
        });
      });
      renderer.dispose();
    };
  }, [onSelect, projects]);

  const handlePointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();

    if (isDraggingRef.current) {
      const deltaX = event.clientX - dragPositionRef.current.x;
      const deltaY = event.clientY - dragPositionRef.current.y;
      if (Math.abs(deltaX) + Math.abs(deltaY) > 2) {
        didDragRef.current = true;
        pointerActiveRef.current = false;
        hoveredEntryRef.current = null;
        setHoveredProject(null);
        rotationYRef.current += deltaX * 0.008;
        rotationXRef.current = THREE.MathUtils.clamp(
          rotationXRef.current + deltaY * 0.006,
          -0.75,
          0.75,
        );
      }
      dragPositionRef.current = { x: event.clientX, y: event.clientY };
      event.preventDefault();
      return;
    }

    pointerRef.current = {
      x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
      y: -((event.clientY - rect.top) / rect.height) * 2 + 1,
    };
    pointerActiveRef.current = true;

    if (tooltipRef.current) {
      const left = Math.min(event.clientX - rect.left + 14, rect.width - 180);
      const top = Math.min(event.clientY - rect.top + 14, rect.height - 62);
      tooltipRef.current.style.left = `${Math.max(left, 4)}px`;
      tooltipRef.current.style.top = `${Math.max(top, 4)}px`;
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    if (event.button !== 0 && event.button !== 2) return;

    event.preventDefault();
    isDraggingRef.current = true;
    didDragRef.current = false;
    dragPositionRef.current = { x: event.clientX, y: event.clientY };
    pointerActiveRef.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    const rect = event.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
      y: -((event.clientY - rect.top) / rect.height) * 2 + 1,
    };
    pointerActiveRef.current = true;
  };

  const handlePointerCancel = () => {
    isDraggingRef.current = false;
    didDragRef.current = false;
    pointerActiveRef.current = false;
    hoveredEntryRef.current = null;
    setHoveredProject(null);
  };

  const handlePointerLeave = () => {
    if (isDraggingRef.current) return;
    pointerActiveRef.current = false;
    hoveredEntryRef.current = null;
    setHoveredProject(null);
  };

  const handleCanvasClick = (event: ReactMouseEvent<HTMLCanvasElement>) => {
    if (event.button !== 0 || didDragRef.current) {
      didDragRef.current = false;
      return;
    }
    const project =
      hoveredEntryRef.current?.project ??
      pickProjectRef.current?.(event.clientX, event.clientY);
    if (project) onSelect(project);
  };

  return (
    <div className="project-map-wrap">
      <div className="project-map-shell" ref={mapShellRef}>
        <canvas
          ref={canvasRef}
          className="project-map-canvas"
          aria-label="Interactive 3D map of selected software projects"
          aria-describedby="project-map-help"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onPointerLeave={handlePointerLeave}
          onClick={handleCanvasClick}
          onContextMenu={(event) => event.preventDefault()}
        />
        <div
          ref={tooltipRef}
          className={`map-tooltip${hoveredProject ? " visible" : ""}`}
          aria-hidden="true"
        >
          {hoveredProject && (
            <>
              <span className="map-tooltip-number">{hoveredProject.num}</span>
              <span className="map-tooltip-title">{hoveredProject.name}</span>
              <span className="map-tooltip-action">Select to explore ↗</span>
            </>
          )}
        </div>
        <div className="map-fallback" role="status">
          The 3D preview is unavailable in this browser. The complete project
          index is available below.
        </div>
      </div>
      <div
        className="map-project-index"
        role="group"
        aria-label="Open a project"
      >
        <span className="map-index-label">Open project</span>
        {projects.map((project, index) => (
          <button
            key={project.num}
            type="button"
            className="map-index-button"
            aria-label={`Open ${project.name}`}
            onClick={() => onSelect(project)}
          >
            {String(index + 1).padStart(2, "0")}
          </button>
        ))}
      </div>
      <span className="sr-only" id="project-map-help">
        Move over a project cube to reveal its name. Hold and drag with either
        mouse button to rotate the project map. Select a cube or use the project
        buttons to open its details.
      </span>
    </div>
  );
}
