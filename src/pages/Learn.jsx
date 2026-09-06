import { Link } from 'react-router-dom';
import learnArtwork from '../assets/images/LEARN Artwork.png';
import PageCard from '../components/common/PageCard';
import styles from './Learn.module.css';

const foundations = [
  {
    title: 'Che cos’è la meditazione',
    copy: 'Meditare significa allenare l’attenzione. Non vuol dire svuotare la mente, ma imparare a riconoscere ciò che accade: respiro, sensazioni, pensieri ed emozioni, con maggiore presenza e meno automatismi.',
  },
  {
    title: 'Un modo semplice per iniziare',
    copy: 'Siediti in una posizione comoda, scegli pochi minuti e usa il respiro come punto di riferimento. Quando l’attenzione si allontana, accorgitene e riportala con calma al respiro, senza giudicarti.',
  },
  {
    title: 'Perché praticare',
    copy: 'Una pratica regolare può diventare uno spazio per rallentare, osservare con più chiarezza e costruire un rapporto più intenzionale con il proprio tempo e con ciò che si prova.',
  },
];

const holotropicSteps = [
  {
    number: '01',
    title: 'Costruire una base',
    copy: 'Prima di esplorare pratiche respiratorie più intense, è utile avere familiarità con meditazione, consapevolezza corporea e tecniche di respirazione dolce.',
  },
  {
    number: '02',
    title: 'Comprendere il contesto',
    copy: 'La respirazione olotropica nasce come pratica esperienziale strutturata. Non è semplicemente “respirare più forte”: contano setting, preparazione, supporto e il modo in cui l’esperienza viene elaborata.',
  },
  {
    number: '03',
    title: 'Facilitazione qualificata',
    copy: 'Le esperienze più intense dovrebbero avvenire in un contesto adeguato e con facilitazione qualificata, capace di gestire sicurezza, setting e bisogni individuali.',
  },
  {
    number: '04',
    title: 'Integrazione',
    copy: 'L’integrazione è parte dell’esperienza: significa dare tempo a ciò che è emerso, riflettere, scrivere, confrontarsi e trasformare l’esperienza in qualcosa di comprensibile e utile nella vita quotidiana.',
  },
];

function Learn() {
  return (
    <main className={styles.page}>
      <section className={styles.heroCard}>
        <div className={styles.heroCopy}>
          <h1>Imparare a meditare</h1>
          <p>
            La meditazione è una pratica semplice da iniziare e profonda da esplorare.
            Qui trovi una base chiara per orientarti, senza trasformarla in qualcosa di
            complicato.
          </p>

          <Link
            className={`${styles.primaryAction} ${styles.greenAction}`}
            to="/meditate"
          >
            Prova una sessione
          </Link>
        </div>

        <div className={styles.artworkWrap}>
          <img
            src={learnArtwork}
            alt="Imparare la meditazione in un ambiente solarpunk"
            className={styles.artwork}
          />
        </div>
      </section>

      <section className={styles.foundationSection}>
        {foundations.map((item) => (
          <PageCard key={item.title} className={styles.foundationCard}>
            <h2>{item.title}</h2>
            <p>{item.copy}</p>
          </PageCard>
        ))}
      </section>

      <section className={styles.holotropicSection}>
        <div className={styles.holotropicIntro}>
          <h2>Percorso verso la respirazione olotropica</h2>
          <p>
            Questa sezione serve a conoscere la pratica e il contesto che la circonda.
            <strong> Non è un protocollo</strong> da seguire da soli e non sostituisce
            una valutazione individuale o la guida di professionisti qualificati.
          </p>
        </div>

        <div className={styles.stepGrid}>
          {holotropicSteps.map((step) => (
            <PageCard key={step.number} className={styles.stepCard}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </PageCard>
          ))}
        </div>
      </section>

      <section className={styles.finalCta}>
        <div>
          <h2>La pratica si impara praticando.</h2>
          <p>
            Parti da pochi minuti, mantieni la curiosità e lascia che sia la continuità
            a fare il resto.
          </p>
        </div>

        <Link
          className={styles.primaryAction}
          to="/meditate"
          onClick={() => window.scrollTo(0, 0)}
        >
          Inizia a meditare
        </Link>
      </section>
    </main>
  );
}

export default Learn;
