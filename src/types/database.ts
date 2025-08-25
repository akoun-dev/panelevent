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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      certificate_templates: {
        Row: {
          autoGenerate: boolean
          content: string
          createdAt: string
          description: string | null
          eventId: string
          id: string
          title: string
          updatedAt: string
          userId: string | null
        }
        Insert: {
          autoGenerate?: boolean
          content: string
          createdAt?: string
          description?: string | null
          eventId: string
          id: string
          title: string
          updatedAt?: string
          userId?: string | null
        }
        Update: {
          autoGenerate?: boolean
          content?: string
          createdAt?: string
          description?: string | null
          eventId?: string
          id?: string
          title?: string
          updatedAt?: string
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificate_templates_eventid_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificate_templates_eventid_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "events_with_translations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificate_templates_userid_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          certificateUrl: string
          content: string
          eventId: string
          id: string
          issuedAt: string
          qrCodeUrl: string
          templateId: string
          userId: string
          verifiedAt: string | null
        }
        Insert: {
          certificateUrl: string
          content: string
          eventId: string
          id: string
          issuedAt?: string
          qrCodeUrl: string
          templateId: string
          userId: string
          verifiedAt?: string | null
        }
        Update: {
          certificateUrl?: string
          content?: string
          eventId?: string
          id?: string
          issuedAt?: string
          qrCodeUrl?: string
          templateId?: string
          userId?: string
          verifiedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificates_eventid_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_eventid_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "events_with_translations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_templateid_fkey"
            columns: ["templateId"]
            isOneToOne: false
            referencedRelation: "certificate_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_userid_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          attended: boolean
          company: string | null
          consent: boolean
          createdAt: string
          dietaryRestrictions: string | null
          email: string | null
          eventId: string
          expectations: string | null
          experience: string | null
          firstName: string | null
          id: string
          isPublic: boolean
          language: string | null
          lastName: string | null
          phone: string | null
          position: string | null
          userId: string | null
        }
        Insert: {
          attended?: boolean
          company?: string | null
          consent?: boolean
          createdAt?: string
          dietaryRestrictions?: string | null
          email?: string | null
          eventId: string
          expectations?: string | null
          experience?: string | null
          firstName?: string | null
          id: string
          isPublic?: boolean
          language?: string | null
          lastName?: string | null
          phone?: string | null
          position?: string | null
          userId?: string | null
        }
        Update: {
          attended?: boolean
          company?: string | null
          consent?: boolean
          createdAt?: string
          dietaryRestrictions?: string | null
          email?: string | null
          eventId?: string
          expectations?: string | null
          experience?: string | null
          firstName?: string | null
          id?: string
          isPublic?: boolean
          language?: string | null
          lastName?: string | null
          phone?: string | null
          position?: string | null
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_eventid_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_registrations_eventid_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "events_with_translations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_registrations_userid_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          branding: Json | null
          createdAt: string
          description: string | null
          description_translations: Json | null
          endDate: string | null
          hascertificates: boolean | null
          haspolls: boolean | null
          hasqa: boolean | null
          id: string
          isActive: boolean
          isPublic: boolean
          location: string | null
          location_translations: Json | null
          maxAttendees: number | null
          organizerId: string
          program: string | null
          qrCode: string | null
          slug: string
          startDate: string
          title: string
          title_translations: Json | null
          updatedAt: string
        }
        Insert: {
          branding?: Json | null
          createdAt?: string
          description?: string | null
          description_translations?: Json | null
          endDate?: string | null
          hascertificates?: boolean | null
          haspolls?: boolean | null
          hasqa?: boolean | null
          id: string
          isActive?: boolean
          isPublic?: boolean
          location?: string | null
          location_translations?: Json | null
          maxAttendees?: number | null
          organizerId: string
          program?: string | null
          qrCode?: string | null
          slug: string
          startDate: string
          title: string
          title_translations?: Json | null
          updatedAt?: string
        }
        Update: {
          branding?: Json | null
          createdAt?: string
          description?: string | null
          description_translations?: Json | null
          endDate?: string | null
          hascertificates?: boolean | null
          haspolls?: boolean | null
          hasqa?: boolean | null
          id?: string
          isActive?: boolean
          isPublic?: boolean
          location?: string | null
          location_translations?: Json | null
          maxAttendees?: number | null
          organizerId?: string
          program?: string | null
          qrCode?: string | null
          slug?: string
          startDate?: string
          title?: string
          title_translations?: Json | null
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_organizerid_fkey"
            columns: ["organizerId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      feedbacks: {
        Row: {
          category: string
          comment: string | null
          createdAt: string
          eventId: string
          id: string
          rating: number
          resolved: boolean
          userId: string
        }
        Insert: {
          category: string
          comment?: string | null
          createdAt?: string
          eventId: string
          id: string
          rating: number
          resolved?: boolean
          userId: string
        }
        Update: {
          category?: string
          comment?: string | null
          createdAt?: string
          eventId?: string
          id?: string
          rating?: number
          resolved?: boolean
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedbacks_eventid_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedbacks_eventid_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "events_with_translations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedbacks_userid_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      helpful_votes: {
        Row: {
          createdAt: string
          feedbackId: string
          userId: string
        }
        Insert: {
          createdAt?: string
          feedbackId: string
          userId: string
        }
        Update: {
          createdAt?: string
          feedbackId?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "helpful_votes_feedbackid_fkey"
            columns: ["feedbackId"]
            isOneToOne: false
            referencedRelation: "feedbacks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "helpful_votes_userid_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      panels: {
        Row: {
          allowQuestions: boolean
          createdAt: string
          description: string | null
          endTime: string | null
          eventId: string
          id: string
          startTime: string | null
          title: string
          updatedAt: string
        }
        Insert: {
          allowQuestions?: boolean
          createdAt?: string
          description?: string | null
          endTime?: string | null
          eventId: string
          id: string
          startTime?: string | null
          title: string
          updatedAt?: string
        }
        Update: {
          allowQuestions?: boolean
          createdAt?: string
          description?: string | null
          endTime?: string | null
          eventId?: string
          id?: string
          startTime?: string | null
          title?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "panels_eventid_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "panels_eventid_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "events_with_translations"
            referencedColumns: ["id"]
          },
        ]
      }
      password_reset_tokens: {
        Row: {
          createdAt: string
          expiresAt: string
          id: string
          token: string
          userId: string
        }
        Insert: {
          createdAt?: string
          expiresAt: string
          id?: string
          token: string
          userId: string
        }
        Update: {
          createdAt?: string
          expiresAt?: string
          id?: string
          token?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "password_reset_tokens_userId_fkey"
            columns: ["userId"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      poll_options: {
        Row: {
          id: string
          order: number
          pollId: string
          text: string
        }
        Insert: {
          id: string
          order?: number
          pollId: string
          text: string
        }
        Update: {
          id?: string
          order?: number
          pollId?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "poll_options_pollid_fkey"
            columns: ["pollId"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
      poll_responses: {
        Row: {
          createdAt: string
          id: string
          optionId: string
          pollId: string
          userId: string
        }
        Insert: {
          createdAt?: string
          id: string
          optionId: string
          pollId: string
          userId: string
        }
        Update: {
          createdAt?: string
          id?: string
          optionId?: string
          pollId?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "poll_responses_optionid_fkey"
            columns: ["optionId"]
            isOneToOne: false
            referencedRelation: "poll_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poll_responses_pollid_fkey"
            columns: ["pollId"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poll_responses_userid_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      polls: {
        Row: {
          allowMultipleVotes: boolean
          createdAt: string
          description: string | null
          eventId: string
          id: string
          isActive: boolean
          isAnonymous: boolean
          question: string
          updatedAt: string
        }
        Insert: {
          allowMultipleVotes?: boolean
          createdAt?: string
          description?: string | null
          eventId: string
          id: string
          isActive?: boolean
          isAnonymous?: boolean
          question: string
          updatedAt?: string
        }
        Update: {
          allowMultipleVotes?: boolean
          createdAt?: string
          description?: string | null
          eventId?: string
          id?: string
          isActive?: boolean
          isAnonymous?: boolean
          question?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "polls_eventid_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "polls_eventid_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "events_with_translations"
            referencedColumns: ["id"]
          },
        ]
      }
      question_votes: {
        Row: {
          createdAt: string
          questionId: string
          type: Database["public"]["Enums"]["VoteType"]
          userId: string
        }
        Insert: {
          createdAt?: string
          questionId: string
          type: Database["public"]["Enums"]["VoteType"]
          userId: string
        }
        Update: {
          createdAt?: string
          questionId?: string
          type?: Database["public"]["Enums"]["VoteType"]
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_votes_questionid_fkey"
            columns: ["questionId"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_votes_userid_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          authorEmail: string
          authorName: string
          content: string
          createdAt: string
          eventId: string
          id: string
          panelId: string | null
          status: Database["public"]["Enums"]["QuestionStatus"]
          updatedAt: string
        }
        Insert: {
          authorEmail: string
          authorName: string
          content: string
          createdAt?: string
          eventId: string
          id: string
          panelId?: string | null
          status?: Database["public"]["Enums"]["QuestionStatus"]
          updatedAt?: string
        }
        Update: {
          authorEmail?: string
          authorName?: string
          content?: string
          createdAt?: string
          eventId?: string
          id?: string
          panelId?: string | null
          status?: Database["public"]["Enums"]["QuestionStatus"]
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_eventid_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_eventid_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "events_with_translations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_panelid_fkey"
            columns: ["panelId"]
            isOneToOne: false
            referencedRelation: "panels"
            referencedColumns: ["id"]
          },
        ]
      }
      registration_tokens: {
        Row: {
          created_at: string
          event_id: string | null
          expires_at: string
          id: string
          token: string
          updated_at: string
          used: boolean
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          expires_at: string
          id?: string
          token: string
          updated_at?: string
          used?: boolean
        }
        Update: {
          created_at?: string
          event_id?: string | null
          expires_at?: string
          id?: string
          token?: string
          updated_at?: string
          used?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "registration_tokens_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registration_tokens_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events_with_translations"
            referencedColumns: ["id"]
          },
        ]
      }
      RegistrationToken: {
        Row: {
          createdAt: string
          eventId: string
          expiresAt: string
          id: string
          token: string
          updatedAt: string
          used: boolean
        }
        Insert: {
          createdAt?: string
          eventId: string
          expiresAt: string
          id: string
          token: string
          updatedAt?: string
          used?: boolean
        }
        Update: {
          createdAt?: string
          eventId?: string
          expiresAt?: string
          id?: string
          token?: string
          updatedAt?: string
          used?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "RegistrationToken_eventId_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "RegistrationToken_eventId_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "events_with_translations"
            referencedColumns: ["id"]
          },
        ]
      }
      session_attendance: {
        Row: {
          created_at: string | null
          email: string | null
          event_id: string
          first_name: string
          id: string
          last_name: string
          organization: string | null
          phone: string | null
          session_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          event_id: string
          first_name: string
          id?: string
          last_name: string
          organization?: string | null
          phone?: string | null
          session_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          event_id?: string
          first_name?: string
          id?: string
          last_name?: string
          organization?: string | null
          phone?: string | null
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_session_attendance_event"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_session_attendance_event"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events_with_translations"
            referencedColumns: ["id"]
          },
        ]
      }
      session_registrations: {
        Row: {
          email: string
          event_id: string
          first_name: string
          function: string
          id: string
          language: string | null
          last_name: string
          organization: string
          registered_at: string | null
          session_id: string
        }
        Insert: {
          email: string
          event_id: string
          first_name: string
          function: string
          id?: string
          language?: string | null
          last_name: string
          organization: string
          registered_at?: string | null
          session_id: string
        }
        Update: {
          email?: string
          event_id?: string
          first_name?: string
          function?: string
          id?: string
          language?: string | null
          last_name?: string
          organization?: string
          registered_at?: string | null
          session_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar: string | null
          createdAt: string
          email: string
          id: string
          name: string | null
          passwordHash: string | null
          role: Database["public"]["Enums"]["UserRole"]
          updatedAt: string
        }
        Insert: {
          avatar?: string | null
          createdAt?: string
          email: string
          id: string
          name?: string | null
          passwordHash?: string | null
          role?: Database["public"]["Enums"]["UserRole"]
          updatedAt?: string
        }
        Update: {
          avatar?: string | null
          createdAt?: string
          email?: string
          id?: string
          name?: string | null
          passwordHash?: string | null
          role?: Database["public"]["Enums"]["UserRole"]
          updatedAt?: string
        }
        Relationships: []
      }
    }
    Views: {
      events_with_translations: {
        Row: {
          branding: Json | null
          createdAt: string | null
          description: string | null
          description_ar: string | null
          description_en: string | null
          description_es: string | null
          description_fr: string | null
          description_pt: string | null
          description_translations: Json | null
          endDate: string | null
          id: string | null
          isActive: boolean | null
          isPublic: boolean | null
          location: string | null
          location_ar: string | null
          location_en: string | null
          location_es: string | null
          location_fr: string | null
          location_pt: string | null
          location_translations: Json | null
          maxAttendees: number | null
          organizerId: string | null
          program: string | null
          qrCode: string | null
          slug: string | null
          startDate: string | null
          title: string | null
          title_ar: string | null
          title_en: string | null
          title_es: string | null
          title_fr: string | null
          title_pt: string | null
          title_translations: Json | null
          updatedAt: string | null
        }
        Insert: {
          branding?: Json | null
          createdAt?: string | null
          description?: string | null
          description_ar?: never
          description_en?: never
          description_es?: never
          description_fr?: never
          description_pt?: never
          description_translations?: Json | null
          endDate?: string | null
          id?: string | null
          isActive?: boolean | null
          isPublic?: boolean | null
          location?: string | null
          location_ar?: never
          location_en?: never
          location_es?: never
          location_fr?: never
          location_pt?: never
          location_translations?: Json | null
          maxAttendees?: number | null
          organizerId?: string | null
          program?: string | null
          qrCode?: string | null
          slug?: string | null
          startDate?: string | null
          title?: string | null
          title_ar?: never
          title_en?: never
          title_es?: never
          title_fr?: never
          title_pt?: never
          title_translations?: Json | null
          updatedAt?: string | null
        }
        Update: {
          branding?: Json | null
          createdAt?: string | null
          description?: string | null
          description_ar?: never
          description_en?: never
          description_es?: never
          description_fr?: never
          description_pt?: never
          description_translations?: Json | null
          endDate?: string | null
          id?: string | null
          isActive?: boolean | null
          isPublic?: boolean | null
          location?: string | null
          location_ar?: never
          location_en?: never
          location_es?: never
          location_fr?: never
          location_pt?: never
          location_translations?: Json | null
          maxAttendees?: number | null
          organizerId?: string | null
          program?: string | null
          qrCode?: string | null
          slug?: string | null
          startDate?: string | null
          title?: string | null
          title_ar?: never
          title_en?: never
          title_es?: never
          title_fr?: never
          title_pt?: never
          title_translations?: Json | null
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_organizerid_fkey"
            columns: ["organizerId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      check_session_attendance_duplicate: {
        Args: {
          email_param: string
          event_id_param: string
          session_id_param: string
        }
        Returns: boolean
      }
      get_event_description: {
        Args: { event_id: string; lang_code?: string }
        Returns: string
      }
      get_event_location: {
        Args: { event_id: string; lang_code?: string }
        Returns: string
      }
      get_event_title: {
        Args: { event_id: string; lang_code?: string }
        Returns: string
      }
      get_session_attendance_stats: {
        Args: { event_id_param: string }
        Returns: {
          attendance_count: number
          last_attendance: string
          session_id: string
        }[]
      }
      get_translation: {
        Args: { fallback_lang?: string; lang_code: string; translations: Json }
        Returns: string
      }
    }
    Enums: {
      QuestionStatus: "PENDING" | "APPROVED" | "REJECTED"
      UserRole: "ADMIN" | "ORGANIZER" | "ATTENDEE"
      VoteType: "UP" | "DOWN"
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
  public: {
    Enums: {
      QuestionStatus: ["PENDING", "APPROVED", "REJECTED"],
      UserRole: ["ADMIN", "ORGANIZER", "ATTENDEE"],
      VoteType: ["UP", "DOWN"],
    },
  },
} as const
