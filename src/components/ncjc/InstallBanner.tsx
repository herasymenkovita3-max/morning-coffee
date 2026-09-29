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
    <div className="mt-4 flex items-center gap-3 rounded-full border border-border/60 bg-card px-4 py-2.5 text-sm shadow-soft">
      {ios ? (
        <>
          <Share size={15} className="shrink-0 text-coffee" />
          <p className="flex-1 text-xs sm:text-sm">
            Tap the <span className="font-semibold">Share</span> icon, then{" "}
            <span className="font-semibold">Add to Home Screen</span>
          </p>
        </>
      ) : (
        <>
          <Download size={15} className="shrink-0 text-coffee" />
          <p className="flex-1 text-xs sm:text-sm">
            {manual ? (
              <>Open the browser menu <span className="font-semibold">⋮</span>, then <span className="font-semibold">Add to Home screen</span></>
            ) : (
              "Install NCJC on your phone"
            )}
          </p>
          {!manual && <button
            type="button"
            onClick={install}
            className="rounded-full bg-coffee px-3 py-1 text-xs font-semibold text-coffee-foreground"
          >
            Install
          </button>}
        </>
      )}
    </div>
  );
}
