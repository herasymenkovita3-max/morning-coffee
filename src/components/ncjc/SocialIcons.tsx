import { Instagram, Linkedin } from "lucide-react";

export function SocialIcons({ size = "md" }: { size?: "sm" | "md" }) {
  const box = size === "sm" ? "h-9 w-9" : "h-10 w-10";
  const icon = size === "sm" ? 15 : 17;
  return (
    <div className="flex items-center gap-2">
      <a
        href="#instagram"
        aria-label="Instagram"
        className={`${box} inline-flex items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:bg-coffee hover:text-coffee-foreground`}
      >
        <Instagram size={icon} />
      </a>
      <a
        href="#linkedin"
        aria-label="LinkedIn"
        className={`${box} inline-flex items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:bg-coffee hover:text-coffee-foreground`}
      >
        <Linkedin size={icon} />
      </a>
    </div>
  );
}
