export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: number
          telegram_id: string
          username: string | null
          first_name: string | null
          last_name: string | null
          phone_number: string | null
          balance: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          telegram_id: string
          username?: string | null
          first_name?: string | null
          last_name?: string | null
          phone_number?: string | null
          balance?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          telegram_id?: string
          username?: string | null
          first_name?: string | null
          last_name?: string | null
          phone_number?: string | null
          balance?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      creators: {
        Row: {
          id: number
          user_id: number
          channel_username: string
          handle: string | null
          display_name: string
          bio: string | null
          links: Json | null
          support_link_id: string
          balance: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: number
          channel_username: string
          handle?: string | null
          display_name: string
          bio?: string | null
          links?: Json | null
          support_link_id: string
          balance?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: number
          channel_username?: string
          handle?: string | null
          display_name?: string
          bio?: string | null
          links?: Json | null
          support_link_id?: string
          balance?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "creators_user_id_fkey",
            columns: ["user_id"],
            referencedRelation: "users",
            referencedColumns: ["id"],
          },
        ]
      }
      transactions: {
        Row: {
          id: number
          from_user_id: number | null
          to_creator_id: number | null
          amount: number
          admin_fee: number | null
          transaction_type: string
          description: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: number
          from_user_id?: number | null
          to_creator_id?: number | null
          amount: number
          admin_fee?: number | null
          transaction_type: string
          description?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: number
          from_user_id?: number | null
          to_creator_id?: number | null
          amount?: number
          admin_fee?: number | null
          transaction_type?: string
          description?: string | null
          status?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_from_user_id_fkey",
            columns: ["from_user_id"],
            referencedRelation: "users",
            referencedColumns: ["id"],
          },
          {
            foreignKeyName: "transactions_to_creator_id_fkey",
            columns: ["to_creator_id"],
            referencedRelation: "creators",
            referencedColumns: ["id"],
          },
        ]
      }
      withdrawal_requests: {
        Row: {
          id: number
          creator_id: number
          amount: number
          bank_account: Json
          status: string
          requested_at: string
          approved_at: string | null
          approved_by: number | null
        }
        Insert: {
          id?: number
          creator_id: number
          amount: number
          bank_account: Json
          status?: string
          requested_at?: string
          approved_at?: string | null
          approved_by?: number | null
        }
        Update: {
          id?: number
          creator_id?: number
          amount?: number
          bank_account?: Json
          status?: string
          requested_at?: string
          approved_at?: string | null
          approved_by?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "withdrawal_requests_creator_id_fkey",
            columns: ["creator_id"],
            referencedRelation: "creators",
            referencedColumns: ["id"],
          },
          {
            foreignKeyName: "withdrawal_requests_approved_by_fkey",
            columns: ["approved_by"],
            referencedRelation: "users",
            referencedColumns: ["id"],
          },
        ]
      }
    }
    Views: {
      [key: string]: never
    }
    Functions: {
      [key: string]: never
    }
    Enums: {
      [key: string]: never
    }
    CompositeTypes: {
      [key: string]: never
    }
  }
}


