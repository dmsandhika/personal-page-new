export type Profile = {
  id: string;
  name: string;
  title: string;
  title_en: string | null;
  bio: string;
  bio_en: string | null;
  avatar_url: string | null;
  email: string;
  location: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  website_url: string | null;
  updated_at: string;
};

export type Project = {
  id: string;
  title: string;
  title_en: string | null;
  description: string;
  description_en: string | null;
  image_url: string | null;
  tags: string[];
  project_url: string | null;
  repo_url: string | null;
  featured: boolean;
  sort_order: number;
  created_at: string;
};

export type Experience = {
  id: string;
  role: string;
  role_en: string | null;
  company: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  description: string | null;
  description_en: string | null;
  sort_order: number;
  created_at: string;
};
