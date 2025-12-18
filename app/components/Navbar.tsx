import { Link } from "react-router";
import { usePuterStore } from "~/lib/puter";

const Navbar = () => {
  const { auth } = usePuterStore();

  return (
    <nav className="navbar">
      <Link to="/">
        <p className="text-2xl font-bold text-gradient">ResuMatch</p>
      </Link>

      

      <div className="flex items-center gap-3">
        <Link to="/upload">
          <p className="primary-button w-fit">Upload Your Resume</p>
        </Link>
        {auth.isAuthenticated && (
          <button type="button" onClick={auth.signOut} className="back-button w-fit whitespace-nowrap">
            Log out
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
