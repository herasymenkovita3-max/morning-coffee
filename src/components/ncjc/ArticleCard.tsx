import { useState } from "react";
import { Heart, Share2 } from "lucide-react";
import { PostImage } from "@/components/ncjc/PostImage";
import { likePost, markLiked, timeAgo, type Post } from "@/lib/ncjc";

const accents = ["bg-card", "bg-gold/25", "bg-forest/15", "bg-coffee/10"];

export function ArticleCard({
  post,
  index,
  liked,
  onLiked,
  onToast,
}: {
  post: Post;
  index: number;
  liked: boolean;
  onLiked: (id: string) => void;
  onToast: (message: string) => void;
}) {
  const [count, setCount] = useState(post.likes_count);
  const [busy, setBusy] = useState(false);

  const handleLike = async () => {
    if (liked || busy) return;
    setBusy(true);
    setCount((c) => c + 1);
    try {
      const next = await likePost(post.id);
      if (typeof next === "number") setCount(next);
      markLiked(post.id);
      onLiked(post.id);
    } catch {
      setCount((c) => c - 1);
      onToast("Couldn't save your like. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleShare = async () => {
    const url = post.source_url;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: post.title, text: post.summary.slice(0, 120), url });
        return;
      } catch {
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      onToast("Link copied to clipboard");
    } catch {
      onToast("Couldn't copy the link");
    }
  };

  return (
    <article
      className={`${accents[index % accents.length]} ${
        index % 2 === 0 ? "blob-card" : "blob-card-alt"
      } flex flex-col overflow-hidden border border-border/60`}
    >
      <PostImage post={post} className="h-44 w-full sm:h-52" delayMs={(index + 1) * 1200} />
      <div className="flex flex-1 flex-col p-6 sm:p-8">
      <h3 className="text-2xl leading-tight font-semibold sm:text-3xl">{post.title}</h3>
      <p className="mt-3 text-base leading-relaxed text-foreground/80">{post.summary}</p>
      <p className="mt-4 text-sm text-muted-foreground">
        As reported by{" "}
        <a
          href={post.source_url}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4 hover:text-coffee"
        >
          {post.source_name}
        </a>
      </p>
      <div className="mt-6 flex items-center gap-3 border-t border-border/60 pt-4">
        <button
          type="button"
          onClick={handleLike}
          aria-label="Like this story"
          className={`inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm transition-colors ${
            liked ? "bg-coffee text-coffee-foreground" : "hover:bg-secondary"
          }`}
        >
          <Heart size={14} fill={liked ? "currentColor" : "none"} />
          {count}
        </button>
        <button
          type="button"
          onClick={handleShare}
          aria-label="Share this story"
          className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm transition-colors hover:bg-secondary"
        >
          <Share2 size={14} />
          Share
        </button>
        <span className="ml-auto text-sm text-muted-foreground">{timeAgo(post.created_at)}</span>
      </div>
      </div>
    </article>
  );
}
