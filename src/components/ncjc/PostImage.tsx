import { useEffect, useState } from "react";
import { ensurePostImage, type Post } from "@/lib/ncjc";

export function PostImage({
  post,
  className = "",
  delayMs = 0,
}: {
  post: Post;
  className?: string;
  delayMs?: number;
}) {
  const [url, setUrl] = useState<string | null>(post.image_url);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (post.image_url) {
      setUrl(post.image_url);
      return;
    }
    let active = true;
    const timer = setTimeout(() => {
      void ensurePostImage(post.id).then((next) => {
        if (active && next) setUrl(next);
      });
    }, delayMs);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [post.id, post.image_url, delayMs]);

  return (
    <div className={`relative overflow-hidden bg-secondary ${className}`}>
      {url && (
        <img
          src={url}
          alt=""
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`h-full w-full object-cover transition-[filter,opacity] duration-700 ${
            loaded ? "opacity-100 blur-0" : "opacity-0 blur-2xl"
          }`}
        />
      )}
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gold/40 via-secondary to-forest/30" />
      )}
    </div>
  );
}
