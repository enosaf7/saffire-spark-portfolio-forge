
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
