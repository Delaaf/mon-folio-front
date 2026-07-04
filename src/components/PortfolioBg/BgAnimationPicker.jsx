import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import styles from './BgAnimationPicker.module.css'

const BG_OPTIONS = [
  {
    id:    'none',
    label: 'Aucun',
    desc:  'Fond uni, rien',
    preview: (accent) => null,
  },
  {
    id:    'grid',
    label: 'Grille',
    desc:  'Grille + glows',
    preview: (accent) => 'grid',
  },
  {
    id:    'particles',
    label: 'Particules',
    desc:  'Points flottants',
    preview: (accent) => 'particles',
  },
  {
    id:    'aurora',
    label: 'Aurora',
    desc:  'Dégradés ondulants',
    preview: (accent) => 'aurora',
  },
  {
    id:    'waves',
    label: 'Vagues',
    desc:  'Lignes ondulantes',
    preview: (accent) => 'waves',
  },
  {
    id:    'geometric',
    label: 'Géométrique',
    desc:  'Formes qui tournent',
    preview: (accent) => 'geometric',
  },
]

/* Mini canvas preview pour chaque type */
function Preview({ type, accent }) {
  const r = hexToRgb(accent)

  const base = {
    position: 'absolute', inset: 0, borderRadius: 10, overflow: 'hidden',
    background: '#0a0a0f',
  }

  if (type === 'none') return (
    <div style={{ ...base, background: '#0a0a0f' }} />
  )

  if (type === 'grid') return (
    <div style={base}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)`,
        backgroundSize: '16px 16px',
      }} />
      <div style={{
        position: 'absolute', top: -20, left: -20, width: 80, height: 80,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(${r},.35), transparent 70%)`,
      }} />
      <div style={{
        position: 'absolute', bottom: -10, right: -10, width: 60, height: 60,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(${r},.2), transparent 70%)`,
      }} />
    </div>
  )

  if (type === 'particles') return (
    <div style={base}>
      {[...Array(12)].map((_, i) => (
        <motion.div key={i} style={{
          position: 'absolute',
          left: `${(i * 31 + 10) % 90}%`,
          top:  `${(i * 17 + 8) % 85}%`,
          width: i % 3 === 0 ? 3 : 2,
          height: i % 3 === 0 ? 3 : 2,
          borderRadius: '50%',
          background: `rgba(${r}, 0.7)`,
        }}
          animate={{ y: [0, -8, 0], opacity: [0.2, 0.9, 0.2] }}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  )

  if (type === 'aurora') return (
    <div style={base}>
      <motion.div style={{
        position: 'absolute', top: '-30%', left: '-20%',
        width: '100%', height: '80%',
        borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%',
        background: `radial-gradient(ellipse, rgba(${r},.4), transparent 65%)`,
        filter: 'blur(20px)',
      }}
        animate={{
          borderRadius: ['60% 40% 70% 30% / 50% 60% 40% 50%', '40% 60% 30% 70% / 60% 40% 60% 40%', '60% 40% 70% 30% / 50% 60% 40% 50%'],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div style={{
        position: 'absolute', bottom: '-20%', right: '-10%',
        width: '70%', height: '60%',
        borderRadius: '40% 60% 30% 70% / 60% 40% 70% 30%',
        background: `radial-gradient(ellipse, rgba(${r},.25), transparent 65%)`,
        filter: 'blur(15px)',
      }}
        animate={{
          borderRadius: ['40% 60% 30% 70% / 60% 40% 70% 30%', '70% 30% 60% 40% / 30% 70% 40% 60%', '40% 60% 30% 70% / 60% 40% 70% 30%'],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
    </div>
  )

  if (type === 'waves') return (
    <div style={base}>
      {[0, 1, 2].map(i => (
        <motion.div key={i} style={{
          position: 'absolute',
          bottom: `${i * 12}%`, left: '-5%', width: '110%',
        }}
          animate={{ x: [0, -10, 0] }}
          transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
        >
          <svg viewBox="0 0 200 40" style={{ width: '100%' }}>
            <path
              d={`M0,${20 + i * 5} C40,${10 + i * 3} 80,${30 + i * 4} 120,${20 + i * 5} C160,${10 + i * 3} 180,${30 + i * 2} 200,${20 + i * 5}`}
              fill="none" stroke={`rgba(${r}, ${0.3 - i * 0.06})`} strokeWidth="1.5"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  )

  if (type === 'geometric') return (
    <div style={base}>
      {[
        { size: 40, x: 10, y: 10, round: false },
        { size: 30, x: 55, y: 15, round: true  },
        { size: 50, x: 35, y: 45, round: false },
        { size: 20, x: 70, y: 60, round: true  },
      ].map((sh, i) => (
        <motion.div key={i} style={{
          position: 'absolute',
          left: `${sh.x}%`, top: `${sh.y}%`,
          width: sh.size, height: sh.size,
          border: `1px solid rgba(${r}, 0.4)`,
          borderRadius: sh.round ? '50%' : 0,
        }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8 + i * 3, repeat: Infinity, ease: 'linear', delay: i * 1 }}
        />
      ))}
      {[...Array(5)].map((_, i) => (
        <motion.div key={`d-${i}`} style={{
          position: 'absolute',
          left: `${15 + i * 17}%`, top: `${70 + Math.sin(i) * 15}%`,
          width: 3, height: 3,
          background: `rgba(${r}, 0.6)`, borderRadius: 0,
        }}
          animate={{ opacity: [0.2, 0.9, 0.2], y: [0, -5, 0] }}
          transition={{ duration: 2 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}
    </div>
  )

  return null
}

function hexToRgb(hex) {
  const h = (hex || '#4f8eff').replace('#', '')
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  return `${r},${g},${b}`
}

export default function BgAnimationPicker({ value, onChange, accent }) {
  return (
    <div className={styles.grid}>
      {BG_OPTIONS.map(opt => (
        <button
          key={opt.id}
          className={`${styles.card} ${value === opt.id ? styles.cardActive : ''}`}
          onClick={() => onChange(opt.id)}
          type="button"
        >
          {/* Mini preview */}
          <div className={styles.preview}>
            <Preview type={opt.id} accent={accent} />
            {value === opt.id && (
              <div className={styles.check}>✓</div>
            )}
          </div>
          <div className={styles.label}>{opt.label}</div>
          <div className={styles.desc}>{opt.desc}</div>
        </button>
      ))}
    </div>
  )
}
