export interface Project {
  id: string;
  name: string;
  slug: string;
  category: 'ai_ml' | 'full_stack' | 'tools';
  description: string;
  problem: string;
  whatIbuilt: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  featured: boolean;
  metrics?: { label: string; value: string }[];
}

export interface Location {
  id: string;
  name: string;
  subtitle: string;
  district: string;
  description: string;
  icon: string;
  color: string;
  coordinates: [number, number, number]; // [x, y, z] in the 3D space
  interactive: boolean;
  shortLabel: string;
}

export const locationsData: Location[] = [
  {
    id: 'city-center',
    name: 'MAHFUZ UDDIN HQ',
    subtitle: 'My Digital Headquarters',
    district: 'City Center',
    description: 'Welcome to Mahfuz Uddin\'s digital HQ. I learn by building, experiment with generative AI, and turn creative ideas into production-ready software products.',
    icon: 'Building2',
    color: '#0066FF',
    coordinates: [0, 0, 0],
    interactive: true,
    shortLabel: 'HQ'
  },
  {
    id: 'ai-lab',
    name: 'AI / ML LAB',
    subtitle: 'AI & Machine Learning',
    district: 'Research District',
    description: 'Where I research and build systems powered by LLMs, classification models, and cognitive analysis. Exploring context-awareness, intent classification, and content intelligence.',
    icon: 'Brain',
    color: '#8B5CF6',
    coordinates: [8, 0, -8],
    interactive: true,
    shortLabel: 'AI Lab'
  },
  {
    id: 'project-avenue',
    name: 'PROJECT AVENUE',
    subtitle: 'Things I\'ve Built',
    district: 'Tech Corridor',
    description: 'A physical avenue showcase of software engineering projects, web applications, and utility tools developed for production environments.',
    icon: 'FolderGit2',
    color: '#06B6D4',
    coordinates: [-10, 0, -6],
    interactive: true,
    shortLabel: 'Projects'
  },
  {
    id: 'developer-hq',
    name: 'DEVELOPER HQ',
    subtitle: 'Skills, Stack & Workspace',
    district: 'City Center',
    description: 'A look inside my developer studio, active code editor configurations, systems architectural design patterns, and programming language command center.',
    icon: 'Laptop',
    color: '#10B981',
    coordinates: [6, 0, 8],
    interactive: true,
    shortLabel: 'Dev HQ'
  },
  {
    id: 'cpi-campus',
    name: 'CPI CAMPUS',
    subtitle: 'My Education Journey',
    district: 'Academy District',
    description: 'Chattogram Polytechnic Institute (CPI), where I pursue my Computer Science & Technology education, develop student tools, and hone structural engineering fundamentals.',
    icon: 'GraduationCap',
    color: '#F59E0B',
    coordinates: [-8, 0, 8],
    interactive: true,
    shortLabel: 'Campus'
  },
  {
    id: 'tech-cluder',
    name: 'TECH CLUDER',
    subtitle: 'Community & Initiatives',
    district: 'East Plaza',
    description: 'Founder of Tech Cluder community, hosting workshops, seminars, developer collaborations, hackathons, and fostering open-source programming in Bangladesh.',
    icon: 'Users',
    color: '#EF4444',
    coordinates: [12, 0, 0],
    interactive: true,
    shortLabel: 'Tech Cluder'
  },
  {
    id: 'github-center',
    name: 'GITHUB CENTER',
    subtitle: 'Open Source & Contributions',
    district: 'Tech Corridor',
    description: 'Connecting live to my central open-source infrastructure. Check out commit streams, repositories metadata, and experimental source code codebases.',
    icon: 'Github',
    color: '#333333',
    coordinates: [-12, 0, 2],
    interactive: true,
    shortLabel: 'GitHub'
  },
  {
    id: 'city-exit',
    name: 'CITY EXIT',
    subtitle: 'Let\'s Build Together',
    district: 'Harbor Edge',
    description: 'The gateway to future collaborations. Have an innovative project idea, complex technical challenge, or an experiment worth building? Let\'s connect and make it a reality.',
    icon: 'Send',
    color: '#EC4899',
    coordinates: [0, 0, 14],
    interactive: true,
    shortLabel: 'Contact'
  },
  {
    id: 'playground',
    name: 'PLAYGROUND',
    subtitle: 'Play. Experiment. Have Fun.',
    district: 'Playground District',
    description: 'A dedicated interactive playground inside Mahfuz\'s digital city. Stop exploring and play developer-themed mini-games like Debug the City, AI Lab Challenge, memory patterns, or maze runner!',
    icon: 'Trophy',
    color: '#3B82F6',
    coordinates: [12, 0, 10],
    interactive: true,
    shortLabel: 'Playground'
  },
  {
    id: 'museum',
    name: 'DEVELOPER MUSEUM',
    subtitle: 'Interactive Archive of my Journey',
    district: 'Academy District',
    description: 'Explore the archive of Mahfuz\'s engineering journey. Walk through room exhibitions detailing Programming, Web Development, Artificial Intelligence, and active experiments.',
    icon: 'Compass',
    color: '#8B5CF6',
    coordinates: [-12, 0, -10],
    interactive: true,
    shortLabel: 'Museum'
  },
  {
    id: 'cafe',
    name: 'DEVELOPER CAFÉ',
    subtitle: 'Coffee & Code Atmosphere',
    district: 'East Plaza',
    description: 'Welcome to the Developer Café! Pull up a chair, check out what Mahfuz is currently learning or building, grab a virtual coffee, and enjoy a curated background audio ambient music stream.',
    icon: 'Coffee',
    color: '#10B981',
    coordinates: [8, 0, 12],
    interactive: true,
    shortLabel: 'Café'
  },
  {
    id: 'terminal',
    name: 'LIVE TERMINAL KIOSK',
    subtitle: 'Type commands to inspect',
    district: 'Harbor Edge',
    description: 'An interactive command terminal interface. Type custom shell command logs (help, projects, ai, skills, github) to retrieve portfolio details inside a retro command shell.',
    icon: 'Terminal',
    color: '#0F172A',
    coordinates: [-6, 0, 12],
    interactive: true,
    shortLabel: 'Terminal'
  }
];

export interface BillboardStatus {
  building: string;
  learning: string;
  latestProject: string;
  latestExperiment: string;
}

export const currentStatus: BillboardStatus = {
  building: "Playground & Live Terminal Expansion",
  learning: "Three.js Shaders & React 19 Fiber Damping",
  latestProject: "TrendPilot AI Platform",
  latestExperiment: "Web Audio Generative Synthesizers"
};


export const projectsData: Project[] = [
  {
    id: 'trendpilot-ai',
    name: 'TrendPilot AI',
    slug: 'trendpilot-ai',
    category: 'ai_ml',
    description: 'AI-Powered Content Intelligence Platform for marketing and growth teams.',
    problem: 'Marketing teams spend dozens of hours manually researching blogs, YouTube channels, and trending topics to outline content strategies.',
    whatIbuilt: 'An intelligence engine that monitors blogs and videos, extracts keywords and topics, ranks trend options via AI Opportunity Scores, and drafts full social content recommendations.',
    technologies: ['React', 'Express', 'MongoDB', 'Gemini AI API', 'YouTube Data API', 'Playwright'],
    githubUrl: 'https://github.com/mahfuz-tc-21/trendpilot-ai',
    featured: true,
    metrics: [
      { label: 'Check intervals', value: '4-6 hours' },
      { label: 'Platform Type', value: 'Multi-Tenant SaaS' }
    ]
  },
  {
    id: 'ai-reply-assistant',
    name: 'AI Comment Reply Assistant',
    slug: 'ai-comment-reply-assistant',
    category: 'ai_ml',
    description: 'Context-aware Chrome Extension and Node.js backend for community managers.',
    problem: 'Faced with hundreds of comments daily, brand representatives experience response fatigue and risk making inaccurate promises.',
    whatIbuilt: 'A secure extension auto-detecting YouTube Studio and Meta Business Suite comment widgets, analyzing comments based on the original video description context, and producing 3 distinct responses (Default, Short, friendly).',
    technologies: ['Chrome Extensions MV3', 'React', 'Tailwind CSS', 'Express', 'Gemini API', 'TypeScript'],
    githubUrl: 'https://github.com/mahfuz-tc-21/AI-Comment-Reply-Assistant',
    liveUrl: 'https://ai-comment-reply-assistant.vercel.app',
    featured: true,
    metrics: [
      { label: 'Supported Platforms', value: 'YouTube Studio & Meta' },
      { label: 'Reply Variations', value: '3 generated options' }
    ]
  },
  {
    id: 'next-semester',
    name: 'Next-Semester',
    slug: 'next-semester',
    category: 'full_stack',
    description: 'Next-Generation Intelligent Learning Management System.',
    problem: 'Traditional learning portals lack personalized mentoring loops, rendering online studies isolating and decreasing course completion rates.',
    whatIbuilt: 'A complete enterprise LMS integrating a Spring Boot security server with react frontend, featuring embedded next.ai chatbot tutor, PDF certificates generator, and mock interview simulators.',
    technologies: ['Spring Boot 3', 'Spring Data MongoDB', 'Spring Security JWT', 'React 18', 'Tailwind CSS', 'Gemini AI Engine'],
    githubUrl: 'https://github.com/mahfuz-tc-21/Next-Semester',
    featured: true,
    metrics: [
      { label: 'LMS Roles', value: 'Student, Instructor, Admin' },
      { label: 'Gamification', value: 'XP Points & Leaderboard' }
    ]
  },
  {
    id: 'ph-reels-cutter',
    name: 'PH Reels Cutter',
    slug: 'ph-reels-cutter',
    category: 'tools',
    description: 'Video processing automation tool optimized for social media workflows.',
    problem: 'Manual formatting and trimming of instructional videos for TikTok/Reels takes valuable creative time.',
    whatIbuilt: 'A desktop automation utility utilizing FFmpeg hooks to instantly clip, ratio-crop, and export video reels with predefined branding parameters.',
    technologies: ['Node.js', 'FFmpeg CLI', 'JavaScript', 'Command Line Parser'],
    githubUrl: 'https://github.com/mahfuz-tc-21/PH-Reels-Cutter',
    featured: false
  },
  {
    id: 'cpi-room-finder',
    name: 'CPI Exam Room Finder',
    slug: 'cpi-room-finder',
    category: 'tools',
    description: 'Student exam room locator utility for CPI campus.',
    problem: 'Students scramble during final exams to locate correct seat plans and room locations in multi-building campus layouts.',
    whatIbuilt: 'A simple interactive web lookup index detailing exam configurations, room numbering schemes, and floor directions for student ease.',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'LocalData Storage'],
    githubUrl: 'https://github.com/mahfuz-tc-21/CPI-Exam-Room-Finder',
    featured: true
  },
  {
    id: 'cozycart',
    name: 'Cozycart',
    slug: 'cozycart',
    category: 'full_stack',
    description: 'E-commerce platform with dynamic product catalogs and cart capabilities.',
    problem: 'Slow page transitions and heavy checkouts reduce conversion rates on modern shopping sites.',
    whatIbuilt: 'A lightweight React e-commerce frontend with client-side state caching, animated drawer components, and responsive product categories.',
    technologies: ['React', 'CSS Modules', 'Zustand', 'Context API'],
    githubUrl: 'https://github.com/mahfuz-tc-21/Cozycart',
    featured: false
  },
  {
    id: 'bfcb-leaderboard',
    name: 'BFCB Leaderboard',
    slug: 'bfcb-leaderboard',
    category: 'full_stack',
    description: 'Interactive leaderboard tracking system with rank animations.',
    problem: 'Static tables are unengaging for participants tracking points and performance changes in events.',
    whatIbuilt: 'A dynamic leaderboard displaying player rankings, points, and rank shifts with animations.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    githubUrl: 'https://github.com/mahfuz-tc-21/bfcb-leaderboard',
    liveUrl: 'https://bfcb-leaderboard.vercel.app',
    featured: false
  }
];

export const skillsData = {
  programming: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++'],
  frontend: ['React.js', 'HTML5', 'CSS3 / Tailwind', 'React Three Fiber', 'Three.js'],
  backend: ['Node.js', 'Express.js', 'Spring Boot', 'Spring Security'],
  database: ['MongoDB', 'MySQL', 'Supabase'],
  tools: ['Git & GitHub', 'Playwright', 'Postman', 'Vite', 'PostCSS']
};

export const learningTimeline = [
  { level: 'Programming Fundamentals', desc: 'Acquiring fundamentals in C++, Java, and algorithms.' },
  { level: 'Problem Solving & Web', desc: 'Developing web pages and logic structures with JS and database links.' },
  { level: 'Full-Stack Engineering', desc: 'Building secure REST APIs with Spring Boot and React clients.' },
  { level: 'AI & Machine Learning Labs', desc: 'Training prediction models and integrating LLM APIs into workflows.' },
  { level: 'AI Product Engineering', desc: 'Engineering Chrome extensions and SaaS automation platforms (TrendPilot AI).' }
];
