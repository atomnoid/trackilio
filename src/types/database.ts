export type PriorityLevel = 'must_visit' | 'want_to_visit' | 'maybe';
export type VisitStatus = 'saved' | 'planned' | 'visited';
export type MemberRole = 'owner' | 'editor' | 'viewer';
export type VoteType = 'up' | 'down';

export interface Profile {
  id: string;
  display_name: string;
  username?: string | null;
  bio?: string | null;
  location?: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  // Computed fields
  public_lists_count?: number;
  total_votes_count?: number;
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
  votes_count?: number;
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
  slug?: string;
  location: string | null;
  city?: string | null;
  country: string | null;
  category: string | null;
  address?: string | null;
  description?: string | null;
  website?: string | null;
  image_url?: string | null;
  rating?: number | null;
  lat?: number | null;
  lng?: number | null;
  maps_url: string | null;
  created_at: string;
  updated_at: string;
  // Computed / Joined fields
  community_score?: number;
  upvotes_count?: number;
  downvotes_count?: number;
  saves_count?: number;
  lists_count?: number;
  is_saved?: boolean;
  user_vote_type?: VoteType | null;
  comments?: Comment[];
}

export interface SavedPlace {
  id: string;
  user_id: string;
  place_id: string;
  created_at: string;
  place?: Place;
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
  upvotes_count?: number;
  downvotes_count?: number;
  user_has_voted?: boolean;
  user_vote_type?: VoteType | null;
  comments?: Comment[];
}

export interface Vote {
  id: string;
  list_place_id: string;
  user_id: string;
  vote_type: VoteType;
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

export interface DailyFact {
  id: string;
  title: string;
  fact: string;
  location: string | null;
  country: string | null;
  published_date: string;
  related_place_id: string | null;
  created_at: string;
}

export interface BlendSession {
  id: string;
  user_a_id: string;
  user_b_id: string;
  score: number;
  shared_places: Array<{ name: string; destination?: string }>;
  shared_destinations: string[];
  created_at: string;
  // Joined
  user_a?: Profile;
  user_b?: Profile;
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
      daily_facts: {
        Row: DailyFact;
        Insert: Omit<DailyFact, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<DailyFact, 'id'>>;
      };
      blend_sessions: {
        Row: BlendSession;
        Insert: Omit<BlendSession, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<BlendSession, 'id'>>;
      };
      saved_places: {
        Row: SavedPlace;
        Insert: Omit<SavedPlace, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<SavedPlace, 'id'>>;
      };
    };
  };
}
