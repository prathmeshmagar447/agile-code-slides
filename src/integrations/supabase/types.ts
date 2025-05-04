export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bid_responses: {
        Row: {
          bid_id: string | null
          created_at: string
          delivery_time: unknown | null
          id: string
          notes: string | null
          price: number
          quantity_offered: number | null
          supplier_id: string | null
        }
        Insert: {
          bid_id?: string | null
          created_at?: string
          delivery_time?: unknown | null
          id?: string
          notes?: string | null
          price: number
          quantity_offered?: number | null
          supplier_id?: string | null
        }
        Update: {
          bid_id?: string | null
          created_at?: string
          delivery_time?: unknown | null
          id?: string
          notes?: string | null
          price?: number
          quantity_offered?: number | null
          supplier_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bid_responses_bid_id_fkey"
            columns: ["bid_id"]
            isOneToOne: false
            referencedRelation: "bids"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bid_responses_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bids: {
        Row: {
          created_at: string
          created_by: string | null
          deadline: string | null
          description: string | null
          id: string
          material: string
          quantity: number
          unit: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          material: string
          quantity: number
          unit: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          material?: string
          quantity?: number
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "bids_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      company: {
        Row: {
          company_id: string
          created_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      company_order_items: {
        Row: {
          created_at: string
          item_id: string
          item_name: string
          order_id: string | null
          price: number
          quantity: number
        }
        Insert: {
          created_at?: string
          item_id?: string
          item_name: string
          order_id?: string | null
          price: number
          quantity: number
        }
        Update: {
          created_at?: string
          item_id?: string
          item_name?: string
          order_id?: string | null
          price?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "company_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "company_orders"
            referencedColumns: ["order_id"]
          },
        ]
      }
      company_orders: {
        Row: {
          company_id: string | null
          created_at: string
          order_date: string
          order_id: string
          order_no: string
          order_status: string
          order_supplier: string | null
          order_total_amount: number
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          order_date: string
          order_id?: string
          order_no: string
          order_status: string
          order_supplier?: string | null
          order_total_amount: number
        }
        Update: {
          company_id?: string | null
          created_at?: string
          order_date?: string
          order_id?: string
          order_no?: string
          order_status?: string
          order_supplier?: string | null
          order_total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "company_orders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "company_orders_order_supplier_fkey"
            columns: ["order_supplier"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["supplier_id"]
          },
        ]
      }
      company_supplier_master: {
        Row: {
          company_id: string | null
          created_at: string
          id: string
          status: string | null
          supplier_id: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          id?: string
          status?: string | null
          supplier_id?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          id?: string
          status?: string | null
          supplier_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_supplier_master_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "company_supplier_master_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["supplier_id"]
          },
        ]
      }
      consumers: {
        Row: {
          consumer_id: string
          created_at: string
        }
        Insert: {
          consumer_id: string
          created_at?: string
        }
        Update: {
          consumer_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "consumers_consumer_id_fkey"
            columns: ["consumer_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          item_id: string
          item_name: string
          order_id: string | null
          price: number
          quantity: number
        }
        Insert: {
          created_at?: string
          item_id?: string
          item_name: string
          order_id?: string | null
          price: number
          quantity: number
        }
        Update: {
          created_at?: string
          item_id?: string
          item_name?: string
          order_id?: string | null
          price?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "company_orders"
            referencedColumns: ["order_id"]
          },
        ]
      }
      supplier_items: {
        Row: {
          created_at: string
          description: string | null
          item_id: string
          item_name: string
          price: number
          stock_quantity: number
          supplier_id: string | null
          unit: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          item_id?: string
          item_name: string
          price: number
          stock_quantity?: number
          supplier_id?: string | null
          unit: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          item_id?: string
          item_name?: string
          price?: number
          stock_quantity?: number
          supplier_id?: string | null
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_items_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["supplier_id"]
          },
        ]
      }
      suppliers: {
        Row: {
          category: string | null
          contact: string | null
          created_at: string
          rating: string | null
          supplier_id: string
        }
        Insert: {
          category?: string | null
          contact?: string | null
          created_at?: string
          rating?: string | null
          supplier_id: string
        }
        Update: {
          category?: string | null
          contact?: string | null
          created_at?: string
          rating?: string | null
          supplier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name?: string | null
          role: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
