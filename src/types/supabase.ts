export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      // Events organized by users
      events: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          slug: string;
          startDate: string;
          endDate: string | null;
          location: string | null;
          isPublic: boolean;
          isActive: boolean;
          branding: Json | null;
          program: string | null;
          qrCode: string | null;
          maxAttendees: number | null;
          createdAt: string;
          updatedAt: string;
          organizerId: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          slug: string;
          startDate: string;
          endDate?: string | null;
          location?: string | null;
          isPublic?: boolean;
          isActive?: boolean;
          branding?: Json | null;
          program?: string | null;
          qrCode?: string | null;
          maxAttendees?: number | null;
          createdAt?: string;
          updatedAt?: string;
          organizerId: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          slug?: string;
          startDate?: string;
          endDate?: string | null;
          location?: string | null;
          isPublic?: boolean;
          isActive?: boolean;
          branding?: Json | null;
          program?: string | null;
          qrCode?: string | null;
          maxAttendees?: number | null;
          createdAt?: string;
          updatedAt?: string;
          organizerId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "events_organizerId_fkey",
            columns: ["organizerId"],
            referencedRelation: "users",
            referencedColumns: ["id"],
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      UserRole: 'ADMIN' | 'ORGANIZER' | 'ATTENDEE'
      QuestionStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
      VoteType: 'UP' | 'DOWN'
    };
    CompositeTypes: Record<string, never>;
  };
}

export type QuestionStatus = Database['public']['Enums']['QuestionStatus']
