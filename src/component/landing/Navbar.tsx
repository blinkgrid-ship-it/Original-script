import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-ink/90 backdrop-blur border-b border-gold/10">
      <Link to="/" className="text-gold font-serif text-xl font-bold tracking-wide">
        Original Script
      </Link>
      <div className="flex gap-4 text-sm text-parchment/60">
        <a href="#what" className="hover:text-gold transition-colors">About</a>
        <Link to="/chronicle" className="hover:text-gold transition-colors text-gold/80">Chronicle</Link>
        <Link to="/community" className="hover:text-gold transition-colors text-gold/80">Community</Link>
        <Link to="/admin" className="hover:text-gold transition-colors text-parchment/40">Admin</Link>
      </div>
      {user ? (
        <div className="flex items-center gap-3">
          <span className="text-parchment/30 text-xs hidden sm:block">{user.email}</span>
          <button
            onClick={signOut}
            className="px-4 py-2 text-sm border border-parchment/20 text-parchment/50 rounded hover:border-gold hover:text-gold transition-all"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <button
          onClick={() => navigate("/auth")}
          className="px-4 py-2 text-sm border border-gold text-gold rounded hover:bg-gold hover:text-ink transition-all"
        >
          Sign In
        </button>
      )}
    </nav>
  );
}