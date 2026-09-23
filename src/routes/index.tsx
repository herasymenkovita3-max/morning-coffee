import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArticleCard } from "@/components/ncjc/ArticleCard";
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
          <div className="hidden h-10 w-10 shrink-0 rounded-full bg-gold sm:block" aria-hidden />
          <div className="flex-1 text-center">
            <h1 className="text-xl leading-none font-semibold sm:text-3xl">
              <span className="hidden sm:inline">No Clicks. Just Coffee</span>
              <span className="sm:hidden">NCJC</span>
            </h1>
            <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
              Marketing trends, minus the noise.
            </p>
          </div>
          <SocialIcons size="sm" />
        </header>

        <section className="blob-card mt-8 border border-border/60 bg-gold p-8 text-gold-foreground sm:mt-12 sm:p-12">
          <p className="text-lg leading-relaxed text-foreground/85 sm:text-2xl">
            NCJC is your daily marketing newspaper, bringing together the latest news, trends,
            campaigns, tools, and ideas worth knowing. We cut through the endless stream of updates
            and give you what actually matters, so you can stay current, spot what's changing, and
            start your day with a clearer view of marketing.
          </p>
        </section>

        <section className="my-12 text-center sm:my-16">
          <div className="mx-auto h-px w-24 bg-border" />
          <p className="mt-6 text-xs tracking-[0.25em] text-muted-foreground uppercase">
            Quote of the day
          </p>
          {quote.isLoading ? (
            <p className="mt-4 text-muted-foreground">Brewing…</p>
          ) : quote.data ? (
            <>
              <blockquote className="mx-auto mt-4 max-w-2xl font-display text-2xl leading-snug italic sm:text-4xl">
                “{quote.data.text}”
              </blockquote>
              {quote.data.author && (
                <p className="mt-4 text-sm text-muted-foreground">— {quote.data.author}</p>
              )}
            </>
          ) : (
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground italic">
              Today's quote is still brewing.
            </p>
          )}
          <div className="mx-auto mt-6 h-px w-24 bg-border" />
        </section>

        <main className="grid gap-6 sm:gap-8">
          {posts.isLoading && <p className="text-muted-foreground">Loading today's stories…</p>}
          {posts.isError && (
            <p className="text-muted-foreground">Stories couldn't load right now.</p>
          )}
          {posts.data?.length === 0 && (
            <div className="blob-card border border-border/60 bg-card p-8 text-center">
              <h3 className="text-2xl font-semibold">No stories yet today</h3>
              <p className="mt-2 text-muted-foreground">
                Fresh picks land every morning. Come back with your coffee.
              </p>
            </div>
          )}
          {posts.data?.map((post, i) => (
            <ArticleCard
              key={post.id}
              post={post}
              index={i}
              liked={liked.includes(post.id)}
              onLiked={(id) => setLiked((prev) => [...prev, id])}
              onToast={setToast}
            />
          ))}
        </main>

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
