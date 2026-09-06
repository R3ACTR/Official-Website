export interface BlogPostMeta {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  pubDate: string;
  pubDateISO: string;
  readTime: string;
  category: string;
  tags: string[];
  coverImage: string;
  featured?: boolean;
}

export const blogs: BlogPostMeta[] = [
  {
    id: 'blog1',
    slug: 'paper-lab',
    title: 'Paper Lab: Eliminating the Chaos of Academic Writing',
    subtitle: 'The All-in-One Academic Authoring Environment: Visual WYSIWYG meets raw Monaco LaTeX.',
    description:
      'If you’ve ever written a research paper or thesis, you already know the secret: writing is only a fraction of the job. Here is a deep dive into how Paper Lab brings visual editing, Monaco-powered raw LaTeX, real-time A4 preview, and vector diagrams into one cohesive, local-first workspace.',
    author: {
      name: 'Sreehari R',
      role: 'Software & Research Insights',
      avatar: '/assets/illustrations/Cool robot-rafiki.png',
    },
    pubDate: 'September 6, 2026',
    pubDateISO: '2026-09-06',
    readTime: '6 min read',
    category: 'Developer Tools & Research',
    tags: ['Academic Writing', 'LaTeX', 'WYSIWYG', 'Local-First'],
    coverImage: '/assets/blog/bog1.png',
    featured: true,
  },
];
