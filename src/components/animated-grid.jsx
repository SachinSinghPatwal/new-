import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const gridItems = [
  {
    id: 1,
    imgURL: "/assets/img1.webp",
    title: "Item 1",
    desc: "Description for Item 1",
  },
  {
    id: 2,
    imgURL: "/assets/img1.webp",
    title: "Item 2",
    desc: "Description for Item 2",
  },
  {
    id: 3,
    imgURL: "/assets/img1.webp",
    title: "Item 3",
    desc: "Description for Item 3",
  },
  // Add more items as needed
];

const AnimatedGrid = () => {
  const gridRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  // Removed unused state variable 'isPanelOpen'
  const [currentItem, setCurrentItem] = useState(null);

  const config = {
    clipPathDirection: "top-bottom",
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
  };

  useEffect(() => {
    // Preload images and initialize the grid
    const preloadImages = (selector) => {
      const images = document.querySelectorAll(selector);
      const promises = Array.from(images).map((img) => {
        return new Promise((resolve) => {
          const image = img;
          if (image.complete) resolve();
          image.onload = () => resolve();
        });
      });
      return Promise.all(promises);
    };

    preloadImages(".grid__item-image, .panel__img").then(() => {
      document.body.classList.remove("loading");
    });
  }, []);

  const handleGridItemClick = (item) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentItem(item);

    const imgURL =
      item.querySelector(".grid__item-image")?.style.backgroundImage || "";
    const title = item.querySelector("figcaption h3")?.textContent || "";
    const desc = item.querySelector("figcaption p")?.textContent || "";

    // Set panel content
    setPanelContent({ imgURL, title, desc });

    // Grid item animation and transition
    animateGridItems(item);
    animateTransition(item);
  };

  const setPanelContent = ({ imgURL, title, desc }) => {
    const panel = document.querySelector(".panel");
    const panelImg = panel?.querySelector(".panel__img");
    const panelTitle = panel?.querySelector("h3");
    const panelDesc = panel?.querySelector("p");
    if (panelImg && panelTitle && panelDesc) {
      panelImg.style.backgroundImage = imgURL;
      panelTitle.textContent = title;
      panelDesc.textContent = desc;
    }
  };

  const animateGridItems = (clickedItem) => {
    const allItems = document.querySelectorAll(".grid__item");
    const clipPaths = getClipPathsForDirection(config.clipPathDirection);

    gsap.to(allItems, {
      opacity: 0,
      scale: (_, el) => (el === clickedItem ? 1 : 0.8),
      duration: (_, el) =>
        el === clickedItem
          ? config.stepDuration * config.clickedItemDurationFactor
          : 0.3,
      ease: config.gridItemEase,
      clipPath: (_, el) => (el === clickedItem ? clipPaths.from : "none"),
    });
  };

  const animateTransition = (startEl) => {
    const panel = document.querySelector(".panel");
    const panelImg = panel?.querySelector(".panel__img");

    const path = generateMotionPath(
      startEl.getBoundingClientRect(),
      panelImg.getBoundingClientRect(),
      config.steps
    );

    // Create movers and animate them
    const fragment = document.createDocumentFragment();
    path.forEach((step, index) => {
      const mover = document.createElement("div");
      mover.className = "mover";
      gsap.set(mover, createMoverStyle(step, index));
      fragment.appendChild(mover);

      const delay = index * config.stepInterval;
      gsap
        .timeline({ delay })
        .fromTo(
          mover,
          { opacity: 0.4, clipPath: "inset(100% 0% 0% 0%)" },
          {
            opacity: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: config.stepDuration,
            ease: config.moverEnterEase,
          }
        )
        .to(
          mover,
          {
            clipPath: "inset(0% 0% 100% 0%)",
            duration: config.stepDuration,
            ease: config.moverExitEase,
          },
          `+=${config.moverPauseBeforeExit}`
        );
    });

    gridRef.current?.parentNode?.insertBefore(
      fragment,
      gridRef.current?.nextSibling
    );

    // Cleanup movers and reveal the panel
    scheduleCleanup(document.querySelectorAll(".mover"));
    revealPanel(panelImg);
  };

  const getClipPathsForDirection = (direction) => {
    switch (direction) {
      case "bottom-top":
        return {
          from: "inset(0% 0% 100% 0%)",
          reveal: "inset(0% 0% 0% 0%)",
        };
      case "left-right":
        return {
          from: "inset(0% 100% 0% 0%)",
          reveal: "inset(0% 0% 0% 0%)",
        };
      case "right-left":
        return {
          from: "inset(0% 0% 0% 100%)",
          reveal: "inset(0% 0% 0% 0%)",
        };
      case "top-bottom":
      default:
        return {
          from: "inset(100% 0% 0% 0%)",
          reveal: "inset(0% 0% 0% 0%)",
        };
    }
  };

  const createMoverStyle = (step, indexr) => {
    const style = {
      backgroundImage:
        currentItem?.querySelector(".grid__item-image")?.style.backgroundImage,
      position: "fixed",
      left: step.left,
      top: step.top,
      width: step.width,
      height: step.height,
      clipPath: "inset(0% 0% 100% 0%)",
      zIndex: 1000 + index,
    };
    return style;
  };

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

      path.push({
        left: centerX - width / 2,
        top: centerY - height / 2,
        width,
        height,
      });
    }

    return path.slice(1, -1);
  };

  const lerp = (a, b, t) => a + (b - a) * t;

  const scheduleCleanup = (movers) => {
    const cleanupDelay =
      config.steps * config.stepInterval +
      config.stepDuration * 2 +
      config.moverPauseBeforeExit;
    gsap.delayedCall(cleanupDelay, () => movers.forEach((m) => m.remove()));
  };

  const revealPanel = (endImg) => {
    gsap.set(endImg, { opacity: 0 });
    gsap
      .timeline({
        defaults: {
          duration: config.stepDuration * config.panelRevealDurationFactor,
          ease: config.panelRevealEase,
        },
      })
      .fromTo(
        endImg,
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)" }
      );
    // Removed unused 'setIsPanelOpen' call
  };

  return (
    <div className="grid" ref={gridRef}>
      {gridItems.map((item) => (
        <div
          key={item.id}
          className="grid__item"
          onClick={(e) => handleGridItemClick(e.currentTarget)}
        >
          <div
            className="grid__item-image"
            style={{ backgroundImage: `url(${item.imgURL})` }}
          />
          <figcaption>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </figcaption>
        </div>
      ))}
    </div>
  );
};

export default AnimatedGrid;
