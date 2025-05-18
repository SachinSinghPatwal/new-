"use client";

import React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { getClipPathsForDirection } from "../utils/animation-utils.jsx";
// import { AnimationConfig } from "../utils/animation-config.jsx";

const Mover = ({ style, index, config, onComplete, isLast = false }) => {
  const moverRef = useRef(null);

  useEffect(() => {
    if (!moverRef.current) return;

    const clipPaths = getClipPathsForDirection(config.clipPathDirection);
    const delay = index * config.stepInterval;

    const timeline = gsap.timeline({ delay });

    // Enter animation
    timeline.fromTo(
      moverRef.current,
      { opacity: 0.4, clipPath: clipPaths.hide },
      {
        opacity: 1,
        clipPath: clipPaths.reveal,
        duration: config.stepDuration,
        ease: config.moverEnterEase,
      }
    );

    // Exit animation
    timeline.to(
      moverRef.current,
      {
        clipPath: clipPaths.from,
        duration: config.stepDuration,
        ease: config.moverExitEase,
        onComplete: () => {
          if (isLast && onComplete) {
            onComplete();
          }
        },
      },
      `+=${config.moverPauseBeforeExit}`
    );

    return () => {
      timeline.kill();
    };
  }, [index, config, onComplete, isLast]);

  return <div ref={moverRef} className="mover" style={style} />;
};

export default Mover;
