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
    if (isIos()) {
      setIos(true);
      return;
    }
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const install = async () => {
    if (!deferred) {
      setManual(true);
      return;
    }
    await deferred.prompt().catch(() => undefined);
    setDeferred(null);
  };

  if (!visible) return null;

  return (
    <div className="zebra-stripes mt-4 flex items-center gap-3 rounded-full px-4 py-2.5 text-sm shadow-soft ring-1 ring-foreground/30">
      {ios ? (
        <>
          <Share size={15} className="shrink-0 text-white drop-shadow-[0_1px_2px_oklch(0.16_0.01_260)]" />
          <p className="flex-1 text-xs font-semibold text-white [text-shadow:0_1px_3px_oklch(0.16_0.01_260),0_0_2px_oklch(0.16_0.01_260)] sm:text-sm">
            Tap the <span className="font-bold">Share</span> icon, then{" "}
            <span className="font-bold">Add to Home Screen</span>
          </p>
        </>
      ) : (
        <>
          <Download size={15} className="shrink-0 text-white drop-shadow-[0_1px_2px_oklch(0.16_0.01_260)]" />
          <p className="flex-1 text-xs font-semibold text-white [text-shadow:0_1px_3px_oklch(0.16_0.01_260),0_0_2px_oklch(0.16_0.01_260)] sm:text-sm">
            {manual ? (
              <>Open the browser menu <span className="font-bold">⋮</span>, then <span className="font-bold">Add to Home screen</span></>
            ) : (
              "Install NCJC on your phone"
            )}
          </p>
          {!manual && <button
            type="button"
            onClick={install}
            className="rounded-full bg-white px-3 py-1 text-xs font-bold text-foreground shadow-[0_1px_3px_oklch(0.16_0.01_260/0.6)]"
          >
            Install
          </button>}
        </>
      )}
    </div>
  );
}
