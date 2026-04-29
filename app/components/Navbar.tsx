import { Link, useLocation } from "react-router";
import { ChevronDown, ExternalLink, LogOut, Plus, UserCircle2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import { buttonVariants } from "~/components/ui/Button";
import { cn } from "~/lib/utils";

const Navbar = () => {
  const { auth } = usePuterStore();
  const location = useLocation();
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
    const onPointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  const primaryCta =
    location.pathname === "/upload"
      ? { to: "/upload", label: "Analyze Resume" }
      : { to: "/upload", label: "Start Analysis" };

  const user = auth.user;
  const initials = useMemo(() => {
    const source = user?.username?.trim() || "Guest";
    return source.slice(0, 2).toUpperCase();
  }, [user?.username]);

  return (
    <nav className={cn("navbar", "navbar-premium", isScrolled && "navbar-scrolled")}>
      <Link to="/" className="group flex min-w-0 items-center gap-2 sm:gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[16px] shadow-[0_18px_34px_-18px_rgba(13,148,136,0.65)] ring-1 ring-white/70 transition duration-200 group-hover:-translate-y-0.5 sm:h-11 sm:w-11 sm:rounded-[18px]">
          <img src="/icons/resumatch-mark.svg" alt="" className="h-full w-full" aria-hidden="true" />
        </span>
        <div className="min-w-0 text-left">
          <p className="truncate text-base font-extrabold tracking-[-0.04em] text-gradient sm:text-xl">ResuMatch</p>
        </div>
      </Link>

      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          to={primaryCta.to}
          className={cn(buttonVariants({ variant: "primary", size: "md" }), "hidden whitespace-nowrap sm:inline-flex")}
        >
          <Plus className="h-4 w-4" />
          {primaryCta.label}
        </Link>

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
                {auth.isAuthenticated ? user?.username : "Guest"}
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
                    {auth.isAuthenticated ? user?.username : "Guest session"}
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
                <Link to="/upload" role="menuitem" className="account-menu-item sm:hidden" onClick={() => setMenuOpen(false)}>
                  <Plus className="h-4 w-4" />
                  Start analysis
                </Link>
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

export default Navbar;
