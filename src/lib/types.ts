export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: 'Draft' | 'Published';
  publishedDate: string;
  tags: string[];
  coverUrl?: string;
  excerpt?: string;
  featured: boolean;
}

export interface BlogPostContent extends BlogPost {
  content: string;
}

export interface Project {
  title: string;
  year?: string;
  slug?: string;
  description: string;
  url?: string;
  repoUrl?: string;
  techStack: string[];
  featured: boolean;
  coverImage?: string;
}

export interface TechStack {
  name: string;
  slug: string;
  color: string;
}

export interface SocialLink {
  label: string;
  url: string;
}
