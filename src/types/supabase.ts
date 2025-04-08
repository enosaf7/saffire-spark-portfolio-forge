
export interface Testimonial {
  id: string;
  user_id: string;
  name: string;
  university: string;
  program: string;
  content: string;
  stars: number;
  approved: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  university: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  customer_name: string;
  service: string;
  status: string;
  deadline: string;
  created_at: string;
}

export interface Visitor {
  id: string;
  ip_address: string | null;
  user_agent: string | null;
  visited_at: string | null;
  page_visited: string | null;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  target_url: string | null;
  active: boolean | null;
  priority: number | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string | null;
  created_by: string;
}

// Type guards to convert data from Supabase
export function asTestimonials(data: any): Testimonial[] {
  return data as Testimonial[];
}

export function asProfiles(data: any): Profile[] {
  return data as Profile[];
}

export function asOrders(data: any): Order[] {
  return data as Order[];
}

export function asVisitors(data: any): Visitor[] {
  return data as Visitor[];
}

export function asPromotions(data: any): Promotion[] {
  return data as Promotion[];
}
