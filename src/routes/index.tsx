import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { SwipeFeed } from "@/components/ncjc/SwipeFeed";
import newspaperImg from "@/assets/newspaper.png";
import { WorldClocks } from "@/components/ncjc/WorldClocks";
import { MusicPlayer } from "@/components/ncjc/MusicPlayer";
import { SocialIcons } from "@/components/ncjc/SocialIcons";
import { Subscribe } from "@/components/ncjc/Subscribe";
import { getLikedPosts, postsQuery, quoteQuery } from "@/lib/ncjc";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "No Clicks. Just Coffee — daily marketing newspaper" },
      {
        name: "description",
        content:
          "NCJC is your daily marketing newspaper: news, trends, campaigns, tools and ideas worth knowing. Marketing trends, minus the noise.",
      },
      { property: "og:title", content: "No Clicks. Just Coffee" },
      { property: "og:description", content: "Marketing trends, minus the noise." },
    ],
  }),
  component: Index,
});

function Index() {
  const posts = useQuery(postsQuery);
  const quote = useQuery(quoteQuery);
  const [liked, setLiked] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => setLiked(getLikedPosts()), []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <header className="pill-nav mt-4 flex items-center gap-3 border border-border/60 px-4 py-4 sm:mt-6 sm:px-8">
          <WorldClocks />
          <div className="flex-1 text-center">
            <h1 className="silver-shimmer text-xl leading-none font-semibold sm:text-3xl">
              <span className="hidden sm:inline">No Clicks. Just Coffee</span>
              <span className="sm:hidden">NCJC</span>
            </h1>
            <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
              Marketing trends, minus the noise.
            </p>
          </div>
          <div className="float-soft">
            <SocialIcons size="sm" />
          </div>
        </header>

        <section className="blob-card mt-6 flex items-center gap-4 border border-border/60 bg-gold p-5 text-gold-foreground sm:mt-8 sm:gap-6 sm:p-7">
          <div className="flex-1">
            <h2 className="text-2xl leading-[1.05] font-bold sm:text-4xl">
              NCJC is your daily marketing newspaper
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-foreground/80">
              The latest news, trends, campaigns and tools worth knowing — only what actually
              matters, for a clearer start to your day.
            </p>
          </div>
          <img
            src={newspaperImg}
            alt="Newspaper and coffee"
            width={816}
            height={816}
            className="h-24 w-24 shrink-0 sm:h-36 sm:w-36"
          />
        </section>

        <section className="mt-8 grid gap-6 sm:mt-12 lg:grid-cols-3">
          <div className="min-w-0 lg:col-span-2">
            {posts.data && posts.data.length > 0 ? (
              <SwipeFeed
                posts={posts.data}
                liked={liked}
                onLiked={(id) => setLiked((prev) => [...prev, id])}
                onToast={setToast}
              />
            ) : (
              <div className="blob-card border border-border/60 bg-card p-8 text-center">
                <h3 className="text-2xl font-semibold">
                  {posts.isLoading ? "Loading today's stories…" : "No stories yet today"}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Fresh picks land every morning. Come back with your coffee.
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-full bg-coffee text-center text-coffee-foreground shadow-soft">
                <span className="font-display text-4xl leading-none font-bold">
                  {posts.data?.length ?? 0}
                </span>
                <span className="mt-1 text-[10px] tracking-[0.2em] uppercase">stories today</span>
              </div>
              <p className="text-sm text-muted-foreground">
                A quick morning read. Only the last 24 hours.
              </p>
            </div>
            <div className="blob-card-alt flex-1 border border-border/60 bg-forest p-6 text-forest-foreground sm:p-8">
              <p className="text-xs tracking-[0.25em] uppercase opacity-70">Quote of the day</p>
              {quote.isLoading ? (
                <p className="mt-4">Brewing…</p>
              ) : quote.data ? (
                <>
                  <blockquote className="mt-4 font-display text-2xl leading-snug italic">
                    “{quote.data.text}”
                  </blockquote>
                  {quote.data.author && (
                    <p className="mt-4 text-sm opacity-80">— {quote.data.author}</p>
                  )}
                </>
              ) : (
                <p className="mt-4 text-lg italic">Today's quote is still brewing.</p>
              )}
            </div>
          </div>
        </section>

        {posts.isError && (
          <p className="mt-6 text-muted-foreground">Stories couldn't load right now.</p>
        )}

        <div className="mt-12 sm:mt-16">
          <Subscribe />
        </div>

        <footer className="mt-12 flex flex-col items-center gap-3 border-t border-border/60 py-10 text-center sm:mt-16">
          <p className="text-sm font-semibold">No Clicks. Just Coffee</p>
          <p className="text-xs text-muted-foreground">Marketing trends, minus the noise.</p>
          <SocialIcons size="sm" />
        </footer>
      </div>

      <MusicPlayer />

      {toast && (
        <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full bg-coffee px-5 py-2.5 text-sm text-coffee-foreground shadow-soft">
          {toast}
        </div>
      )}
    </div>
  );
}
