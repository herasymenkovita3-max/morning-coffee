import { useEffect, useState } from "react";

const zones = [
  { label: "London", tz: "Europe/London" },
  { label: "Kyiv", tz: "Europe/Kyiv" },
];

export function WorldClocks() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000 * 15);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex shrink-0 flex-col gap-0.5 text-[10px] leading-tight sm:text-xs">
      {zones.map((z) => (
        <div key={z.tz} className="flex items-baseline gap-1.5">
          <span className="w-10 text-muted-foreground sm:w-12">{z.label}</span>
          <span className="font-semibold tabular-nums">
            {now
              ? now.toLocaleTimeString("en-GB", {
                  timeZone: z.tz,
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "--:--"}
          </span>
        </div>
      ))}
    </div>
  );
}
