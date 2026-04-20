import { Link } from "react-router";
import { usePuterStore } from "~/lib/puter";
import Button, { buttonVariants } from "~/components/ui/Button";
import { cn } from "~/lib/utils";

const Navbar = () => {
  const { auth } = usePuterStore();

  return (
    <nav className="navbar">
      <Link to="/" className="group flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-300 via-teal-300 to-lime-300 text-slate-900 shadow-md ring-1 ring-white/70">
          RM
        </span>
        <div>
          <p className="text-xl font-extrabold tracking-tight text-gradient">ResuMatch</p>
          <p className="text-xs text-slate-600 transition group-hover:text-slate-800">AI Resume Intelligence</p>
        </div>
      </Link>

      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          to="/upload"
          className={cn(buttonVariants({ variant: "primary", size: "md" }), "whitespace-nowrap")}
        >
          Upload Resume
        </Link>
        {auth.isAuthenticated && (
          <Button type="button" onClick={auth.signOut} variant="secondary" className="whitespace-nowrap">
            Log out
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
