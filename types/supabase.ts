export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      people: {
        Row: {
          created_at: string | null
          id: number
          name: string | null
          party: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name?: string | null
          party?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string | null
          party?: string | null
        }
      }
      quotes: {
        Row: {
          id: number
          quote: string | null
          said_by: number | null
        }
        Insert: {
          id: number
          quote?: string | null
          said_by?: number | null
        }
        Update: {
          id?: number
          quote?: string | null
          said_by?: number | null
        }
      }
    }
    Views: {
      random_quotes: {
        Row: {
          id: number | null
          quote: string | null
          said_by: number | null
        }
        Insert: {
          id?: number | null
          quote?: string | null
          said_by?: number | null
        }
        Update: {
          id?: number | null
          quote?: string | null
          said_by?: number | null
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
