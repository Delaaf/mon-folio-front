import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

/**
 * PortfolioBg — composant d'arrière-plan animé
 * 
 * Props:
 *   type   {string}  — 'none' | 'grid' | 'particles' | 'aurora' | 'waves' | 'geometric'
 *   accent {string}  — couleur d'accent hex (ex: '#4f8eff')
 */
export default function PortfolioBg({ type = 'grid', accent = '#4f8eff' }) {
  switch (type) {
    case 'none':      return <BgNone />
    case 'grid':      return <BgGrid accent={accent} />
    case 'particles': return <BgParticles accent={accent} />
    case 'aurora':    return <BgAurora accent={accent} />
    case 'waves':     return <BgWaves accent={accent} />
    case 'geometric': return <BgGeometric accent={accent} />
    default:          return <BgGrid accent={accent} />
  }
}

/* ────────────────────────────────────────
   NONE — fond uni, rien
   ──────────────────────────────────────── */
function BgNone() { return null }

/* ────────────────────────────────────────
   GRID — grille + glows (existant)
   ──────────────────────────────────────── */
function BgGrid({ accent }) {
  const r = hexToRgb(accent)
  return (
    <>
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `linear-gradient(rgba(255,255,255,.022) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,.022) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent)',
        maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent)',
      }} />
      <motion.div
        style={{
          position: 'fixed', top: -120, left: -80, width: 500, height: 500,
          borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
          background: `radial-gradient(circle, rgba(${r},.1) 0%, transparent 70%)`,
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        style={{
          position: 'fixed', bottom: -80, right: 80, width: 380, height: 380,
          borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
          background: `radial-gradient(circle, rgba(${r},.07) 0%, transparent 70%)`,
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
    </>
  )
}

/* ────────────────────────────────────────
   PARTICLES — points flottants
   ──────────────────────────────────────── */
function BgParticles({ accent }) {
  const r = hexToRgb(accent)
  const dots = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x:    Math.random() * 100,
    y:    Math.random() * 100,
    size: Math.random() * 3 + 1,
    dur:  Math.random() * 8 + 6,
    delay: Math.random() * 5,
    dy:   -(Math.random() * 30 + 15),
  }))

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {dots.map(d => (
        <motion.div
          key={d.id}
          style={{
            position: 'absolute',
            left: `${d.x}%`,
            top:  `${d.y}%`,
            width:  d.size,
            height: d.size,
            borderRadius: '50%',
            background: `rgba(${r}, 0.6)`,
          }}
          animate={{
            y:       [0, d.dy, 0],
            opacity: [0, 0.7, 0],
            scale:   [0.5, 1, 0.5],
          }}
          transition={{
            duration: d.dur,
            delay:    d.delay,
            repeat:   Infinity,
            ease:     'easeInOut',
          }}
        />
      ))}
      {/* Glow central léger */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 600, height: 400, borderRadius: '50%', pointerEvents: 'none',
        background: `radial-gradient(ellipse, rgba(${r},.06), transparent 70%)`,
      }} />
    </div>
  )
}

/* ────────────────────────────────────────
   AURORA — dégradés qui bougent
   ──────────────────────────────────────── */
function BgAurora({ accent }) {
  const r = hexToRgb(accent)
  // Couleur complémentaire (décalage hue ~140°)
  const [rr, gg, bb] = hexToRgbArr(accent)
  const comp = `${bb}, ${rr}, ${gg}` // rough complement

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
      {/* Blob 1 */}
      <motion.div
        style={{
          position: 'absolute',
          top: '-20%', left: '-10%',
          width: '70%', height: '70%',
          borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%',
          background: `radial-gradient(ellipse, rgba(${r},.18), transparent 65%)`,
          filter: 'blur(60px)',
        }}
        animate={{
          borderRadius: [
            '60% 40% 70% 30% / 50% 60% 40% 50%',
            '40% 60% 30% 70% / 60% 40% 60% 40%',
            '70% 30% 50% 50% / 40% 70% 30% 60%',
            '60% 40% 70% 30% / 50% 60% 40% 50%',
          ],
          x: [0, 40, -20, 0],
          y: [0, 30, -10, 0],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Blob 2 */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '-20%', right: '-10%',
          width: '60%', height: '65%',
          borderRadius: '40% 60% 30% 70% / 60% 40% 70% 30%',
          background: `radial-gradient(ellipse, rgba(${comp},.12), transparent 65%)`,
          filter: 'blur(70px)',
        }}
        animate={{
          borderRadius: [
            '40% 60% 30% 70% / 60% 40% 70% 30%',
            '70% 30% 60% 40% / 30% 70% 40% 60%',
            '50% 50% 40% 60% / 50% 50% 60% 40%',
            '40% 60% 30% 70% / 60% 40% 70% 30%',
          ],
          x: [0, -30, 20, 0],
          y: [0, -25, 15, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />
      {/* Blob 3 central */}
      <motion.div
        style={{
          position: 'absolute',
          top: '30%', left: '30%',
          width: '40%', height: '40%',
          borderRadius: '50%',
          background: `radial-gradient(ellipse, rgba(${r},.08), transparent 60%)`,
          filter: 'blur(50px)',
        }}
        animate={{ scale: [1, 1.3, 0.9, 1], opacity: [0.5, 0.9, 0.4, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
      />
    </div>
  )
}

/* ────────────────────────────────────────
   WAVES — lignes ondulantes (SVG animé)
   ──────────────────────────────────────── */
function BgWaves({ accent }) {
  const r = hexToRgb(accent)
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {[0, 1, 2, 3].map(i => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            bottom: `${-10 + i * 8}%`,
            left: '-10%',
            width: '120%',
            height: '300px',
          }}
          animate={{ x: [0, -80, 0], y: [0, i % 2 === 0 ? -20 : 20, 0] }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 1.5,
          }}
        >
          <svg viewBox="0 0 1440 300" preserveAspectRatio="none"
            style={{ width: '100%', height: '100%' }}>
            <path
              d={`M0,${100 + i * 20} C240,${60 + i * 15} 480,${150 + i * 10} 720,${100 + i * 20} C960,${50 + i * 15} 1200,${140 + i * 10} 1440,${100 + i * 20} L1440,300 L0,300 Z`}
              fill={`rgba(${r}, ${0.04 - i * 0.005})`}
            />
            <path
              d={`M0,${130 + i * 15} C360,${80 + i * 10} 720,${170 + i * 8} 1080,${120 + i * 12} C1260,${90 + i * 8} 1380,${150 + i * 5} 1440,${130 + i * 15}`}
              fill="none"
              stroke={`rgba(${r}, ${0.12 - i * 0.02})`}
              strokeWidth="1.5"
            />
          </svg>
        </motion.div>
      ))}
      {/* Glow en haut */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
        background: `linear-gradient(to bottom, rgba(${r},.06), transparent)`,
        pointerEvents: 'none',
      }} />
    </div>
  )
}

/* ────────────────────────────────────────
   GEOMETRIC — formes géométriques qui tournent
   ──────────────────────────────────────── */
function BgGeometric({ accent }) {
  const r = hexToRgb(accent)
  const shapes = [
    { size: 300, x: '10%',  y: '5%',  rot: 45,  dur: 30, delay: 0   },
    { size: 200, x: '75%',  y: '15%', rot: -30, dur: 25, delay: 5   },
    { size: 150, x: '60%',  y: '60%', rot: 20,  dur: 20, delay: 10  },
    { size: 100, x: '15%',  y: '70%', rot: -60, dur: 35, delay: 3   },
    { size: 250, x: '85%',  y: '75%', rot: 15,  dur: 28, delay: 8   },
  ]

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {shapes.map((sh, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: sh.x, top: sh.y,
            width: sh.size, height: sh.size,
            border: `1px solid rgba(${r}, 0.12)`,
            borderRadius: i % 2 === 0 ? '0' : '50%',
            rotate: sh.rot,
          }}
          animate={{
            rotate: [sh.rot, sh.rot + 360],
            scale: [1, 1.05, 0.97, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            rotate:  { duration: sh.dur, repeat: Infinity, ease: 'linear', delay: sh.delay },
            scale:   { duration: sh.dur / 2, repeat: Infinity, ease: 'easeInOut', delay: sh.delay },
            opacity: { duration: sh.dur / 3, repeat: Infinity, ease: 'easeInOut', delay: sh.delay },
          }}
        />
      ))}
      {/* Petits carrés décoratifs */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`sq-${i}`}
          style={{
            position: 'absolute',
            left: `${10 + i * 12}%`,
            top:  `${Math.sin(i) * 30 + 40}%`,
            width: 6, height: 6,
            background: `rgba(${r}, 0.35)`,
            borderRadius: 1,
          }}
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3], rotate: [0, 90, 0] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
        />
      ))}
      {/* Glow central */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 500, height: 500, borderRadius: '50%',
        background: `radial-gradient(circle, rgba(${r},.05), transparent 70%)`,
        pointerEvents: 'none',
      }} />
    </div>
  )
}

/* ── Helpers ── */
function hexToRgb(hex) {
  const [r, g, b] = hexToRgbArr(hex)
  return `${r},${g},${b}`
}

function hexToRgbArr(hex) {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ]
}
