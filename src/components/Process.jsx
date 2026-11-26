import React from 'react';
import styles from './Process.module.css';

const steps = [
  'Explore featured homes',
  'Choose a city and preferred layout',
  'Send an enquiry for a follow-up conversation',
];

export default function Process() {
  return (
    <section id="process" className={styles.section} aria-labelledby="process-title">
      <div className={styles.heading}>
        <p className={styles.eyebrow}>A simple way forward</p>
        <h2 id="process-title">How it works</h2>
      </div>
      <ol className={styles.steps}>
        {steps.map((step, index) => (
          <li className={styles.step} key={step}>
            <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <p>{step}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
