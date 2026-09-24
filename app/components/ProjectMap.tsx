"use client";

import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent,
} from "react";
import * as THREE from "three";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";
import type { Project } from "./data";

interface ProjectMapProps {
  projects: Project[];
  selectedProject: Project | null;
  onSelect: (project: Project) => void;
}

interface ProjectEntry {
  project: Project;
  mesh: THREE.Mesh;
  baseY: number;
  phase: number;
}

interface ViewTransition {
  elapsed: number;
  duration: number;
  fromCameraPosition: THREE.Vector3;
  toCameraPosition: THREE.Vector3;
  fromCameraTarget: THREE.Vector3;
  toCameraTarget: THREE.Vector3;
  fromRotationX: number;
  toRotationX: number;
  fromRotationY: number;
  toRotationY: number;
}

const PROJECT_CARD_WIDTH = 1.62;
const PROJECT_CARD_HEIGHT = 0.75;
const PROJECT_CARD_DEPTH = 0.24;
const PROJECT_COVER_WIDTH = 432;
const PROJECT_COVER_HEIGHT = 200;

const PROJECT_POSITIONS: [number, number, number][] = [
  [-1.35, 0.45, 0.15],
  [0.15, -0.7, 0.95],
  [1.35, 0.4, -0.55],
  [-0.45, 1.4, -1.05],
  [2.05, -1.05, 1.4],
];

const AUTO_ROTATION_SPEEDS = {
  horizontal: 0.36,
  vertical: 0.12,
};

const PROJECT_FOCUS_DISTANCE = 2.25;
const MOBILE_PROJECT_FOCUS_DISTANCE = 1.8;

const COVER_PALETTES = [
  { background: "#e7ebe4", line: "#bac5b7", shape: "#9dad98" },
  { background: "#ece9e2", line: "#c9c1b5", shape: "#c0b29e" },
  { background: "#e5eaeb", line: "#bbc8ca", shape: "#a6babd" },
  { background: "#eee9e5", line: "#cabdb1", shape: "#c4ad9f" },
  { background: "#e8e9e2", line: "#c3c6b8", shape: "#b1b89e" },
];

function createCoverTexture(project: Project, index: number) {
  const canvas = document.createElement("canvas");
  canvas.width = PROJECT_COVER_WIDTH;
  canvas.height = PROJECT_COVER_HEIGHT;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Unable to create a canvas texture for the project map.");
  }

  const palette = COVER_PALETTES[index % COVER_PALETTES.length];
  context.fillStyle = palette.background;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = palette.line;
  context.lineWidth = 1;
  for (let position = 0; position <= canvas.width; position += 36) {
    context.beginPath();
    context.moveTo(position, 0);
    context.lineTo(position, canvas.height);
    context.stroke();
  }
  for (let position = 0; position <= canvas.height; position += 30) {
    context.beginPath();
    context.moveTo(0, position);
    context.lineTo(canvas.width, position);
    context.stroke();
  }

  context.save();
  context.translate(canvas.width * 0.58, canvas.height / 2);
  context.rotate(-0.28 + (index % 3) * 0.12);
  context.fillStyle = palette.shape;
  context.fillRect(-50, -72, 104, 144);
  context.fillStyle = "rgba(255, 255, 255, 0.58)";
  context.fillRect(5, -48, 66, 104);
  context.strokeStyle = "rgba(36, 37, 32, 0.35)";
  context.strokeRect(-50, -72, 128, 144);
  context.restore();

  context.fillStyle = "#34362f";
  context.font = '500 26px "DM Mono", monospace';
  context.fillText(project.num.slice(0, 2), 18, 36);
  context.font = '500 14px "DM Sans", Arial, sans-serif';
  context.fillText(project.name.slice(0, 24), 18, canvas.height - 15);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createEdge(
  geometry: THREE.BufferGeometry,
  opacity = 0.95,
  linewidth = 1.8,
) {
  const edges = new THREE.EdgesGeometry(geometry);
  const lineGeometry = new LineSegmentsGeometry().fromEdgesGeometry(edges);
  edges.dispose();

  const material = new LineMaterial({
    alphaToCoverage: true,
    color: "#9ca397",
    transparent: true,
    opacity,
    linewidth,
  });

  return new LineSegments2(lineGeometry, material);
}

export default function ProjectMap({
  projects,
  selectedProject,
  onSelect,
}: ProjectMapProps) {
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
  const focusedEntryRef = useRef<ProjectEntry | null>(null);
  const focusedViewRef = useRef(false);
  const cameraTargetRef = useRef(new THREE.Vector3());
  const viewTransitionRef = useRef<ViewTransition | null>(null);
  const focusProjectRef = useRef<((project: Project) => void) | null>(null);
  const resetViewRef = useRef<(() => void) | null>(null);
  const previousSelectedProjectRef = useRef(selectedProject);
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
    focusedViewRef.current = false;
    focusedEntryRef.current = null;
    viewTransitionRef.current = null;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
      const geometry = new THREE.BoxGeometry(
        PROJECT_CARD_WIDTH,
        PROJECT_CARD_HEIGHT,
        PROJECT_CARD_DEPTH,
      );
      const texture =
        project.featured && index === 0
          ? new THREE.TextureLoader().load("/ProjectImage.jpg")
          : createCoverTexture(project, index);
      texture.colorSpace = THREE.SRGBColorSpace;

      const materials: THREE.Material[] = Array.from(
        { length: 6 },
        (_, face) =>
          face === 4 || face === 5
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
      mesh.add(createEdge(geometry, 0.52, 1.2));
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

    const getOverviewCameraPosition = (width: number) =>
      new THREE.Vector3(
        width < 560 ? 4.2 : 4.9,
        width < 560 ? 4.6 : 4.2,
        width < 560 ? 7.7 : 7.2,
      );

    const getProjectFocusDistance = (width: number, height: number) => {
      const isMobile = width < 560;
      const verticalHalfFov = THREE.MathUtils.degToRad((isMobile ? 48 : 43) / 2);
      const horizontalHalfFov = Math.atan(
        Math.tan(verticalHalfFov) * (Math.max(width, 1) / Math.max(height, 1)),
      );
      const focusScale = 1.06;
      const focusPadding = 1.2;
      const widthDistance =
        (PROJECT_CARD_WIDTH * group.scale.x * focusScale * focusPadding) /
        (2 * Math.tan(horizontalHalfFov));
      const heightDistance =
        (PROJECT_CARD_HEIGHT * group.scale.y * focusScale * focusPadding) /
        (2 * Math.tan(verticalHalfFov));

      return Math.max(
        isMobile ? MOBILE_PROJECT_FOCUS_DISTANCE : PROJECT_FOCUS_DISTANCE,
        widthDistance,
        heightDistance,
      );
    };

    const getNearestAngle = (current: number, target: number) =>
      current + Math.atan2(Math.sin(target - current), Math.cos(target - current));

    const startViewTransition = (
      cameraPosition: THREE.Vector3,
      cameraTarget: THREE.Vector3,
      rotationX: number,
      rotationY: number,
    ) => {
      const targetRotationX = getNearestAngle(rotationXRef.current, rotationX);
      const targetRotationY = getNearestAngle(rotationYRef.current, rotationY);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        camera.position.copy(cameraPosition);
        cameraTargetRef.current.copy(cameraTarget);
        rotationXRef.current = targetRotationX;
        rotationYRef.current = targetRotationY;
        group.rotation.set(targetRotationX, targetRotationY, 0);
        camera.lookAt(cameraTargetRef.current);
        viewTransitionRef.current = null;
        return;
      }

      viewTransitionRef.current = {
        elapsed: 0,
        duration: 1.6,
        fromCameraPosition: camera.position.clone(),
        toCameraPosition: cameraPosition,
        fromCameraTarget: cameraTargetRef.current.clone(),
        toCameraTarget: cameraTarget,
        fromRotationX: rotationXRef.current,
        toRotationX: targetRotationX,
        fromRotationY: rotationYRef.current,
        toRotationY: targetRotationY,
      };
    };

    const focusProject = (project: Project) => {
      const entry = projectEntries.find(
        (projectEntry) => projectEntry.project.num === project.num,
      );
      if (!entry) return;

      focusedViewRef.current = true;
      focusedEntryRef.current = entry;
      hoveredEntryRef.current = null;
      pointerActiveRef.current = false;
      setHoveredProject(null);

      const target = new THREE.Vector3(
        entry.mesh.position.x,
        entry.baseY,
        entry.mesh.position.z,
      ).multiplyScalar(group.scale.x);
      const cameraPosition = target
        .clone()
        .add(
          new THREE.Vector3(
            0,
            0,
            getProjectFocusDistance(canvas.clientWidth, canvas.clientHeight),
          ),
        );
      startViewTransition(cameraPosition, target, 0, 0);
    };

    const resetView = () => {
      focusedViewRef.current = false;
      focusedEntryRef.current = null;
      hoveredEntryRef.current = null;
      pointerActiveRef.current = false;
      setHoveredProject(null);
      startViewTransition(
        getOverviewCameraPosition(Math.max(canvas.clientWidth, 1)),
        new THREE.Vector3(),
        0,
        0.12,
      );
    };

    focusProjectRef.current = focusProject;
    resetViewRef.current = resetView;

    const resize = () => {
      const width = Math.max(canvas.clientWidth, 1);
      const height = Math.max(canvas.clientHeight, 1);
      camera.aspect = width / height;
      camera.fov = width < 560 ? 48 : 43;
      group.scale.setScalar(width < 560 ? 1.08 : 1.28);
      if (focusedViewRef.current && focusedEntryRef.current) {
        const entry = focusedEntryRef.current;
        const target = new THREE.Vector3(
          entry.mesh.position.x,
          entry.baseY,
          entry.mesh.position.z,
        ).multiplyScalar(group.scale.x);
        const cameraPosition = target
          .clone()
          .add(
            new THREE.Vector3(
              0,
              0,
              getProjectFocusDistance(width, height),
            ),
          );
        const transition = viewTransitionRef.current;
        if (transition) {
          transition.toCameraPosition.copy(cameraPosition);
          transition.toCameraTarget.copy(target);
        } else {
          camera.position.copy(cameraPosition);
          cameraTargetRef.current.copy(target);
        }
      } else if (!viewTransitionRef.current) {
        camera.position.copy(getOverviewCameraPosition(width));
        cameraTargetRef.current.set(0, 0, 0);
      }
      camera.lookAt(cameraTargetRef.current);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    const clock = new THREE.Clock();
    let animationFrame = 0;
    rotationYRef.current = 0.12;
    rotationXRef.current = 0;

    const animate = () => {
      animationFrame = window.requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.elapsedTime;

      const transition = viewTransitionRef.current;
      if (transition) {
        transition.elapsed = Math.min(
          transition.elapsed + delta,
          transition.duration,
        );
        const progress = transition.elapsed / transition.duration;
        const easedProgress = progress * progress * (3 - 2 * progress);
        camera.position.lerpVectors(
          transition.fromCameraPosition,
          transition.toCameraPosition,
          easedProgress,
        );
        cameraTargetRef.current.lerpVectors(
          transition.fromCameraTarget,
          transition.toCameraTarget,
          easedProgress,
        );
        rotationXRef.current = THREE.MathUtils.lerp(
          transition.fromRotationX,
          transition.toRotationX,
          easedProgress,
        );
        rotationYRef.current = THREE.MathUtils.lerp(
          transition.fromRotationY,
          transition.toRotationY,
          easedProgress,
        );

        if (progress >= 1) {
          camera.position.copy(transition.toCameraPosition);
          cameraTargetRef.current.copy(transition.toCameraTarget);
          rotationXRef.current = transition.toRotationX;
          rotationYRef.current = transition.toRotationY;
          viewTransitionRef.current = null;
        }
      } else if (!focusedViewRef.current && !isDraggingRef.current) {
        const hoverSpeedMultiplier = pointerActiveRef.current ? 0.5 : 1;
        rotationYRef.current +=
          delta * AUTO_ROTATION_SPEEDS.horizontal * hoverSpeedMultiplier;
        rotationXRef.current +=
          delta * AUTO_ROTATION_SPEEDS.vertical * hoverSpeedMultiplier;
      }
      group.rotation.y = rotationYRef.current;
      group.rotation.x = rotationXRef.current;
      camera.lookAt(cameraTargetRef.current);

      if (
        !focusedViewRef.current &&
        pointerActiveRef.current &&
        !isDraggingRef.current
      ) {
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
        const targetScale = focusedEntryRef.current
          ? entry === focusedEntryRef.current
            ? 1.06
            : 1
          : entry === hoveredEntryRef.current
            ? 1.1
            : 1;
        entry.mesh.scale.setScalar(
          entry.mesh.scale.x + (targetScale - entry.mesh.scale.x) * 0.12,
        );
        entry.mesh.position.y =
          entry === focusedEntryRef.current ||
          entry === hoveredEntryRef.current
            ? entry.baseY
            : entry.baseY + Math.sin(elapsed * 0.72 + entry.phase) * 0.045;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      pickProjectRef.current = null;
      focusProjectRef.current = null;
      resetViewRef.current = null;
      focusedEntryRef.current = null;
      focusedViewRef.current = false;
      viewTransitionRef.current = null;
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
  }, [projects]);

  useEffect(() => {
    if (previousSelectedProjectRef.current?.num === selectedProject?.num) return;
    const previousProject = previousSelectedProjectRef.current;
    previousSelectedProjectRef.current = selectedProject;
    if (previousProject && !selectedProject) resetViewRef.current?.();
  }, [selectedProject]);

  const handleProjectSelect = (project: Project) => {
    focusProjectRef.current?.(project);
    onSelect(project);
  };

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
        rotationXRef.current += deltaY * 0.006;
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
    if (focusedViewRef.current) return;

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
    if (project) handleProjectSelect(project);
  };

  return (
    <div className="project-map-wrap">
      <div
        className={`project-map-shell${selectedProject ? " project-focused" : ""}`}
        ref={mapShellRef}
      >
        <canvas
          ref={canvasRef}
          className="project-map-canvas"
          aria-label="Interactive 3D map of projects"
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
              <span className="map-tooltip-action">Click to zoom in ↗</span>
            </>
          )}
        </div>
          {selectedProject && (
            <div className="project-focus-caption" aria-live="polite">
              <span className="project-focus-number">
                {String(
                  projects.findIndex(
                    (project) => project.num === selectedProject.num,
                  ) + 1,
                ).padStart(2, "0")}
              </span>
              <h2 className="project-focus-title">{selectedProject.name}</h2>
            </div>
          )}
          <div className="map-fallback" role="status">
            The 3D preview is unavailable in this browser. Select a numbered
            project below to view its details.
          </div>
      </div>
      <div
        className="map-project-index sr-only"
        role="group"
        aria-label="Project selection"
      >
        {projects.map((project, index) => (
          <button
            key={project.num}
            type="button"
            className="map-index-button"
            aria-label={`Open ${project.name}`}
            onClick={() => handleProjectSelect(project)}
          >
            {String(index + 1).padStart(2, "0")}
          </button>
        ))}
      </div>
      <span className="sr-only" id="project-map-help">
        Move over a project card to reveal its name. Hold and drag with either
        mouse button to rotate the project map. Select a card to view its
        details below, or tab to the project choices.
      </span>
    </div>
  );
}
