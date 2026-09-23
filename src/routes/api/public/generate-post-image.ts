import { createFileRoute } from "@tanstack/react-router";
import { generateImage, imageSettings } from "@/lib/image-gateway.server";

function decodeBase64(b64: string) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export const Route = createFileRoute("/api/public/generate-post-image")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => null)) as { postId?: string } | null;
        const postId = body?.postId;
        if (!postId || !/^[0-9a-f-]{36}$/i.test(postId)) {
          return Response.json({ error: "Invalid post id" }, { status: 400 });
        }

        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return Response.json({ error: "AI is not configured" }, { status: 500 });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: post, error: postError } = await supabaseAdmin
          .from("posts")
          .select("id, title, summary, image_url")
          .eq("id", postId)
          .maybeSingle();
        if (postError || !post) return Response.json({ error: "Post not found" }, { status: 404 });
        if (post.image_url) return Response.json({ url: post.image_url });

        const prompt = `Editorial abstract illustration for a marketing news story titled "${post.title}". Warm cream background, bold organic shapes, flat modern poster style, accents of bright yellow, deep blue and mint green, no text, no letters, no logos, calm premium magazine aesthetic.`;

        const upstream = await generateImage({ ...imageSettings, apiKey }, prompt, false);
        if (!upstream.ok) {
          const text = await upstream.text();
          console.error(`Image gateway failed [${upstream.status}]: ${text}`);
          return Response.json({ error: text }, { status: upstream.status });
        }
        const json = (await upstream.json()) as { data?: Array<{ b64_json?: string }> };
        const b64 = json.data?.[0]?.b64_json;
        if (!b64) return Response.json({ error: "No image returned" }, { status: 502 });

        const { error: uploadError } = await supabaseAdmin.storage
          .from("post-images")
          .upload(`${postId}.png`, decodeBase64(b64), {
            contentType: "image/png",
            upsert: true,
          });
        if (uploadError) {
          console.error("Image upload failed", uploadError);
          return Response.json({ error: uploadError.message }, { status: 500 });
        }

        const url = `/api/public/post-image/${postId}`;
        await supabaseAdmin.from("posts").update({ image_url: url }).eq("id", postId);
        return Response.json({ url });
      },
    },
  },
});
