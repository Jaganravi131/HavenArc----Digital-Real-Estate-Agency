import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <a className={styles.brand} href="#top">HavenArc Realty</a>
          <p>A thoughtful place to begin.</p>
        </div>
        <nav aria-label="Footer navigation">
          <a href="/privacy.html">Privacy</a>
          <a href="/terms.html">Terms</a>
          <a href="#enquire">Contact</a>
        </nav>
      </div>
    </footer>
  );
}
