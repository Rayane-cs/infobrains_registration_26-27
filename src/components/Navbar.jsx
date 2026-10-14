import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import logo from '../assets/logo.webp';
import { Link, useRouter } from '../router.jsx';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isHome, category, navigate } = useRouter();

  const closeMenu = () => setMenuOpen(false);

  function handleHomeNav(event, hash = '') {
    event.preventDefault();
    closeMenu();
    if (!isHome) {
      navigate(`/${hash}`);
    } else if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  return (
    <header className="navbar no-print">
      <Link to="/" className="brand" aria-label="InfoBrains Open Day home" onClick={closeMenu}>
        <img src={logo} alt="" className="brand__mark" />
        <span className="brand__text">InfoBrains</span>
        {category ? (
          <span className="brand__badge" style={{ '--badge-color': category.color }}>
            {category.shortName}
          </span>
        ) : null}
      </Link>

      <button
        className="nav-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="site-navigation"
        aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
      </button>

      <nav id="site-navigation" className={menuOpen ? 'nav nav--open' : 'nav'} aria-label="Primary">
        <a href="#home" onClick={(e) => handleHomeNav(e, '#home')}>
          Home
        </a>
        <a href="#attendance" onClick={(e) => handleHomeNav(e, '#attendance')}>
          Attendance
        </a>
        <a
          className="button button--small button--primary"
          href="#attendance"
          onClick={(e) => handleHomeNav(e, '#attendance')}
        >
          Join the Open Day
        </a>
      </nav>
    </header>
  );
}
