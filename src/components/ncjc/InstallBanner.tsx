import { useEffect, useState } from "react";
import { Download, Share } from "lucide-react";

type BIPEvent = Event & { prompt: () => Promise<void> };

function isIos() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function InstallBanner() {
  const [visible, setVisible] = useState(false);
  const [ios, setIos] = useState(false);
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [manual, setManual] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    setVisible(true);
    setIos(isIos());
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const install = async () => {
    if (deferred) {
      await deferred.prompt().catch(() => undefined);
      setDeferred(null);
      return;
    }
    // No native prompt available (iOS or unsupported browser) — show instructions.
    setManual(true);
  };

  if (!visible) return null;

  const Icon = ios ? Share : Download;
  const iconCls = "shrink-0 text-white drop-shadow-[0_1px_2px_oklch(0.16_0.01_260)]";
  const textCls =
    "flex-1 text-xs font-semibold text-white [text-shadow:0_1px_3px_oklch(0.16_0.01_260),0_0_2px_oklch(0.16_0.01_260)] sm:text-sm";

  return (
    <div className="zebra-stripes mt-4 flex items-center gap-3 rounded-full px-4 py-2.5 text-sm shadow-soft ring-1 ring-foreground/30">
      <Icon size={15} className={iconCls} />
      <p className={textCls}>
        {manual ? (
          ios ? (
            <>
              Tap the <span className="font-bold">Share</span> icon, then{" "}
              <span className="font-bold">Add to Home Screen</span>
            </>
          ) : (
            <>
              Open the browser menu <span className="font-bold">⋮</span>, then{" "}
              <span className="font-bold">Add to Home screen</span>
            </>
          )
        ) : (
          "Install NCJC on your phone"
        )}
      </p>
      {!manual && (
        <button
          type="button"
          onClick={install}
          className="shrink-0 cursor-pointer rounded-full bg-white px-3 py-1 text-xs font-bold text-foreground shadow-[0_1px_3px_oklch(0.16_0.01_260/0.6)] active:scale-95"
        >
          Install
        </button>
      )}
    </div>
  );
}
