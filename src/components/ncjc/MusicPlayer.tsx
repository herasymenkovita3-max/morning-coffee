import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2 } from "lucide-react";

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = false;
    }
  }, [volume]);

  const toggle = async () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.muted = false;
      el.volume = volume;
      try {
        await el.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-full border border-border bg-card/95 px-3 py-2 shadow-soft backdrop-blur">
      <audio ref={audioRef} src="/audio/lounge.mp3" loop muted preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause background music" : "Play background music"}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-coffee text-coffee-foreground transition-transform hover:scale-105"
      >
        {playing ? <Pause size={15} /> : <Play size={15} />}
      </button>
      <Volume2 size={14} className="text-muted-foreground" />
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        aria-label="Volume"
        onChange={(e) => setVolume(Number(e.target.value))}
        className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-border accent-coffee"
      />
    </div>
  );
}
