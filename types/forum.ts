export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  date_joined: string;
}

export interface ForumCategory {
  id: number;
  name: string;
  description: string;
  created_at: string;
  discussion_count: number;
}

export interface Discussion {
  id: number;
  title: string;
  content?: string;
  author: User;
  category: ForumCategory;
  created_at: string;
  updated_at: string;
  is_pinned: boolean;
  is_locked: boolean;
  views: number;
  reply_count: number;
  last_reply?: Reply;
  replies?: Reply[];
}

export interface Reply {
  id: number;
  content: string;
  author: User;
  created_at: string;
  updated_at: string;
  is_solution: boolean;
}

export interface UserProfile {
  user: User;
  bio: string;
  location: string;
  website: string;
  joined_date: string;
  post_count: number;
}
