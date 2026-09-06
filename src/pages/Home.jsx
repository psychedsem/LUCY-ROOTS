import { Link } from 'react-router-dom';
import homeArtwork from '../assets/images/HOME Artwork.png';
import logoWordmark from '../assets/images/LOGO+Markdown.png';
import PageCard from '../components/common/PageCard';
import styles from './Home.module.css';

const benefits = [
  {
    title: 'Radicati',
    copy: 'Ritaglia uno spazio intenzionale lontano dal rumore e riporta l’attenzione al corpo, al respiro e al momento presente.',
  },
  {
    title: 'Osserva',
    copy: 'Allena la capacità di notare sensazioni, pensieri ed emozioni senza inseguirli e senza doverli respingere.',
  },
  {
    title: 'Esplora',
    copy: 'Usa tempo, suono e attenzione focalizzata come un’interfaccia gentile per esplorare il tuo paesaggio interiore.',
  },
];

function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.heroCard}>
        <h1 className={styles.visuallyHidden}>LUCY//ROOTS</h1>

        <div className={styles.heroGrid}>
          <div className={styles.brandColumn}>
            <img
              className={styles.logoWordmark}
              src={logoWordmark}
              alt="LUCY//ROOTS logo e wordmark"
            />

            <p className={styles.tagline}>Go inward. Grow outward.</p>
          </div>

          <div className={styles.artworkColumn}>
            <img
              className={styles.heroArtwork}
              src={homeArtwork}
              alt="Meditazione in una città solarpunk"
            />
          </div>
        </div>

        <p className={styles.intro}>
          Uno spazio digitale tranquillo per la meditazione a tempo, suoni immersivi e l’esplorazione consapevole.
        </p>

        <div className={styles.actions}>
          <Link className={styles.primaryAction} to="/meditate">
            Inizia sessione
          </Link>
          <Link className={styles.secondaryAction} to="/learn">
            Scopri di più
          </Link>
        </div>
      </section>

      <section className={styles.sectionIntro}>
        <div className={styles.sectionHeading}>
          <h2>Uno spazio semplice per tornare a te stesso</h2>
          <p>
            La meditazione non ha bisogno di un’interfaccia sovraccarica.
            LUCY//ROOTS riunisce tempo, attenzione e paesaggi sonori in uno
            spazio essenziale, pensato per aiutarti a rallentare, ascoltare
            ciò che accade dentro e costruire una pratica personale con
            continuità.
          </p>
        </div>

        <div className={styles.benefitGrid}>
          {benefits.map((benefit, index) => (
            <PageCard
              key={benefit.title}
              className={styles.benefitCard}
            >
              <span className={styles.cardIndex}>0{index + 1}</span>
              <h3>{benefit.title}</h3>
              <p>{benefit.copy}</p>
            </PageCard>
          ))}
        </div>
      </section>

      <section className={styles.compactSection}>
        <PageCard className={styles.soundPreview}>
          <div>
            <h2>Scegli l’atmosfera, non la distrazione.</h2>
            <p>
              Esplora soundscape psichedelici, storytelling solarpunk e un contenuto bonus speciale mentre mediti.
            </p>
          </div>

          <Link className={styles.secondaryAction} to="/meditate">
            Esplora i suoni
          </Link>
        </PageCard>
      </section>

      <section className={styles.compactSection}>
        <div className={styles.finalCta}>
          <div>
            <h2>Pronto a iniziare?</h2>
            <p>Imposta il tempo, scegli il suono e lascia che il resto si faccia più quieto.</p>
          </div>

          <Link
            className={styles.primaryAction}
            to="/meditate"
            onClick={() => window.scrollTo(0, 0)}
          >
            Inizia sessione
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;
