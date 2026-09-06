import { SOUND_OPTIONS } from './soundCatalog';
import styles from './SoundQuickSelect.module.css';

function SoundQuickSelect({
  value,
  onChange,
  loop = false,
  onLoopChange,
}) {
  return (
    <div className={styles.controls}>
      <div className={styles.soundField}>
        <label htmlFor="background-sound">
          Background sound
        </label>

        <div className={styles.selectWrap}>
          <select
            id="background-sound"
            value={value}
            onChange={(event) => onChange(event.target.value)}
          >
            <option value="">Nessuno</option>

            {SOUND_OPTIONS.map((sound) => (
              <option key={sound.id} value={sound.id}>
                {sound.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.loopField}>
        <span className={styles.loopLabel}>Loop</span>

        <label className={styles.loopToggle}>
          <input
            type="checkbox"
            checked={loop}
            disabled={!value}
            onChange={(event) =>
              onLoopChange?.(event.target.checked)
            }
            aria-label="Loop"
          />

          <span
            className={styles.loopTrack}
            aria-hidden="true"
          >
            <span className={styles.loopThumb} />
          </span>
        </label>
      </div>
    </div>
  );
}

export default SoundQuickSelect;
