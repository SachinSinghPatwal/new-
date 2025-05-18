import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
// import gsap from "gsap";
// import ScrollTrigger from "gsap/ScrollTrigger";

// If using GSAP, uncomment below:
// gsap.registerPlugin(ScrollTrigger);

export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1 });

    // For GSAP integration, uncomment below:
    // gsap.ticker.add((time: number) => {
    //   lenis.raf(time * 1000);
    // });
    // gsap.ticker.lagSmoothing(0);
    // lenis.on("scroll", ScrollTrigger.update);

    // If not using GSAP, requestAnimationFrame loop is enough:
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Cleanup on unmount
    return () => {
      lenis.destroy();
    };
  }, []);
}
