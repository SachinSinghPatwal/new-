export const preloadImages = (selector = "img") => {
  return new Promise((resolve) => {
    // We're using a simple approach since imagesLoaded library isn't available
    const images = document.querySelectorAll(selector);
    let loadedCount = 0;

    if (images.length === 0) {
      resolve(true);
      return;
    }

    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount === images.length) {
        resolve(true);
      }
    };

    images.forEach((img) => {
      // For background images
      if (
        img.classList.contains("grid__item-image") ||
        img.classList.contains("panel__img")
      ) {
        const style = getComputedStyle(img);
        const bgImg = style.backgroundImage;

        if (bgImg && bgImg !== "none") {
          const imgUrl = bgImg.replace(/url$$['"]?(.*?)['"]?$$/i, "$1");
          const testImg = new Image();
          testImg.onload = checkAllLoaded;
          testImg.onerror = checkAllLoaded;
          testImg.src = imgUrl;
        } else {
          checkAllLoaded();
        }
      }
      // For regular images
      else if (img) {
        if (img.complete) {
          checkAllLoaded();
        } else {
          img.onload = checkAllLoaded;
          img.onerror = checkAllLoaded;
        }
      } else {
        checkAllLoaded();
      }
    });
  });
};

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }
// Generate motion path between start and end elements with support for diagonal paths
export const generateMotionPath = (startRect, endRect, steps, config) => {
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

    let centerX = lerp(startCenter.x, endCenter.x, t);
    let centerY = lerp(startCenter.y, endCenter.y, t);

    // Apply different path motions based on config
    if (config.pathMotion === "sine") {
      // Sine wave motion
      const sineOffset =
        Math.sin(t * config.sineFrequency) * config.sineAmplitude;
      centerY += sineOffset;
    } else if (config.pathMotion === "diagonal") {
      // Diagonal spiral motion
      const angle = t * Math.PI * 2; // Full rotation
      const radius = (1 - t) * config.sineAmplitude;
      centerX += Math.cos(angle) * radius;
      centerY += Math.sin(angle) * radius;
    }

    // Add random wobble
    const wobbleX = (Math.random() - 0.5) * config.wobbleStrength;
    const wobbleY = (Math.random() - 0.5) * config.wobbleStrength;

    path.push({
      left: centerX - width / 2 + wobbleX,
      top: centerY - height / 2 + wobbleY,
      width,
      height,
      scale: config.pathMotion === "diagonal" ? 0.8 + t * 0.4 : 1, // Scale effect for diagonal
      rotation: config.pathMotion === "diagonal" ? (t - 0.5) * 40 : 0, // Rotation for diagonal
    });
  }

  return path.slice(1, -1);
};

// Linear interpolation helper
export const lerp = (a, b, t) => a + (b - a) * t;
