import React from 'react';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero} id="top" aria-labelledby="hero-title">
      <div className={styles.copy}>
        <p className={styles.kicker}>A thoughtful place to begin</p>
        <h1 id="hero-title">A clearer path to your next home.</h1>
        <p className={styles.description}>
          Explore thoughtfully presented properties and connect with our team in minutes.
        </p>
        <div className={styles.actions}>
          <a className={styles.primaryAction} href="#properties">Browse properties</a>
          <a className={styles.secondaryAction} href="#process">See how it works</a>
        </div>
      </div>
      <div className={styles.visual}>
        <img
          src="/images/property_01.webp"
          alt="Illustration of a modern home with wide windows and a landscaped courtyard"
          width="640"
          height="400"
        />
        <span className={styles.visualCaption}>Spaces to make your own</span>
      </div>
    </section>
  );
}
