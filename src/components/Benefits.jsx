import React from 'react';
import styles from './Benefits.module.css';

export default function Benefits() {
  const benefits = [
    { title: 'Browse with clarity', description: 'Explore key home details in one place.' },
    { title: 'Compare with confidence', description: 'Consider spaces, sizes and locations.' },
    { title: 'Enquire with ease', description: 'Share your preferences with our team.' },
  ];

  return (
    <section id="benefits" className={styles.section} aria-labelledby="benefits-title">
      <div className={styles.heading}>
        <p className={styles.eyebrow}>A more considered search</p>
        <h2 id="benefits-title">Made for a simpler search</h2>
      </div>
      <div className={styles.grid}>
        {benefits.map((benefit) => (
          <article className={styles.card} key={benefit.title}>
            <span className={styles.mark} aria-hidden="true" />
            <h3>{benefit.title}</h3>
            <p>{benefit.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
