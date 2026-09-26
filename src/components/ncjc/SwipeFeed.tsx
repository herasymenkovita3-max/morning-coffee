import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ArticleCard } from "@/components/ncjc/ArticleCard";
import type { Post } from "@/lib/ncjc";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function SwipeFeed({
  posts,
  liked,
  onLiked,
  onToast,
}: {
  posts: Post[];
  liked: string[];
  onLiked: (id: string) => void;
  onToast: (m: string) => void;
}) {
  const [order, setOrder] = useState<Post[]>(posts);
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const ids = useMemo(() => posts.map((p) => p.id).join(","), [posts]);

  useEffect(() => setOrder(shuffle(posts)), [ids]); // eslint-disable-line react-hooks/exhaustive-deps

  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    setActive(Math.round(el.scrollLeft / el.clientWidth));
  };

  const go = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const next = Math.max(0, Math.min(order.length - 1, i));
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {order.map((post, i) => (
          <div key={post.id} className="w-full shrink-0 snap-center px-0.5 pb-3">
            <ArticleCard
              post={post}
              index={i}
              liked={liked.includes(post.id)}
              onLiked={onLiked}
              onToast={onToast}
            />
          </div>
        ))}
      </div>

      {order.length > 1 && (
        <div className="mt-2 flex items-center justify-center gap-3">
          <button
            type="button"
            aria-label="Previous story"
            onClick={() => go(active - 1)}
            disabled={active === 0}
            className="rounded-full border border-border p-1.5 disabled:opacity-30"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex gap-1.5">
            {order.map((p, i) => (
              <span
                key={p.id}
                className={`h-1.5 rounded-full transition-all ${
                  i === active ? "w-6 bg-coffee" : "w-1.5 bg-border"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next story"
            onClick={() => go(active + 1)}
            disabled={active === order.length - 1}
            className="rounded-full border border-border p-1.5 disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
