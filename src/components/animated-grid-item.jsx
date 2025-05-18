"use client";

import react from "react";
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { createPortal } from "react-dom";

import {
  getElementCenter,
  getClipPathsForDirection,
  generateMotionPath,
  createMoverStyle,
  extractItemConfigOverrides,
} from "../utils/animation-utils.jsx";
import { defaultConfig } from "../utils/animation-config.jsx";
import Mover from "./mover.js";

const GridItem = ({
  id,
  title,
  model,
  image,
  description = "Description goes here. Replace this with the real content tied to the item clicked.",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [movers, setMovers] = useState([]);

  // Refs
  const itemRef = useRef(null);
  const imageRef = useRef(null);
  const panelRef = useRef(null);
  const panelImgRef = useRef(null);
  const panelContentRef = useRef(null);

  // Config state
  const [config, setConfig] = useState({ ...defaultConfig });
  const originalConfig = useRef({ ...defaultConfig });

  // Preload images on mount
  useEffect(() => {
    // No need for preloading since we want immediate interaction
  }, []);

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
    if (config.autoAdjustHorizontalClipPath) {
      const newConfig = { ...config };
      if (
        config.clipPathDirection === "left-right" ||
        config.clipPathDirection === "right-left"
      ) {
        newConfig.clipPathDirection = isLeftSide ? "left-right" : "right-left";
        setConfig(newConfig);
      }
    }
  };

  // Handle click on grid item
  const handleClick = () => {
    if (isAnimating || !itemRef.current || !imageRef.current) return;

    setIsAnimating(true);
    setIsOpen(true);

    // Extract config overrides from data attributes
    if (itemRef.current) {
      const overrides = extractItemConfigOverrides(itemRef.current);
      setConfig((prev) => ({ ...prev, ...overrides }));
    }

    // Position panel
    if (itemRef.current) {
      positionPanelBasedOnClick(itemRef.current);
    }
  };

  // Create movers and animate transition
  useEffect(() => {
    if (!isOpen || !imageRef.current || !panelImgRef.current) return;

    // Hide frame elements (if they exist)
    const frameElements = document.querySelectorAll(".frame, .heading");
    gsap.to(frameElements, {
      opacity: 0,
      duration: 0.5,
      ease: "sine.inOut",
      pointerEvents: "none",
    });

    // Generate path between start and end
    const startRect = imageRef.current.getBoundingClientRect();
    const endRect = panelImgRef.current.getBoundingClientRect();
    const path = generateMotionPath(startRect, endRect, config);

    // Create movers
    const newMovers = path.map((step, index) => {
      const style = createMoverStyle(step, index, `url(${image})`, config);

      return (
        <Mover
          key={`mover-${id}-${index}`}
          style={style}
          index={index}
          config={config}
          isLast={index === path.length - 1}
          onComplete={() => {
            if (index === path.length - 1) {
              revealPanel();
            }
          }}
        />
      );
    });

    setMovers(newMovers);

    // Animate grid items
    const allItems = document.querySelectorAll(".grid__item");
    const clickedItem = itemRef.current;

    if (clickedItem) {
      const clipPaths = getClipPathsForDirection(config.clipPathDirection);

      gsap.to(allItems, {
        opacity: (_, el) => (el === clickedItem ? 1 : 0),
        scale: (_, el) => (el === clickedItem ? 1 : 0.8),
        duration: (_, el) =>
          el === clickedItem
            ? config.stepDuration * config.clickedItemDurationFactor
            : 0.3,
        ease: config.gridItemEase,
        clipPath: (_, el) => (el === clickedItem ? clipPaths.from : "none"),
      });
    }
  }, [isOpen, id, image, config]);

  // Reveal panel after movers complete
  const revealPanel = () => {
    if (!panelImgRef.current || !panelContentRef.current) return;

    const clipPaths = getClipPathsForDirection(config.clipPathDirection);

    // Set initial states
    gsap.set(panelContentRef.current, { opacity: 0 });
    gsap.set(panelRef.current, { opacity: 1, pointerEvents: "auto" });

    // Create timeline for panel reveal
    const timeline = gsap.timeline({
      defaults: {
        duration: config.stepDuration * config.panelRevealDurationFactor,
        ease: config.panelRevealEase,
      },
      onComplete: () => {
        setIsAnimating(false);
        // Clear movers after animation completes
        setMovers([]);
      },
    });

    // Reveal panel image with clip path
    timeline.fromTo(
      panelImgRef.current,
      { clipPath: clipPaths.hide },
      {
        clipPath: clipPaths.reveal,
        pointerEvents: "auto",
        delay: config.steps * config.stepInterval,
      }
    );

    // Reveal panel content
    timeline.fromTo(
      panelContentRef.current,
      { y: 25 },
      {
        duration: 1,
        ease: "expo",
        opacity: 1,
        y: 0,
      },
      "<-=.2"
    );
  };

  // Reset view when closing panel
  const resetView = () => {
    if (isAnimating || !isOpen) return;
    setIsAnimating(true);

    // Show frame elements
    const frameElements = document.querySelectorAll(".frame, .heading");
    gsap.to(frameElements, {
      opacity: 1,
      duration: 0.5,
      ease: "sine.inOut",
      pointerEvents: "auto",
    });

    // Hide panel
    if (panelRef.current) {
      gsap.to(panelRef.current, {
        opacity: 0,
        duration: config.stepDuration,
        ease: "expo",
        onComplete: () => {
          if (panelRef.current) {
            panelRef.current.classList.remove("panel--right");
          }

          // Reset grid items
          const allItems = document.querySelectorAll(".grid__item");
          gsap.set(allItems, { clipPath: "none", opacity: 0, scale: 0.8 });
          gsap.to(allItems, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "expo",
            onComplete: () => {
              setIsOpen(false);
              setIsAnimating(false);
              // Reset config to original
              setConfig({ ...originalConfig.current });
            },
          });
        },
      });
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isAnimating) {
        resetView();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isAnimating]);

  return (
    <>
      <figure
        ref={itemRef}
        className="grid__item"
        role="img"
        aria-labelledby={`caption${id}`}
        onClick={handleClick}
      >
        <div
          ref={imageRef}
          className="grid__item-image"
          style={{ backgroundImage: `url(${image})` }}
        ></div>
        <figcaption className="grid__item-caption" id={`caption${id}`}>
          <h3>{title}</h3>
          <p>{model}</p>
        </figcaption>
      </figure>

      {isOpen && (
        <figure
          ref={panelRef}
          className="panel"
          role="img"
          aria-labelledby="caption"
        >
          <div
            ref={panelImgRef}
            className="panel__img"
            style={{ backgroundImage: `url(${image})` }}
          ></div>
          <figcaption
            ref={panelContentRef}
            className="panel__content"
            id="caption"
          >
            <h3>{title}</h3>
            <p>{description}</p>
            <button
              type="button"
              className="panel__close"
              aria-label="Close preview"
              onClick={resetView}
            >
              Close
            </button>
          </figcaption>
        </figure>
      )}

      {/* Render movers in a portal to avoid nesting issues */}
      {movers.length > 0 && createPortal(movers, document.body)}
    </>
  );
};

export default GridItem;
