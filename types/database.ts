/**
 * Supabase schema types (snake_case, mirrors Postgres exactly).
 * Regenerate with `npm run db:types` after every migration.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      warranty_registrations: {
        Row: {
          id: string;
          user_id: string;
          product_name: string;
          serial_number: string;
          purchase_date: string;
          retailer: string | null;
          warranty_months: number;
          expires_on: string;
          activated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          product_name: string;
          serial_number: string;
          purchase_date: string;
          retailer?: string | null;
          warranty_months?: number;
          expires_on?: never;
          activated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_name?: string;
          serial_number?: string;
          purchase_date?: string;
          retailer?: string | null;
          warranty_months?: number;
          expires_on?: never;
          activated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
