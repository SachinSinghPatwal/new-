/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

import Grid from "./grid";
// import { AnimationConfig } from "../utils/animation-config";
import { preloadImages } from "../utils/preload-images";
// import { ImageItem } from "../lib/types";
import { imageData } from "../lib/data";
import Panel from "./panel";
import Heading from "../components/heading";

// Sample image data

export default function ImageGallery() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [selectedEffect] = useState("effect01");
  const gridRef = useRef(null);
  const moversRef = useRef([]);
  const panelRef = useRef(null);

  // Default configuration for animations
  const configRef = useRef({
    clipPathDirection: "top-bottom",
    autoAdjustHorizontalClipPath: true,
    steps: 6,
    stepDuration: 0.35,
    stepInterval: 0.05,
    moverPauseBeforeExit: 0.14,
    rotationRange: 0,
    wobbleStrength: 0,
    panelRevealEase: "sine.inOut",
    gridItemEase: "sine",
    moverEnterEase: "sine.in",
    moverExitEase: "sine",
    panelRevealDurationFactor: 2,
    clickedItemDurationFactor: 2,
    gridItemStaggerFactor: 0.3,
    moverBlendMode: false,
    pathMotion: "linear",
    sineAmplitude: 50,
    sineFrequency: Math.PI,
  });

  // Original config to reset after animations
  const originalConfigRef = useRef({ ...configRef.current });

  useEffect(() => {
    // Preload images when component mounts
    const preload = async () => {
      await preloadImages(".grid__item-image, .panel__img");
      document.body.classList.remove("loading");
    };

    preload();

    // Cleanup function to remove any movers on unmount
    return () => {
      moversRef.current.forEach((mover) => mover.remove());
      moversRef.current = [];
    };
  }, []);

  // Handle escape key to close panel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isPanelOpen && !isAnimating) {
        resetView();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isPanelOpen, isAnimating]);

  // Linear interpolation helper
  const lerp = (a, b, t) => a + (b - a) * t;

  // Get appropriate clip-paths depending on animation direction
  const getClipPathsForDirection = (direction) => {
    switch (direction) {
      case "bottom-top":
        return {
          from: "inset(0% 0% 100% 0%)",
          reveal: "inset(0% 0% 0% 0%)",
          hide: "inset(100% 0% 0% 0%)",
        };
      case "left-right":
        return {
          from: "inset(0% 100% 0% 0%)",
          reveal: "inset(0% 0% 0% 0%)",
          hide: "inset(0% 0% 0% 100%)",
        };
      case "right-left":
        return {
          from: "inset(0% 0% 0% 100%)",
          reveal: "inset(0% 0% 0% 0%)",
          hide: "inset(0% 100% 0% 0%)",
        };
      case "top-bottom":
      default:
        return {
          from: "inset(100% 0% 0% 0%)",
          reveal: "inset(0% 0% 0% 0%)",
          hide: "inset(0% 0% 100% 0%)",
        };
    }
  };

  // Calculate the center position of an element
  const getElementCenter = (el) => {
    const rect = el.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  };

  // Compute stagger delays for grid item exit animations
  const computeStaggerDelays = (clickedItem, items) => {
    const baseCenter = getElementCenter(clickedItem);
    const distances = items.map((el) => {
      const center = getElementCenter(el);
      return Math.hypot(center.x - baseCenter.x, center.y - baseCenter.y);
    });
    const max = Math.max(...distances);
    return distances.map(
      (d) => (d / max) * configRef.current.gridItemStaggerFactor
    );
  };

  // Position the panel based on which side the item was clicked
  const positionPanelBasedOnClick = (clickedItem) => {
    if (!panelRef.current) return;

    const centerX = getElementCenter(clickedItem).x;
    const windowHalf = window.innerWidth / 2;
    const isLeftSide = centerX < windowHalf;

    if (isLeftSide) {
      panelRef.current.classList.add("panel--right");
    } else {
      panelRef.current.classList.remove("panel--right");
    }

    // Flip clipPathDirection if enabled
    if (configRef.current.autoAdjustHorizontalClipPath) {
      if (
        configRef.current.clipPathDirection === "left-right" ||
        configRef.current.clipPathDirection === "right-left"
      ) {
        configRef.current.clipPathDirection = isLeftSide
          ? "left-right"
          : "right-left";
      }
    }
  };

  // Extract per-item configuration overrides from HTML data attributes
  const extractItemConfigOverrides = (item) => {
    const overrides = {};
    const dataset = item.dataset;

    if (dataset.clipPathDirection)
      overrides.clipPathDirection =
        dataset.clipPathDirection["clipPathDirection"];
    if (dataset.steps) overrides.steps = Number.parseInt(dataset.steps);
    if (dataset.stepDuration)
      overrides.stepDuration = Number.parseFloat(dataset.stepDuration);
    if (dataset.stepInterval)
      overrides.stepInterval = Number.parseFloat(dataset.stepInterval);
    if (dataset.rotationRange)
      overrides.rotationRange = Number.parseFloat(dataset.rotationRange);
    if (dataset.wobbleStrength)
      overrides.wobbleStrength = Number.parseFloat(dataset.wobbleStrength);
    if (dataset.moverPauseBeforeExit)
      overrides.moverPauseBeforeExit = Number.parseFloat(
        dataset.moverPauseBeforeExit
      );
    if (dataset.panelRevealEase)
      overrides.panelRevealEase = dataset.panelRevealEase;
    if (dataset.gridItemEase) overrides.gridItemEase = dataset.gridItemEase;
    if (dataset.moverEnterEase)
      overrides.moverEnterEase = dataset.moverEnterEase;
    if (dataset.moverExitEase) overrides.moverExitEase = dataset.moverExitEase;
    if (dataset.panelRevealDurationFactor)
      overrides.panelRevealDurationFactor = Number.parseFloat(
        dataset.panelRevealDurationFactor
      );
    if (dataset.clickedItemDurationFactor)
      overrides.clickedItemDurationFactor = Number.parseFloat(
        dataset.clickedItemDurationFactor
      );
    if (dataset.gridItemStaggerFactor)
      overrides.gridItemStaggerFactor = Number.parseFloat(
        dataset.gridItemStaggerFactor
      );
    if (dataset.moverBlendMode)
      overrides.moverBlendMode = dataset.moverBlendMode;
    if (
      dataset.pathMotion &&
      (dataset.pathMotion === "sine" || dataset.pathMotion === "linear")
    )
      overrides.pathMotion = dataset.pathMotion["pathMotion"];
    if (dataset.sineAmplitude)
      overrides.sineAmplitude = Number.parseFloat(dataset.sineAmplitude);
    if (dataset.sineFrequency)
      overrides.sineFrequency = Number.parseFloat(dataset.sineFrequency);

    return overrides;
  };

  // Generate motion path between start and end elements
  const generateMotionPath = (startRect, endRect, steps) => {
    const path = [];
    const fullSteps = steps + 2;
    const startCenter = {
      x: startRect.left + startRect.width / 2,
      y: startRect.top + startRect.height / 2,
    };
    const endCenter = {
      x: endRect.left + endRect.width / 2,
      y: endRect.top + endRect.height / 2,
    };

    for (let i = 0; i < fullSteps; i++) {
      const t = i / (fullSteps - 1);
      const width = lerp(startRect.width, endRect.width, t);
      const height = lerp(startRect.height, endRect.height, t);
      const centerX = lerp(startCenter.x, endCenter.x, t);
      const centerY = lerp(startCenter.y, endCenter.y, t);

      // Apply top offset (for sine motion)
      const sineOffset =
        configRef.current.pathMotion === "sine"
          ? Math.sin(t * configRef.current.sineFrequency) *
            configRef.current.sineAmplitude
          : 0;

      // Add random wobble
      const wobbleX = (Math.random() - 0.5) * configRef.current.wobbleStrength;
      const wobbleY = (Math.random() - 0.5) * configRef.current.wobbleStrength;

      path.push({
        left: centerX - width / 2 + wobbleX,
        top: centerY - height / 2 + sineOffset + wobbleY,
        width,
        height,
      });
    }

    return path.slice(1, -1);
  };

  // Create style for each mover element
  const createMoverStyle = (step, index, imgURL) => {
    const style = {
      backgroundImage: imgURL,
      position: "fixed",
      left: step.left + "px",
      top: step.top + "px",
      width: step.width + "px",
      height: step.height + "px",
      clipPath: getClipPathsForDirection(configRef.current.clipPathDirection)
        .from,
      zIndex: 1000 + index,
      backgroundPosition: "50% 50%",
      transform: `rotateZ(${gsap.utils.random(
        -configRef.current.rotationRange,
        configRef.current.rotationRange
      )}deg)`,
    };

    if (configRef.current.moverBlendMode)
      style.mixBlendMode = configRef.current.moverBlendMode;

    return style;
  };

  // Animate hiding the frame overlay
  const hideFrame = () => {
    const frameElements = document.querySelectorAll(".frame, .heading");
    gsap.to(frameElements, {
      opacity: 0,
      duration: 0.5,
      ease: "sine.inOut",
      pointerEvents: "none",
    });
  };

  // Animate showing the frame overlay
  const showFrame = () => {
    const frameElements = document.querySelectorAll(".frame, .heading");
    gsap.to(frameElements, {
      opacity: 1,
      duration: 0.5,
      ease: "sine.inOut",
      pointerEvents: "auto",
    });
  };

  // Animate all grid items fading/scaling out, except clicked one
  const animateGridItems = (items, clickedItem, delays) => {
    const clipPaths = getClipPathsForDirection(
      configRef.current.clipPathDirection
    );

    gsap.to(items, {
      opacity: 0,
      scale: (_, el) => (el === clickedItem ? 1 : 0.8),
      duration: (_, el) =>
        el === clickedItem
          ? configRef.current.stepDuration *
            configRef.current.clickedItemDurationFactor
          : 0.3,
      ease: configRef.current.gridItemEase,
      clipPath: (_, el) => (el === clickedItem ? clipPaths.from : "none"),
      delay: (i) => delays[i],
    });
  };

  // Animate the full transition (movers + panel reveal)
  const animateTransition = (startEl, endEl, imgURL) => {
    if (!gridRef.current) return;

    hideFrame();

    // Generate path between start and end
    const path = generateMotionPath(
      startEl.getBoundingClientRect(),
      endEl.getBoundingClientRect(),
      configRef.current.steps
    );

    const clipPaths = getClipPathsForDirection(
      configRef.current.clipPathDirection
    );

    // Create and animate movers
    path.forEach((step, index) => {
      const mover = document.createElement("div");
      mover.className = "mover";

      Object.assign(mover.style, createMoverStyle(step, index, imgURL));

      document.body.appendChild(mover);
      moversRef.current.push(mover);

      const delay = index * configRef.current.stepInterval;
      gsap
        .timeline({ delay })
        .fromTo(
          mover,
          { opacity: 0.4, clipPath: clipPaths.hide },
          {
            opacity: 1,
            clipPath: clipPaths.reveal,
            duration: configRef.current.stepDuration,
            ease: configRef.current.moverEnterEase,
          }
        )
        .to(
          mover,
          {
            clipPath: clipPaths.from,
            duration: configRef.current.stepDuration,
            ease: configRef.current.moverExitEase,
          },
          `+=${configRef.current.moverPauseBeforeExit}`
        );
    });

    // Schedule mover cleanup and panel reveal
    scheduleCleanup();
    revealPanel(endEl);
  };

  // Remove movers after their animation ends
  const scheduleCleanup = () => {
    const cleanupDelay =
      configRef.current.steps * configRef.current.stepInterval +
      configRef.current.stepDuration * 2 +
      configRef.current.moverPauseBeforeExit;

    gsap.delayedCall(cleanupDelay, () => {
      moversRef.current.forEach((m) => m.remove());
      moversRef.current = [];
    });
  };

  // Reveal the final panel with animated clip-path
  const revealPanel = (endImg) => {
    if (!panelRef.current) return;

    const panelContent = panelRef.current.querySelector(".panel__content");
    const clipPaths = getClipPathsForDirection(
      configRef.current.clipPathDirection
    );

    gsap.set(panelContent, { opacity: 0 });
    gsap.set(panelRef.current, { opacity: 1, pointerEvents: "auto" });

    gsap
      .timeline({
        defaults: {
          duration:
            configRef.current.stepDuration *
            configRef.current.panelRevealDurationFactor,
          ease: configRef.current.panelRevealEase,
        },
      })
      .fromTo(
        endImg,
        { clipPath: clipPaths.hide },
        {
          clipPath: clipPaths.reveal,
          pointerEvents: "auto",
          delay: configRef.current.steps * configRef.current.stepInterval,
        }
      )
      .fromTo(
        panelContent,
        { y: 25 },
        {
          duration: 1,
          ease: "expo",
          opacity: 1,
          y: 0,
          delay: configRef.current.steps * configRef.current.stepInterval,
          onComplete: () => {
            setIsAnimating(false);
            setIsPanelOpen(true);
          },
        },
        "<-=.2"
      );
  };

  // Handle click on a grid item and trigger the full transition
  const onGridItemClick = (item, element) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentItem(item);

    // Merge overrides into global config temporarily
    const overrides = extractItemConfigOverrides(element);
    configRef.current = { ...configRef.current, ...overrides };

    // Position the panel, with updated config
    positionPanelBasedOnClick(element);

    if (panelRef.current) {
      const panelImg = panelRef.current.querySelector(".panel__img");
      const gridItemImg = element.querySelector(".grid__item-image");

      if (panelImg && gridItemImg) {
        // Set panel content
        panelImg.style.backgroundImage = `url(${item.imageUrl})`;
        const panelTitle = panelRef.current.querySelector("h3");
        const panelDesc = panelRef.current.querySelector("p");

        if (panelTitle) panelTitle.textContent = item.title;
        if (panelDesc) panelDesc.textContent = item.description;

        // Get all grid items for animation
        const allItems = Array.from(document.querySelectorAll(".grid__item"));
        const delays = computeStaggerDelays(element, allItems);

        animateGridItems(allItems, element, delays);
        animateTransition(gridItemImg, panelImg, `url(${item.imageUrl})`);
      }
    }
  };

  // Reset everything and return to the initial grid view
  const resetView = () => {
    if (isAnimating || !currentItem) return;
    setIsAnimating(true);

    const allItems = Array.from(document.querySelectorAll(".grid__item"));
    const clickedItem = document.querySelector(`[data-id="${currentItem.id}"]`);

    if (clickedItem && panelRef.current) {
      const delays = computeStaggerDelays(clickedItem, allItems);
      const panelImg = panelRef.current.querySelector(".panel__img");

      gsap
        .timeline({
          defaults: { duration: configRef.current.stepDuration, ease: "expo" },
          onComplete: () => {
            if (panelRef.current) {
              panelRef.current.classList.remove("panel--right");
            }
            setIsAnimating(false);
            setIsPanelOpen(false);
            setCurrentItem(null);
          },
        })
        .to(panelRef.current, { opacity: 0 })
        .add(showFrame, 0)
        .set(panelRef.current, { opacity: 0, pointerEvents: "none" })
        .set(panelImg, {
          clipPath: "inset(0% 0% 100% 0%)",
        })
        .set(allItems, { clipPath: "none", opacity: 0, scale: 0.8 }, 0)
        .to(
          allItems,
          {
            opacity: 1,
            scale: 1,
            delay: (i) => delays[i],
          },
          ">"
        );
    }

    // Reset config to original values
    configRef.current = { ...originalConfigRef.current };
  };

  // Handle effect change
  //   const handleEffectChange = (effect: string) => {
  //     setSelectedEffect(effect);
  //   };

  return (
    <div className="gallery-container">
      <Heading
        title="Shane Weber"
        meta=" effect 01: straight linear paths, smooth easing, clean timing, minimal
          rotation."
      />
      <Grid
        ref={gridRef}
        items={imageData.filter(
          (item) => item.effect === selectedEffect || selectedEffect === "all"
        )}
        onItemClick={onGridItemClick}
      />
      <Heading
        title="Manika Jorge"
        meta=" effect 02: Adjusts mover count, rotation, timing, and animation feel."
      />
      <Grid
        ref={gridRef}
        items={imageData.filter((item) => item.effect === "effect02")}
        onItemClick={onGridItemClick}
        effectConfig={{
          steps: 8,
          rotationRange: 7,
          stepInterval: 0.05,
          moverPauseBeforeExit: 0.25,
          moverEnterEase: "sine.in",
          moverExitEase: "power2",
          panelRevealEase: "power2",
        }}
      />
      {/* <div className="heading">
        <h2 className="heading__title">Angela Wong</h2>
        <span className="heading__meta">
          effect 03: Big arcs, smooth start, powerful snap, slow reveal.
        </span>
      </div> */}
      <Heading
        title="Angela Wong"
        meta=" effect 03: Big arcs, smooth start, powerful snap, slow reveal."
      />
      <Grid
        ref={gridRef}
        items={imageData.filter((item) => item.effect === "effect03")}
        onItemClick={onGridItemClick}
        effectConfig={{
          steps: 10,
          stepDuration: 0.3,
          pathMotion: "sine",
          sineAmplitude: 300,
          clipPathDirection: "left-right",
          autoAdjustHorizontalClipPath: true,
          stepInterval: 0.07,
          moverPauseBeforeExit: 0.3,
          moverEnterEase: "sine",
          moverExitEase: "power4",
          panelRevealEase: "power4",
          panelRevealDurationFactor: 4,
        }}
      />
      <Heading
        title="Kaito Nakamo"
        meta=" effect 04: Quick upward motion with bold blending and smooth slow
          reveal."
      />
      <Grid
        ref={gridRef}
        items={imageData.filter((item) => item.effect === "effect04")}
        onItemClick={onGridItemClick}
        effectConfig={{
          steps: 4,
          clipPathDirection: "bottom-top",
          stepDuration: 0.25,
          stepInterval: 0.06,
          moverPauseBeforeExit: 0.2,
          moverEnterEase: "sine.in",
          moverExitEase: "expo",
          panelRevealEase: "expo",
          panelRevealDurationFactor: 4,
          moverBlendMode: "hard-light",
        }}
      />

      {/* --------------------------new--------------------------- */}
      <Heading
        title="Eliza Cortez"
        meta="effect 05: Diagonal spiral path with dramatic scaling and rotation for
          a dynamic transition."
      />
      <Grid
        ref={gridRef}
        items={imageData.filter((item) => item.effect === "effect05")}
        onItemClick={onGridItemClick}
        effectConfig={{
          steps: 7,
          clipPathDirection: "left-right",
          stepDuration: 0.4,
          stepInterval: 0.08,
          rotationRange: 15,
          wobbleStrength: 30,
          moverPauseBeforeExit: 0.3,
          moverEnterEase: "back.out(1.7)",
          moverExitEase: "power3.inOut",
          panelRevealEase: "power2.out",
          panelRevealDurationFactor: 3,
          pathMotion: "diagonal",
          sineAmplitude: 150,
          sineFrequency: Math.PI * 1.5,
        }}
      />

      <Heading
        title="Marcus Feng"
        meta="effect 06: Prismatic Dimension Shift - Physics-driven 3D morphing with color-true particles and premium motion quality."
      />

      <Grid
        ref={gridRef}
        items={imageData.filter((item) => item.effect === "effect06")}
        onItemClick={onGridItemClick}
        effectConfig={{
          // Core animation structure
          steps: 24, // Maximum smoothness
          clipPathDirection: "morph", // Advanced morphing transition
          morphShapes: ["circle", "polygon"], // Shape transformation during transition
          stepDuration: 0.18, // Fast but still visible
          stepInterval: 0.015, // Extremely tight intervals
          staggerPattern: "centerOut", // Items animate from center outwards

          // Advanced movement
          rotationRange: {
            // Dynamic 3D rotation
            x: [-2, 2],
            y: [-3, 3],
            z: [-5, 5],
          },
          perspective: 1200, // 3D perspective for depth

          // High-end timing & easing
          moverPauseBeforeExit: 0.08, // Minimal pause for maximum fluidity
          moverEnterEase: "custom", // Custom entrance ease
          customEnterEaseCurve: [0.2, 0, 0, 1], // Sharp initial movement with smooth finish
          moverExitEase: "custom", // Custom exit ease
          customExitEaseCurve: [0.9, 0, 0.1, 1], // Delayed start with quick exit
          panelRevealEase: "steps(3)", // Stepped reveal for modern digital feel
          panelRevealDurationFactor: 1.5, // Quick reveals

          // Color-preserving visual effects
          moverBlendMode: "normal", // Changed to normal to preserve original colors
          preserveImageColor: true, // Explicitly preserve image colors
          colorPreservationMode: "exact", // Ensure exact color matching during transitions

          pathMotion: "physics", // Advanced physics simulation
          physicsConfig: {
            // Realistic motion parameters
            gravity: 980,
            bounce: 0.35,
            friction: 0.12,
            turbulence: 0.08,
          },

          // Modified color-safe effects
          particleEmission: {
            // Particle effects during transition
            count: 8,
            lifespan: 0.8,
            size: [2, 5],
            color: "fromImage", // Take color from source image for particles
            opacity: [0.8, 0],
            colorSampling: "dominant", // Sample dominant colors from the image
          },
          blurTransition: {
            // Dynamic blur during animation
            start: 0,
            peak: 3.5,
            end: 0,
          },

          // Color treatment
          colorFilter: "none", // No additional color filtering
          saturationPreservation: 1.0, // Full saturation preservation
          contrastEnhancement: 0, // No contrast changes

          // Next-gen performance features
          prefetchStrategy: "viewport", // Smart resource management
          renderOptimization: "selective", // Only animate visible elements
          frameRateTarget: 60, // Target smooth framerates
          powerEfficiency: "adaptive", // Balance quality and battery life

          // Image-specific handling
          imageHandling: {
            colorSpace: "preserve", // Maintain original color space
            interpolation: "bicubic", // High-quality scaling during animations
            alphaHandling: "premultiply", // Better transparency handling
            temporaryEffects: false, // No temporary effects that might alter color
          },
        }}
      />
      <Heading
        title="Eliza Cortez"
        meta="effect 07: Bounce Wave – Left-to-right with a playful mid-bounce"
      />
      <Grid
        ref={gridRef}
        items={imageData.filter((item) => item.effect === "effect07")}
        onItemClick={onGridItemClick}
        effectConfig={{
          steps: 10,
          stepDuration: 0.3,
          pathMotion: "bounce", // Changed to bounce
          bounceIntensity: 1.2, // Controls how strong the bounce is
          bounceCenter: 0.5, // Bounce peaks in the middle (50% progress)
          clipPathDirection: "left-right",
          autoAdjustHorizontalClipPath: true,
          stepInterval: 0.05,
          moverPauseBeforeExit: 0.2,
          moverEnterEase: "bounce.out", // Bounce at entry
          moverExitEase: "bounce.in", // Bounce at exit
          panelRevealEase: "power4",
          panelRevealDurationFactor: 4,
        }}
      />

      <Panel ref={panelRef} onClose={resetView} item={currentItem} />
    </div>
  );
}
