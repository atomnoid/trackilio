export type PriorityLevel = 'must_visit' | 'want_to_visit' | 'maybe';
export type VisitStatus = 'saved' | 'planned' | 'visited';
export type MemberRole = 'owner' | 'editor' | 'viewer';

export interface Profile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface WanderList {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  destination: string | null;
  cover_image: string | null;
  slug: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields
  owner?: Profile;
  places_count?: number;
}

export interface ListMember {
  id: string;
  list_id: string;
  user_id: string;
  role: MemberRole;
  created_at: string;
  profile?: Profile;
}

export interface Place {
  id: string;
  name: string;
  location: string | null;
  country: string | null;
  category: string | null;
  maps_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ListPlace {
  id: string;
  list_id: string;
  place_id: string;
  note: string | null;
  priority: PriorityLevel;
  status: VisitStatus;
  added_by: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  place?: Place;
  votes_count?: number;
  user_has_voted?: boolean;
  comments?: Comment[];
}

export interface Vote {
  id: string;
  list_place_id: string;
  user_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  list_place_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'> & { created_at?: string; updated_at?: string };
        Update: Partial<Omit<Profile, 'id'>>;
      };
      wander_lists: {
        Row: WanderList;
        Insert: Omit<WanderList, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<WanderList, 'id'>>;
      };
      list_members: {
        Row: ListMember;
        Insert: Omit<ListMember, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<ListMember, 'id'>>;
      };
      places: {
        Row: Place;
        Insert: Omit<Place, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<Place, 'id'>>;
      };
      list_places: {
        Row: ListPlace;
        Insert: Omit<ListPlace, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<ListPlace, 'id'>>;
      };
      votes: {
        Row: Vote;
        Insert: Omit<Vote, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<Vote, 'id'>>;
      };
      comments: {
        Row: Comment;
        Insert: Omit<Comment, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<Comment, 'id'>>;
      };
    };
  };
}
