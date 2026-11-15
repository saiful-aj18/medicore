// Landing page animations (GSAP + ScrollTrigger).
//
// Loaded lazily inside useEffect so nothing here runs during SSR.
// Elements start fully visible in the markup and are only animated
// with gsap.from, so the page still works with JS disabled, and
// prefers-reduced-motion skips the motion entirely.

export async function initLandingAnimations() {
  if (typeof window === "undefined") return () => {};
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  const { gsap } = await import("gsap");
  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  gsap.registerPlugin(ScrollTrigger);

  let floatTween = null;
  const ctx = gsap.context(() => {
    // Hero text: staggered fade-up on load.
    gsap.from(".landing-hero-text > *", {
      y: 24,
      opacity: 0,
      duration: 0.7,
      stagger: 0.09,
      ease: "power3.out",
    });

    // Hero card: fade in, then float gently forever.
    // The card's resting spot is translateY(56px) from CSS; GSAP
    // reads that as the start and floats between 56px and 48px.
    gsap.from(".landing-hero-card", {
      opacity: 0,
      duration: 0.9,
      ease: "power2.out",
      delay: 0.25,
      onComplete: () => {
        floatTween = gsap.to(".landing-hero-card", {
          y: 48,
          duration: 2.6,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      },
    });

    // Every .reveal element fades up once when it scrolls into view.
    // clearProps frees the inline transform afterwards so the CSS
    // hover lift on cards keeps working.
    gsap.utils.toArray(".reveal").forEach((el) => {
      gsap.from(el, {
        y: 28,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    });
  });

  return () => {
    floatTween?.kill();
    ctx.revert();
  };
}
