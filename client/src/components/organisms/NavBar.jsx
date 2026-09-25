import { useState } from "react";
import { NavLink } from "react-router-dom";

const ROUTES = [
  { to: "/", label: "Dashboard" },
  { to: "/log", label: "Log load" },
  { to: "/clothing", label: "Clothing" },
  { to: "/history", label: "History" },
];

const linkClass = ({ isActive }) => `nav-link${isActive ? " active" : ""}`;

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      {/* Desktop: sidebar (unchanged) */}
      <nav className="navbar-desktop">
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>TumbleTrack</div>
        {ROUTES.map((r) => (
          <NavLink key={r.to} to={r.to} end={r.to === "/"} className={linkClass}>
            {r.label}
          </NavLink>
        ))}
      </nav>

      {/* Phone: hamburger button, fixed top-left */}
      <button
        className="navbar-toggle"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
      >
        ☰
      </button>

      {/* Phone: dimmed backdrop behind the drawer */}
      <div
        className={`navbar-overlay${open ? " open" : ""}`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Phone: drawer that slides in from the left */}
      <nav className={`navbar-drawer${open ? " open" : ""}`} aria-label="Main navigation">
        <div className="navbar-drawer-head">
          <span style={{ fontSize: 14, fontWeight: 700 }}>TumbleTrack</span>
          <button className="navbar-drawer-close" onClick={close} aria-label="Close menu">✕</button>
        </div>
        {ROUTES.map((r) => (
          <NavLink key={r.to} to={r.to} end={r.to === "/"} className={linkClass} onClick={close}>
            {r.label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
