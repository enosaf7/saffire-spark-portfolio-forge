// This file contains type definitions for Supabase tables
import { Database } from '@/integrations/supabase/types';

export interface User {
  id: string;
  email?: string;
  full_name?: string;
  university?: string;
  role?: string;
  auth_provider?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  university?: string;
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

export interface Visitor {
  id: string;
  ip_address?: string;
  user_agent?: string;
  page_visited?: string;
  visited_at?: string;
}

export interface EmailMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  subject?: string;
  status?: string;
  created_at?: string;
}

// Type assertion functions
export const asUsers = (data: any[]): User[] => data as User[];
export const asProfiles = (data: any[]): Profile[] => data as Profile[];
export const asOrders = (data: any[]): Order[] => data as Order[];
export const asTestimonials = (data: any[]): Testimonial[] => data as Testimonial[];
export const asVisitors = (data: any[]): Visitor[] => data as Visitor[];
export const asEmailMessages = (data: any[]): EmailMessage[] => data as EmailMessage[];
