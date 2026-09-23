import { PostImage } from "@/components/ncjc/PostImage";
import { timeAgo, type Post } from "@/lib/ncjc";

export function HeroStory({ post }: { post: Post }) {
  return (
    <article className="blob-card group relative overflow-hidden border border-border/60 bg-card">
      <PostImage post={post} className="h-56 w-full sm:h-80" />
      <div className="p-6 sm:p-8">
        <p className="text-xs tracking-[0.25em] text-muted-foreground uppercase">Today's lead</p>
        <h2 className="mt-3 text-3xl leading-[1.05] font-semibold sm:text-5xl">{post.title}</h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground/80">
          {post.summary}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <a
            href={post.source_url}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 hover:text-coffee"
          >
            As reported by {post.source_name}
          </a>
          <span aria-hidden>•</span>
          <span>{timeAgo(post.created_at)}</span>
        </div>
      </div>
    </article>
  );
}
