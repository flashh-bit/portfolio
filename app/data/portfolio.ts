
export interface Project {
  title: string;
  description: string;
  link?: string;
  tech: string[];
}

export interface Experiment {
  title: string;
  description: string;
  link?: string;
  tags: string[];
}

export interface PortfolioData {
  name: string;
  role: string;
  bio: string;
  location: string;
  greeting?: string;
  avatarUrl: string;
  techStack: string[];
  socials: {
    github: string;
    twitter: string;
    instagram: string;
    email: string;
  };
  spotify: {
    status: string;
    song: string;
    artist: string;
  };
  projects: Project[];
  experiments: Experiment[];
}

export const portfolioData: PortfolioData = {
  name: "Krishna.",
  greeting: "Hi, I'm",
  role: "Web Designer.",
  bio: " crafting high-performance, responsive web experiences with valid semantic languages and modern CSS.",
  location: "Uttar Pradesh, India",
  avatarUrl: "/avatar_v2.jpg",
  techStack: [
    "TypeScript",
    "Next.js",
    "React",
    "Tailwind CSS",
    "Framer Motion",
    "Supabase",
    "Figma",
    "OpenAI",
  ],
  socials: {
    github: "https://github.com/flashh-bit",
    twitter: "https://x.com/uchihaaitachi03",
    instagram: "https://www.instagram.com/5lashh_?igsh=MXh0cnI2amp2NDNrbA==",
    email: "mailto:theflashkrishna@gmail.com",
  },
  spotify: {
    status: "Listening to",
    song: "Dream On",
    artist: "Aerosmith",
  },
  projects: [
    {
      title: "Project Alpha",
      description: "Under Development",
      link: "#",
      tech: ["Next.js", "Supabase", "Tailwind"],
    },
    {
      title: "Sync (soon)",
      description: "Multiplayer social game with real-time sync.",
      link: "#",
      tech: ["Cooking something biggg."],
    },
    {
      title: "Do Nothing Club",
      description: "First basic project.",
      link: "https://do-nothing-club-zeta.vercel.app/",
      tech: ["WebGL", "Three.js", "GSAP"],
    },
  ],
  experiments: [
    {
      title: "Glassmorphism Card",
      description: "A frosted glass UI component with blur effects.",
      link: "#",
      tags: ["CSS", "UI"],
    },
    {
      title: "Magnetic Button",
      description: "Button that follows your cursor on hover.",
      link: "#",
      tags: ["Framer Motion", "React"],
    },
    {
      title: "Scroll Parallax",
      description: "Smooth parallax scrolling effect demo.",
      link: "#",
      tags: ["GSAP", "ScrollTrigger"],
    },
  ],
};
