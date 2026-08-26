export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      challenge_matches: {
        Row: {
          challenge_id: string
          claimed_at: string | null
          created_at: string
          id: string
          institution_id: string
          is_claimed: boolean
          marked_resolved_at: string | null
          match_reason: string
          match_score: number
        }
        Insert: {
          challenge_id: string
          claimed_at?: string | null
          created_at?: string
          id?: string
          institution_id: string
          is_claimed?: boolean
          marked_resolved_at?: string | null
          match_reason: string
          match_score: number
        }
        Update: {
          challenge_id?: string
          claimed_at?: string | null
          created_at?: string
          id?: string
          institution_id?: string
          is_claimed?: boolean
          marked_resolved_at?: string | null
          match_reason?: string
          match_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "challenge_matches_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_matches_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          created_at: string
          description: string
          domain: Database["public"]["Enums"]["challenge_domain"] | null
          domain_confidence: number | null
          duplicate_of: string | null
          id: string
          lat: number | null
          location_text: string | null
          lon: number | null
          photo_urls: Json | null
          report_count: number
          resolved_confirmed_at: string | null
          resolved_confirmed_by: string | null
          status: Database["public"]["Enums"]["challenge_status"]
          submitted_by: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          domain?: Database["public"]["Enums"]["challenge_domain"] | null
          domain_confidence?: number | null
          duplicate_of?: string | null
          id?: string
          lat?: number | null
          location_text?: string | null
          lon?: number | null
          photo_urls?: Json | null
          report_count?: number
          resolved_confirmed_at?: string | null
          resolved_confirmed_by?: string | null
          status?: Database["public"]["Enums"]["challenge_status"]
          submitted_by?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          domain?: Database["public"]["Enums"]["challenge_domain"] | null
          domain_confidence?: number | null
          duplicate_of?: string | null
          id?: string
          lat?: number | null
          location_text?: string | null
          lon?: number | null
          photo_urls?: Json | null
          report_count?: number
          resolved_confirmed_at?: string | null
          resolved_confirmed_by?: string | null
          status?: Database["public"]["Enums"]["challenge_status"]
          submitted_by?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenges_duplicate_of_fkey"
            columns: ["duplicate_of"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_resolved_confirmed_by_fkey"
            columns: ["resolved_confirmed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "challenges_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      institutions: {
        Row: {
          admin_user_id: string | null
          contact_email: string | null
          created_at: string
          department: string | null
          expertise_tags: Json | null
          id: string
          institution_type: string
          name: string
        }
        Insert: {
          admin_user_id?: string | null
          contact_email?: string | null
          created_at?: string
          department?: string | null
          expertise_tags?: Json | null
          id?: string
          institution_type: string
          name: string
        }
        Update: {
          admin_user_id?: string | null
          contact_email?: string | null
          created_at?: string
          department?: string | null
          expertise_tags?: Json | null
          id?: string
          institution_type?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "institutions_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          is_verified: boolean | null
          location: string | null
          phone: string | null
          preferences: Json | null
          updated_at: string
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"] | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          location?: string | null
          phone?: string | null
          preferences?: Json | null
          updated_at?: string
          user_id: string
          user_type?: Database["public"]["Enums"]["user_type"] | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          location?: string | null
          phone?: string | null
          preferences?: Json | null
          updated_at?: string
          user_id?: string
          user_type?: Database["public"]["Enums"]["user_type"] | null
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
      challenge_domain:
        | "education"
        | "agriculture"
        | "healthcare"
        | "water_resources"
        | "environment"
        | "energy"
        | "urban_development"
        | "accessibility"
        | "public_administration"
        | "rural_livelihoods"
      challenge_status:
        | "submitted"
        | "ai_matched"
        | "claimed"
        | "in_progress"
        | "resolved"
      user_type:
        | "citizen"
        | "local_guide"
        | "agency"
        | "admin"
        | "university"
        | "industry"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      challenge_domain: [
        "education",
        "agriculture",
        "healthcare",
        "water_resources",
        "environment",
        "energy",
        "urban_development",
        "accessibility",
        "public_administration",
        "rural_livelihoods",
      ],
      challenge_status: [
        "submitted",
        "ai_matched",
        "claimed",
        "in_progress",
        "resolved",
      ],
      user_type: [
        "citizen",
        "local_guide",
        "agency",
        "admin",
        "university",
        "industry",
      ],
    },
  },
} as const
