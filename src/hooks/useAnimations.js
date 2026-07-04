import { usePortfolio } from '../layouts/PortfolioLayout'

/**
 * useAnimations — retourne les variants Framer Motion selon les settings du portfolio.
 * Si animations_enabled = false → tout est instantané (opacity:1, no transform).
 */
export function useAnimations() {
  const ctx      = usePortfolio()
  const enabled  = ctx?.settings?.animations_enabled ?? ctx?.profile?.portfolio_settings?.animations_enabled ?? true

  // Variants de base
  const fadeUp = (delay = 0, duration = 0.6) => enabled
    ? {
        initial:    { opacity: 0, y: 32 },
        animate:    { opacity: 1, y: 0  },
        transition: { duration, delay, ease: [0.22, 1, 0.36, 1] },
      }
    : { initial: { opacity: 1 }, animate: { opacity: 1 } }

  const fadeIn = (delay = 0, duration = 0.5) => enabled
    ? {
        initial:    { opacity: 0 },
        animate:    { opacity: 1 },
        transition: { duration, delay },
      }
    : { initial: { opacity: 1 }, animate: { opacity: 1 } }

  const slideRight = (delay = 0) => enabled
    ? {
        initial:    { opacity: 0, x: -40 },
        animate:    { opacity: 1, x: 0   },
        transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
      }
    : { initial: { opacity: 1 }, animate: { opacity: 1 } }

  const slideLeft = (delay = 0) => enabled
    ? {
        initial:    { opacity: 0, x: 40 },
        animate:    { opacity: 1, x: 0  },
        transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
      }
    : { initial: { opacity: 1 }, animate: { opacity: 1 } }

  const scaleIn = (delay = 0) => enabled
    ? {
        initial:    { opacity: 0, scale: 0.88 },
        animate:    { opacity: 1, scale: 1     },
        transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
      }
    : { initial: { opacity: 1 }, animate: { opacity: 1 } }

  // Variants pour stagger (liste d'items)
  const staggerContainer = enabled
    ? {
        initial:  {},
        animate:  { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
      }
    : { initial: {}, animate: {} }

  const staggerItem = enabled
    ? {
        initial:    { opacity: 0, y: 20 },
        animate:    { opacity: 1, y: 0  },
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
      }
    : { initial: { opacity: 1 }, animate: { opacity: 1 } }

  // Hover effects
  const hoverLift  = enabled ? { whileHover: { y: -6, transition: { duration: 0.22 } } } : {}
  const hoverScale = enabled ? { whileHover: { scale: 1.03, transition: { duration: 0.2 } } } : {}

  // Scroll-triggered (à utiliser avec whileInView)
  const scrollReveal = (delay = 0) => enabled
    ? {
        initial:    { opacity: 0, y: 40 },
        whileInView: { opacity: 1, y: 0 },
        viewport:   { once: true, margin: '-60px' },
        transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
      }
    : { initial: { opacity: 1 } }

  const scrollFadeIn = (delay = 0) => enabled
    ? {
        initial:     { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport:    { once: true, margin: '-40px' },
        transition:  { duration: 0.5, delay },
      }
    : { initial: { opacity: 1 } }

  return {
    enabled,
    fadeUp,
    fadeIn,
    slideRight,
    slideLeft,
    scaleIn,
    staggerContainer,
    staggerItem,
    hoverLift,
    hoverScale,
    scrollReveal,
    scrollFadeIn,
  }
}
