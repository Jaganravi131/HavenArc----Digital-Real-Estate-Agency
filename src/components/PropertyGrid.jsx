import React from 'react';
import styles from './PropertyGrid.module.css';
import properties from '../data/properties';

export default function PropertyGrid() {
  return (
    <section id="properties" className={styles.section} aria-labelledby="properties-title">
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.eyebrow}>Explore the collection</p>
          <h2 id="properties-title">Featured spaces</h2>
        </div>
        <p>Realistic inspiration, considered details, and a straightforward way to enquire.</p>
      </div>
      <div className={styles.grid}>
        {properties.map((property) => (
          <article className={styles.card} key={property.id}>
            <div className={styles.imageWrap}>
              <img
                src={`/images/${property.image}`}
                alt={`Illustration of a building exterior for ${property.name}`}
                width="600"
                height="360"
                loading="lazy"
                decoding="async"
              />
              <span className={styles.badge}>{property.badge}</span>
            </div>
            <div className={styles.details}>
              <div className={styles.titleRow}>
                <h3>{property.name}</h3>
                <p className={styles.price}>{property.price}</p>
              </div>
              <p className={styles.location}>
                {property.city}
                {' '}
                <span aria-hidden="true">·</span>
                {' '}
                {property.id}
              </p>
              <dl className={styles.facts}>
                <div>
                  <dt>Layout</dt>
                  <dd>{property.layout}</dd>
                </div>
                <div>
                  <dt>Area</dt>
                  <dd>{property.area}</dd>
                </div>
              </dl>
            </div>
          </article>
        ))}
      </div>
      <p className={styles.disclaimer}>
        Display values are for inspiration, not transactional offers.
      </p>
    </section>
  );
}
