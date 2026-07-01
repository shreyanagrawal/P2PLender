import { useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../utils/api";
const baseLinks = [
  { to: "/home", label: "Dashboard" },
];
const roleLinks = {
  borrower: [
    { to: "/home?tab=loan-request", label: "Loan Request" },
    { to: "/home?tab=repayments", label: "Repayments" },
  ],
  lender: [
    { to: "/home?tab=marketplace", label: "Marketplace" },
    { to: "/home?tab=portfolio", label: "Portfolio" },
  ],
};
const activeLinkClass =
  "rounded-md border border-slate-300 bg-white px-3 py-1 text-sm font-semibold text-black shadow-sm transition-colors";
const inactiveLinkClass =
  "rounded-md border border-transparent bg-transparent px-3 py-1 text-sm font-medium text-slate-700 transition-colors hover:text-black";
const Navbar = ({ isAuthenticated, role, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isLinkActive = (to) => {
    const [toPath, toSearch = ""] = to.split("?");
    const currentSearch = location.search.startsWith("?")
      ? location.search.slice(1)
      : location.search;

    return location.pathname === toPath && currentSearch === toSearch;
  };
  const navLinks = useMemo(() => {
    if (!isAuthenticated) {
      return [
        { to: "/", label: "Login" },
      ];
    }
    const roleKey = (role || "").toLowerCase();
    const links = roleLinks[roleKey] || [];
    return [...baseLinks, ...links];
  }, [isAuthenticated, role]);
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      onLogout();
      navigate("/");
    }
  };
  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <button
          type="button"
          onClick={() => {
            setIsMobileOpen(false);
            navigate(isAuthenticated ? "/home" : "/");
          }}
          className="text-lg font-bold tracking-tight text-[#2563EB]"
        >
          P2PLender
        </button>
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((item, index) => (
            <NavLink
              key={`${item.label}-${index}`}
              to={item.to}
              className={isLinkActive(item.to) ? activeLinkClass : inactiveLinkClass}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                {role ? role.charAt(0).toUpperCase() + role.slice(1) : "Pending Role"}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white hover:bg-[#1D4ED8]"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              Sign In
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsMobileOpen((prev) => !prev)}
          className="rounded-lg border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700 md:hidden"
        >
          Menu
        </button>
      </nav>
      {isMobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((item, index) => (
              <NavLink
                key={`${item.label}-${index}`}
                to={item.to}
                onClick={() => setIsMobileOpen(false)}
                className={isLinkActive(item.to) ? activeLinkClass : inactiveLinkClass}
              >
                {item.label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <>
                <p className="text-sm text-slate-500">Role: {role || "pending"}</p>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white hover:bg-[#1D4ED8]"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsMobileOpen(false);
                  if (location.pathname !== "/") {
                    navigate("/");
                  }
                }}
                className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
export default Navbar;