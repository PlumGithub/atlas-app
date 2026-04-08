export type UserTier = "free" | "signal" | "substrate";

export type SubstrateProfile = {
  aesthetic_clusters: string[];
  geographic_pulls: string[];
  discovery_vectors: string[];
  anti_signals: string[];
  density_preference: "surface" | "mid" | "deep";
  last_synthesized: string;
};

export type User = {
  id: string;
  email: string;
  tier: UserTier;
  substrate: SubstrateProfile | null;
  created_at: string;
  onboarded: boolean;
};

export type Signal = {
  id: string;
  title: string;
  medium: "music" | "film" | "food" | "event" | "place" | "object";
  source: string;
  url: string | null;
  location: string | null;
  obscurity_score: number;
  tags: string[];
  description: string;
  created_at: string;
};

export type DigestItem = {
  signal: Signal;
  match_score: number;
  match_reason: string;
};

export type Connection = {
  id: string;
  user_id: string;
  platform: "spotify" | "letterboxd" | "beli";
  connected: boolean;
  last_synced: string | null;
};
