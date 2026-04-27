import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Sidebar, type TabId } from "@/components/Sidebar";
import { HotkeyBar } from "@/components/HotkeyBar";
import { StatusStrip } from "@/components/StatusStrip";
import { MainPage } from "@/components/MainPage";
import { SettingsPage } from "@/components/SettingsPage";
import { InfoPage } from "@/components/InfoPage";
import { ComingSoonPage } from "@/components/ComingSoonPage";
import { DebugTicker } from "@/components/DebugTicker";
import { type AppConfig, loadConfig, saveConfig } from "@/lib/storage";
import { applyTheme } from "@/lib/themes";
import { macro } from "@/lib/macro";
import { matchesShortcut } from "@/lib/keynames";
import { dbg } from "@/lib/debug";
import { Power } from "lucide-react";

export default function App() {
  const [cfg, setCfg] = useState<AppConfig>(() => loadConfig());
  const [tab, setTab] = useState<TabId>("home");
  const [hidden, setHidden] = useState(false);
  const [exited, setExited] = useState(false);
  const cfgRef = useRef(cfg);

  // Persist + apply
  useEffect(() => {
    cfgRef.current = cfg;
    saveConfig(cfg);
    applyTheme(cfg.theme);
    macro.setConfig(cfg);
  }, [cfg]);

  const set = <K extends keyof AppConfig>(key: K, v: AppConfig[K]) => {
    setCfg((c) => ({ ...c, [key]: v }));
  };

  // Global hotkeys (F1 toggle, F2 show/hide, F3 exit)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const c = cfgRef.current;
      if (matchesShortcut(c.toggleKey, e)) {
        e.preventDefault();
        macro.toggle();
        return;
      }
      if (matchesShortcut(c.showHideKey, e)) {
        e.preventDefault();
        setHidden((h) => {
          dbg.info(h ? "Menu shown" : "Menu hidden");
          return !h;
        });
        return;
      }
      if (matchesShortcut(c.exitKey, e)) {
        e.preventDefault();
        handleExit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleExit = () => {
    macro.stop(true);
    setExited(true);
  };

  if (exited) {
    return (
      <div className="app-shell h-screen w-screen flex items-center justify-center text-center">
        <div>
          <div
            className="font-display text-4xl font-bold tracking-widest glow-text"
            style={{ color: "var(--text-base)" }}
          >
            GOODBYE, PIRATE
          </div>
          <div className="mt-3" style={{ color: "var(--text-dim)" }}>
            Sailor Piece electron has been closed. You can reload the page to start again.
          </div>
          <button
            className="btn btn-primary mt-6"
            onClick={() => {
              setExited(false);
              dbg.ok("Session restored");
            }}
          >
            <Power className="w-4 h-4" /> Restart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell h-screen w-screen flex flex-col">
      <AnimatePresence mode="wait">
        {hidden ? (
          <motion.div
            key="hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full flex items-center justify-center text-center"
          >
            <div>
              <div
                className="font-display text-2xl font-bold tracking-widest"
                style={{ color: "var(--text-dim)" }}
              >
                MENU HIDDEN
              </div>
              <div className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
                Press <span className="kbd">{cfg.showHideKey}</span> to show menu again
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="visible"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex flex-col"
          >
            <Header
              onMinimize={() => {
                setHidden(true);
                dbg.info("Menu hidden");
              }}
              onExit={handleExit}
            />

            <div className="px-4 py-2 flex items-center gap-3 flex-wrap border-b border-[var(--border-soft)] bg-[var(--bg-panel)]">
              <HotkeyBar cfg={cfg} />
              <div className="ml-auto">
                <StatusStrip />
              </div>
            </div>

            <div className="flex-1 flex min-h-0">
              <Sidebar active={tab} onChange={setTab} />
              <main className="flex-1 scroll-y p-5 fade-up" key={tab}>
                {tab === "home" && <MainPage cfg={cfg} set={set} />}
                {tab === "settings" && <SettingsPage cfg={cfg} set={set} />}
                {tab === "info" && <InfoPage />}
                {tab === "soon" && <ComingSoonPage />}
              </main>
            </div>

            <DebugTicker enabled={cfg.debugEnabled} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
