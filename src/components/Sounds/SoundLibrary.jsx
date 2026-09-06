import SoundCard from './SoundCard';
import { SOUND_GROUPS } from './soundCatalog';
import styles from './SoundLibrary.module.css';

function SoundLibrary({
  coordinator,
  onSoundSelect,
  loopBySoundId = {},
  onLoopChange,
}) {
  return (
    <section
      className={styles.library}
      id="sounds"
      aria-labelledby="sounds-title"
    >
      <header className={styles.libraryHeader}>
        <p className={styles.eyebrow}>SOUND LIBRARY</p>

        <h2 id="sounds-title">Scegli il tuo ambiente</h2>

        <p>
          Puoi ascoltare un suono prima di iniziare oppure cambiarlo
          durante la meditazione. Quando metti in pausa il timer,
          LUCY//ROOTS mette in pausa anche il sound attivo.
        </p>
      </header>

      <div className={styles.groups}>
        {SOUND_GROUPS.map((group) => (
          <section className={styles.group} key={group.title}>
            <div className={styles.groupHeader}>
              <h3>{group.title}</h3>
              <p>{group.description}</p>
            </div>

            <div className={styles.soundGrid}>
              {group.sounds.map((sound) => (
                <SoundCard
                  key={sound.url}
                  title={sound.title}
                  url={sound.url}
                  coordinator={coordinator}
                  onSoundSelect={onSoundSelect}
                  loop={Boolean(loopBySoundId[sound.id])}
                  onLoopChange={onLoopChange}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

export default SoundLibrary;
