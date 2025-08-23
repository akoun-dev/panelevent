export type QuestionStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ANSWERED'

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          slug: string
          startDate: string
          endDate: string | null
          location: string | null
          isPublic: boolean
          isActive: boolean
          maxAttendees: number | null
          organizerId: string
          program: string | null
          qrCode: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          slug: string
          startDate: string
          endDate?: string | null
          location?: string | null
          isPublic?: boolean
          isActive?: boolean
          maxAttendees?: number | null
          organizerId: string
          program?: string | null
          qrCode?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          slug?: string
          startDate?: string
          endDate?: string | null
          location?: string | null
          isPublic?: boolean
          isActive?: boolean
          maxAttendees?: number | null
          organizerId?: string
          program?: string | null
          qrCode?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          content: string
          authorName: string
          authorEmail: string
          status: QuestionStatus
          eventId: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content: string
          authorName: string
          authorEmail: string
          status?: QuestionStatus
          eventId: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content?: string
          authorName?: string
          authorEmail?: string
          status?: QuestionStatus
          eventId?: string
          created_at?: string
          updated_at?: string
        }
      }
      polls: {
        Row: {
          id: string
          question: string
          options: string[]
          eventId: string
          isActive: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          question: string
          options: string[]
          eventId: string
          isActive?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          question?: string
          options?: string[]
          eventId?: string
          isActive?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      event_registrations: {
        Row: {
          id: string
          eventId: string
          firstName: string
          lastName: string
          email: string
          company: string | null
          position: string | null
          created_at: string
        }
        Insert: {
          id?: string
          eventId: string
          firstName: string
          lastName: string
          email: string
          company?: string | null
          position?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          eventId?: string
          firstName?: string
          lastName?: string
          email?: string
          company?: string | null
          position?: string | null
          created_at?: string
        }
      }
    }
  }
}