
// Custom types for Supabase
export type Profile = {
  id: string;
  full_name: string | null;
  university: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export type Testimonial = {
  id: string;
  user_id: string;
  name: string;
  university: string;
  program: string;
  content: string;
  stars: number;
  created_at: string;
  approved: boolean;
}
