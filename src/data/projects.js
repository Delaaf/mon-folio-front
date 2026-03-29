export const CATEGORIES = ['All', 'Web Apps', 'UI/UX', 'Backend']

export const PROJECTS = [
  {
    id: 1,
    category: 'Web Apps',
    title: 'AI Task Automator',
    description:
      'Enterprise-grade automation platform leveraging GPT-4 for natural language workflow orchestration and scheduled triggers.',
    tags: ['React', 'Node.js', 'AWS'],
    emoji: '🤖',
    gradient: 'linear-gradient(135deg, #0d0d20 0%, #1a1a3e 100%)',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    featured: true,
  },
  {
    id: 2,
    category: 'Web Apps',
    title: 'Marketplace Engine',
    description:
      'A multi-tenant e-commerce core with real-time inventory tracking, complex checkout flows, and automated tax calculations.',
    tags: ['Next.js', 'Stripe', 'Prisma'],
    emoji: '🛒',
    gradient: 'linear-gradient(135deg, #0d1a18 0%, #0a2a28 100%)',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    featured: true,
  },
  {
    id: 3,
    category: 'Web Apps',
    title: 'Crypto Pulse Analytics',
    description:
      'High-frequency trading visualization dashboard processing over 10k messages per second via WebSockets.',
    tags: ['Vue.js', 'D3.js', 'Redis'],
    emoji: '📈',
    gradient: 'linear-gradient(135deg, #0d0a1e 0%, #1a1035 100%)',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    featured: true,
  },
  {
    id: 4,
    category: 'Backend',
    title: 'Micro-Service API',
    description:
      'A highly optimized backend mesh for social media scaling, featuring geo-distributed caching and rate limiting.',
    tags: ['Go', 'GraphQL', 'Docker'],
    emoji: '⚙️',
    gradient: 'linear-gradient(135deg, #001a12 0%, #001a22 100%)',
    liveUrl: null,
    githubUrl: 'https://github.com',
  },
  {
    id: 5,
    category: 'UI/UX',
    title: 'Titan Design System',
    description:
      'Comprehensive atomic design system used across 12+ internal applications to maintain UI consistency and velocity.',
    tags: ['Figma', 'Storybook', 'Tailwind'],
    emoji: '🎨',
    gradient: 'linear-gradient(135deg, #101020 0%, #1a1030 100%)',
    liveUrl: 'https://example.com',
    githubUrl: null,
  },
  {
    id: 6,
    category: 'Web Apps',
    title: 'Lumina SaaS Landing',
    description:
      'High-conversion, interactive landing page featuring 3D product visualizations and scroll-linked animations.',
    tags: ['TypeScript', 'Motion', 'Three.js'],
    emoji: '✨',
    gradient: 'linear-gradient(135deg, #1a0a10 0%, #0a102a 100%)',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
  },
]

export const TAG_COLORS = {
  React:      { color: '#61dafb', bg: 'rgba(97,218,251,0.08)',  border: 'rgba(97,218,251,0.2)' },
  'Node.js':  { color: '#84cc16', bg: 'rgba(132,204,22,0.08)', border: 'rgba(132,204,22,0.2)' },
  'Next.js':  { color: '#e2e8f0', bg: 'rgba(226,232,240,0.05)',border: 'rgba(226,232,240,0.15)' },
  'Vue.js':   { color: '#42d392', bg: 'rgba(66,211,146,0.08)', border: 'rgba(66,211,146,0.2)' },
  TypeScript: { color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)' },
  Go:         { color: '#00add8', bg: 'rgba(0,173,216,0.08)',  border: 'rgba(0,173,216,0.2)' },
  Figma:      { color: '#f24e1e', bg: 'rgba(242,78,30,0.08)',  border: 'rgba(242,78,30,0.2)' },
  AWS:        { color: '#ff9900', bg: 'rgba(255,153,0,0.08)',  border: 'rgba(255,153,0,0.2)' },
  Docker:     { color: '#2496ed', bg: 'rgba(36,150,237,0.08)', border: 'rgba(36,150,237,0.2)' },
  GraphQL:    { color: '#e10098', bg: 'rgba(225,0,152,0.08)',  border: 'rgba(225,0,152,0.2)' },
  'D3.js':    { color: '#f68e46', bg: 'rgba(246,142,70,0.08)', border: 'rgba(246,142,70,0.2)' },
}

export const TOTAL_PROJECTS_COUNT = 24
