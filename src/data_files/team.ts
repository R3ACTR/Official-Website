export interface TeamMemberProject {
  name: string;
  role: string;
  desc: string;
  url?: string;
}

export interface TeamMemberSocial {
  platform: 'GitHub' | 'LinkedIn' | 'Twitter' | 'Website' | 'Email' | 'Telegram' | 'Instagram';
  url: string;
  handle: string;
}

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  title: string;
  department: string;
  idNumber: string;
  badgeCode: string;
  clearance: string;
  status: 'ACTIVE' | 'FOUNDING' | 'MAINTAINER';
  avatar: string;
  cardImage?: string;
  location: string;
  email: string;
  bio: string;
  issueDate: string;
  validThru: string;
  skills: string[];
  projects: TeamMemberProject[];
  socials: TeamMemberSocial[];
  stats: { label: string; value: string }[];
  fingerprint: string;
  securityNotes: string;
}

export const coreTeam: TeamMember[] = [
  {
    slug: 'abhinav',
    name: 'Abhinav R',
    title: 'Co-Founder & CEO',
    role: 'Co-Founder',
    department: 'CEO (Chief Executive Officer)',
    idNumber: 'R3-001',
    badgeCode: 'R3ACTR-CR-001',
    clearance: 'Level 4 • Core Maintainer',
    status: 'ACTIVE',
    avatar: '/assets/id/abhinav.png',
    cardImage: '',
    location: 'Kerala, India',
    email: 'abhinav@r3actr.work',
    bio: 'Directing strategic vision, operations, and product engineering at R3ACTR Innovations. Leading initiatives to engineer cutting-edge intelligent software and modern web systems.',
    issueDate: '09/2024',
    validThru: 'PERPETUAL',
    skills: [
      'Product Strategy',
      'Executive Leadership',
      'Full Stack Engineering',
      'Modern Web Systems',
      'Open Source Initiatives',
    ],
    projects: [
      {
        name: 'R3ACTR Platform',
        role: 'Co-Founder & Lead',
        desc: 'Directing overarching engineering strategy and platform deployment.',
        url: 'https://r3actr.work',
      },
    ],
    socials: [
      {
        platform: 'GitHub',
        url: 'https://github.com/abhinavr-19',
        handle: 'github.com/abhinavr-19',
      },
      {
        platform: 'LinkedIn',
        url: 'https://www.linkedin.com/in/abhinav-r-a2b970286',
        handle: 'linkedin.com/in/abhinav-r-a2b970286',
      },
      {
        platform: 'Website',
        url: 'https://abhinavr.work/',
        handle: 'abhinavr.work',
      },
      {
        platform: 'Instagram',
        url: 'https://www.instagram.com/abhinav.r._',
        handle: '@abhinav.r._',
      },
    ],
    stats: [
      { label: 'Clearance', value: 'L4 Core' },
      { label: 'Role', value: 'Founder' },
      { label: 'Status', value: 'Active' },
      { label: 'Unit', value: 'Executive' },
    ],
    fingerprint: '0xR3A1-42C9-EA10-91B4-88F2',
    securityNotes:
      'Authorized for Level 4 Executive Governance, Root Organization Strategy, and Operations at R3ACTR Innovations.',
  },
  {
    slug: 'sreehari',
    name: 'Sreehari R',
    title: 'Co-Founder & CTO',
    role: 'Co-Founder',
    department: 'CTO (Chief Technical Officer)',
    idNumber: 'R3-002',
    badgeCode: 'R3ACTR-CR-002',
    clearance: 'Level 4 • Core Maintainer',
    status: 'ACTIVE',
    avatar: '/assets/id/shr_with_bg.png',
    cardImage: '/assets/id/shrid.png',
    location: 'Kerala, India',
    email: 'sreehari@r3actr.work',
    bio: 'Building scalable products and intelligent systems across AI, software engineering, and modern web technologies. Focused on turning ambitious ideas into practical, impactful digital solutions.',
    issueDate: '09/2024',
    validThru: 'PERPETUAL',
    skills: [
      'Deep Learning',
      'Mechanistic Interpretability',
      'Windows Apps',
      'TypeScript',
      'Distributed Systems',
      'Web Engineering',
    ],
    projects: [
      {
        name: 'Paper Lab',
        role: 'Lead Architect',
        desc: 'All-in-one academic authoring environment combining visual WYSIWYG editing with raw Monaco LaTeX compilation.',
        url: 'https://paperlab.r3actr.work/',
      },
      {
        name: 'Open Source Quest',
        role: 'Program Mentor & Core Org',
        desc: 'Curated month-long open-source contribution program for engineering students to master real-world software workflows.',
        url: 'https://github.com/R3ACTR',
      },
      {
        name: 'KTUHub',
        role: 'Core Maintainer',
        desc: 'Community-driven academic ecosystem providing study resources, question banks, and learning tools for university students.',
        url: 'https://github.com/R3ACTR',
      },
    ],
    socials: [
      {
        platform: 'GitHub',
        url: 'https://github.com/Sree14hari',
        handle: 'github.com/Sree14hari',
      },
      {
        platform: 'LinkedIn',
        url: 'https://www.linkedin.com/in/sree14hari/',
        handle: 'linkedin.com/in/sree14hari',
      },
      {
        platform: 'Website',
        url: 'https://sree14hari.me',
        handle: 'sree14hari.me',
      },
      {
        platform: 'Instagram',
        url: 'https://www.instagram.com/s_ree.har_i/',
        handle: '@s_ree.har_i',
      },
    ],
    stats: [
      { label: 'Clearance', value: 'L4 Core' },
      { label: 'Role', value: 'Founder' },
      { label: 'Status', value: 'Active' },
      { label: 'Unit', value: 'Core Labs' },
    ],
    fingerprint: '0xR3A9-77B2-DF89-4CA1-90E3',
    securityNotes:
      'Authorized for Level 4 Root Repository Governance, Core Labs Infrastructure, and Release Engineering at R3ACTR Innovations.',
  },
  {
    slug: 'neeraj',
    name: 'Neeraj Sukumaran',
    title: 'Co-Founder & CPIO',
    role: 'Co-Founder',
    department: 'CPIO (Chief Product & Innovation Officer)',
    idNumber: 'R3-003',
    badgeCode: 'R3ACTR-CR-003',
    clearance: 'Level 4 • Core Maintainer',
    status: 'ACTIVE',
    avatar: '/assets/id/neeraj.png',
    cardImage: '',
    location: 'Kerala, India',
    email: 'neeraj@r3actr.work',
    bio: 'Directing public communications, media dissemination, developer relations, and community outreach initiatives at R3ACTR Innovations.',
    issueDate: '09/2024',
    validThru: 'PERPETUAL',
    skills: [
      'Public Information & Media',
      'Community Governance',
      'Developer Relations',
      'Technical Communications',
      'Open Source Advocacy',
    ],
    projects: [
      {
        name: 'R3ACTR Public Relations',
        role: 'CPIO & Co-Founder',
        desc: 'Directing outward institutional communications, documentation integrity, and community engagement.',
        url: 'https://r3actr.work',
      },
    ],
    socials: [
      {
        platform: 'GitHub',
        url: 'https://github.com/Neeraj2303',
        handle: 'github.com/Neeraj2303',
      },
      {
        platform: 'LinkedIn',
        url: 'https://www.linkedin.com/in/neeraj-sukumaran',
        handle: 'linkedin.com/in/neeraj-sukumaran',
      },
      {
        platform: 'Instagram',
        url: 'https://www.instagram.com/neer_aj_2303',
        handle: '@neer_aj_2303',
      },
    ],
    stats: [
      { label: 'Clearance', value: 'L4 Core' },
      { label: 'Role', value: 'Founder' },
      { label: 'Status', value: 'Active' },
      { label: 'Unit', value: 'Communications' },
    ],
    fingerprint: '0xR3A3-63E1-CC42-88B9-19A7',
    securityNotes:
      'Authorized for Level 4 Public Information Governance, Brand Communications, and External Relations at R3ACTR Innovations.',
  },
  {
    slug: 'kalidas',
    name: 'Kalidas V S',
    title: 'Co-Founder & COO',
    role: 'Co-Founder',
    department: 'COO (Chief Operating Officer)',
    idNumber: 'R3-004',
    badgeCode: 'R3ACTR-CR-004',
    clearance: 'Level 4 • Core Maintainer',
    status: 'ACTIVE',
    avatar: '/assets/id/kalidas.png',
    cardImage: '',
    location: 'Kerala, India',
    email: 'kalidas@r3actr.work',
    bio: 'Overseeing operations, workflow execution, and community ecosystems at R3ACTR Innovations. Driving organizational efficiency and scaling developer initiatives.',
    issueDate: '09/2024',
    validThru: 'PERPETUAL',
    skills: [
      'Operations & Strategy',
      'Engineering Management',
      'Community Programs',
      'Full Stack Development',
      'Agile Workflows',
    ],
    projects: [
      {
        name: 'R3ACTR Operations',
        role: 'COO & Co-Founder',
        desc: 'Directing operational scale, program logistics, and execution frameworks across all active labs.',
        url: 'https://r3actr.work',
      },
    ],
    socials: [
      {
        platform: 'GitHub',
        url: 'https://github.com/Kalidas797',
        handle: 'github.com/Kalidas797',
      },
      {
        platform: 'LinkedIn',
        url: 'https://www.linkedin.com/in/kalidas-v-s-853b0a293',
        handle: 'linkedin.com/in/kalidas-v-s-853b0a293',
      },
      {
        platform: 'Instagram',
        url: 'https://www.instagram.com/vs_kalidas?stkn=eTF5bmkzaWxpeHVi',
        handle: '@vs_kalidas',
      },
    ],
    stats: [
      { label: 'Clearance', value: 'L4 Core' },
      { label: 'Role', value: 'Founder' },
      { label: 'Status', value: 'Active' },
      { label: 'Unit', value: 'Operations' },
    ],
    fingerprint: '0xR3A4-91D2-BB78-10A3-77E5',
    securityNotes:
      'Authorized for Level 4 Operations Governance, Core Program Management, and Workflow Strategy at R3ACTR Innovations.',
  },
  {
    slug: 'neha',
    name: 'Neha Siju',
    title: 'Director of External Relations (DER)',
    role: 'Core Lead',
    department: 'DER (Director of External Relations)',
    idNumber: 'R3-005',
    badgeCode: 'R3ACTR-CR-005',
    clearance: 'Level 3 • Core Lead',
    status: 'ACTIVE',
    avatar: '/assets/id/neha.png',
    cardImage: '',
    location: 'Kerala, India',
    email: 'neha@r3actr.work',
    bio: 'Spearheading external partnerships, corporate outreach, institutional networking, and stakeholder alignment to accelerate R3ACTR’s collaborative ecosystem.',
    issueDate: '09/2024',
    validThru: 'PERPETUAL',
    skills: [
      'External Relations & Outreach',
      'Strategic Partnerships',
      'Stakeholder Management',
      'Institutional Communications',
      'Public Relations',
    ],
    projects: [
      {
        name: 'R3ACTR External Partnerships',
        role: 'Director of External Relations',
        desc: 'Structuring institutional partnerships and collaborative alliances across tech ecosystems.',
        url: 'https://r3actr.work',
      },
    ],
    socials: [
      {
        platform: 'LinkedIn',
        url: 'https://www.linkedin.com/in/nehasiju/',
        handle: 'linkedin.com/in/nehasiju',
      },
    ],
    stats: [
      { label: 'Clearance', value: 'L3 Lead' },
      { label: 'Role', value: 'Director' },
      { label: 'Status', value: 'Active' },
      { label: 'Unit', value: 'External Rel' },
    ],
    fingerprint: '0xR3A5-55E8-77F2-99D1-33B4',
    securityNotes:
      'Authorized for Level 3 External Relations Governance, Institutional Alliances, and Outreach Strategy at R3ACTR Innovations.',
  },
  {
    slug: 'diya',
    name: 'Diya Tresia Daniel',
    title: 'Communication & Documentation Lead',
    role: 'Core Lead',
    department: 'Communication & Documentation',
    idNumber: 'R3-006',
    badgeCode: 'R3ACTR-CR-006',
    clearance: 'Level 3 • Core Lead',
    status: 'ACTIVE',
    avatar: '/assets/id/Diya.jpeg',
    cardImage: '',
    location: 'Kerala, India',
    email: 'diya@r3actr.work',
    bio: 'Directing technical documentation, architectural specifications, and organizational communication workflows to ensure clarity, coherence, and accessibility across all R3ACTR engineering systems.',
    issueDate: '09/2024',
    validThru: 'PERPETUAL',
    skills: [
      'Technical Documentation',
      'System Specifications',
      'Communication Architecture',
      'Developer Advocacy',
      'Content Strategy',
    ],
    projects: [
      {
        name: 'R3ACTR Documentation Standards',
        role: 'Documentation Lead',
        desc: 'Authoring architectural whitepapers, developer handbooks, and system documentation frameworks.',
        url: 'https://r3actr.work',
      },
    ],
    socials: [
      {
        platform: 'GitHub',
        url: 'https://github.com/135790-diya',
        handle: 'github.com/135790-diya',
      },
      {
        platform: 'LinkedIn',
        url: 'https://www.linkedin.com/in/diya-thresia-daniel/',
        handle: 'linkedin.com/in/diya-thresia-daniel',
      },
    ],
    stats: [
      { label: 'Clearance', value: 'L3 Lead' },
      { label: 'Role', value: 'Lead' },
      { label: 'Status', value: 'Active' },
      { label: 'Unit', value: 'Documentation' },
    ],
    fingerprint: '0xR3A6-71A3-EE90-22D4-55C1',
    securityNotes:
      'Authorized for Level 3 Documentation Governance, Core Knowledge Repositories, and Communication Strategy at R3ACTR Innovations.',
  },
];

export function getMemberBySlug(slug: string): TeamMember | undefined {
  return coreTeam.find(
    (m) => m.slug.toLowerCase() === slug.toLowerCase()
  );
}
