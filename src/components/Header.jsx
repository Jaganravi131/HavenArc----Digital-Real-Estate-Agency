import React, { useEffect, useRef, useState } from 'react';
import styles from './Header.module.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a className={styles.brand} href="#top" aria-label="HavenArc Realty home">
          <img src="/images/havenarc_logo.svg" alt="HavenArc Realty" />
        </a>
        <button
          ref={menuButtonRef}
          className={styles.menuButton}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMenuOpen((isOpen) => !isOpen)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav
          id="primary-navigation"
          className={`${styles.navigation} ${menuOpen ? styles.navigationOpen : ''}`}
          aria-label="Primary navigation"
        >
          <a href="#properties" onClick={() => setMenuOpen(false)}>Explore homes</a>
          <a href="#benefits" onClick={() => setMenuOpen(false)}>Why HavenArc</a>
          <a href="#process" onClick={() => setMenuOpen(false)}>How it works</a>
          <a className={styles.navCta} href="#enquire" onClick={() => setMenuOpen(false)}>Enquire now</a>
        </nav>
      </div>
    </header>
  );
}
