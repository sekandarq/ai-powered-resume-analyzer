import { ArrowLeft, ChevronDown, ExternalLink, LogOut, UserCircle2 } from "lucide-react";
import { cn } from "~/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePuterStore } from "~/lib/puter";

const ResumePageNavbar = () => {
  const { auth } = usePuterStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!menuOpen) return;
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [menuOpen]);

  const initials = useMemo(() => {
    const source = auth.user?.username?.trim() || "Guest";
    return source.slice(0, 2).toUpperCase();
  }, [auth.user?.username]);

  return (
    <nav className={cn("navbar", "navbar-premium", isScrolled && "navbar-scrolled")}>
      <div className="flex items-center gap-3">
        <a
          href="/"
          className="back-button"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to workspace</span>
        </a>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="account-trigger"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            <span className="account-avatar">{auth.isAuthenticated ? initials : <UserCircle2 className="h-4 w-4" />}</span>
            <span className="hidden min-w-0 text-left sm:block">
              <span className="block truncate text-sm font-semibold text-slate-900">
                {auth.isAuthenticated ? auth.user?.username : "Guest"}
              </span>
              <span className="block text-[11px] uppercase tracking-[0.14em] text-slate-500">
                {auth.isAuthenticated ? "Account" : "Session"}
              </span>
            </span>
            <ChevronDown className={cn("h-4 w-4 text-slate-500 transition", menuOpen && "rotate-180")} />
          </button>

          {menuOpen && (
            <div className="account-menu" role="menu">
              <div className="account-menu-head">
                <span className="account-avatar h-10 w-10 shrink-0">{auth.isAuthenticated ? initials : <UserCircle2 className="h-5 w-5" />}</span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-950">
                    {auth.isAuthenticated ? auth.user?.username : "Guest session"}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {auth.isAuthenticated ? "Signed in to your workspace" : "Sign in to save and manage analyses"}
                  </p>
                </div>
              </div>

              <div className="account-menu-divider" />

              <div className="account-menu-meta">
                <div className="account-meta-row">
                  <span className="account-meta-label">Status</span>
                  <span className="account-status">
                    <span className="account-status-dot" />
                    {auth.isAuthenticated ? "Connected" : "Guest"}
                  </span>
                </div>
                {auth.isAuthenticated && (
                  <a
                    href="https://puter.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    role="menuitem"
                    className="account-dashboard-link"
                  >
                    <span>Check Usage & Balance</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>

              <div className="account-menu-divider" />

              <div className="account-menu-body">
                {auth.isAuthenticated ? (
                  <button type="button" role="menuitem" className="account-menu-item" onClick={auth.signOut}>
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                ) : (
                  <button type="button" role="menuitem" className="account-menu-item" onClick={auth.signIn}>
                    <UserCircle2 className="h-4 w-4" />
                    Sign in
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default ResumePageNavbar;
