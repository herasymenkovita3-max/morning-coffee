import { supabase } from "@/integrations/supabase/client";

export type Post = {
  id: string;
  title: string;
  summary: string;
  source_name: string;
  source_url: string;
  likes_count: number;
  created_at: string;
};

export type Quote = {
  id: string;
  text: string;
  author: string | null;
  shown_on: string;
};

export const postsQuery = {
  queryKey: ["posts"],
  queryFn: async (): Promise<Post[]> => {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from("posts")
      .select("id,title,summary,source_name,source_url,likes_count,created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
};

export const quoteQuery = {
  queryKey: ["quote-of-the-day"],
  queryFn: async (): Promise<Quote | null> => {
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await supabase
      .from("quotes")
      .select("id,text,author,shown_on")
      .eq("shown_on", today)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  },
};

export async function likePost(postId: string): Promise<number | null> {
  const { data, error } = await supabase.rpc("increment_post_likes", { post_id: postId });
  if (error) throw error;
  return typeof data === "number" ? data : null;
}

const LIKED_KEY = "ncjc_liked_posts";

export function getLikedPosts(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LIKED_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function markLiked(postId: string) {
  if (typeof window === "undefined") return;
  const next = Array.from(new Set([...getLikedPosts(), postId]));
  window.localStorage.setItem(LIKED_KEY, JSON.stringify(next));
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.max(1, Math.round(diff / 60000));
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}
