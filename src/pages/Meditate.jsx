import { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import completionSound from '../assets/audio/Timer-Notification.m4a';
import HistoryPanel from '../components/HistoryPanel';
import SoundLibrary from '../components/Sounds/SoundLibrary';
import SoundQuickSelect from '../components/Sounds/SoundQuickSelect';
import useMeditationTimer from '../hooks/useMeditationTimer';
import { addCompletedTimer } from '../utils/meditationHistory';
import { createSoundPlaybackCoordinator } from '../utils/soundPlaybackCoordinator';
import styles from './Meditate.module.css';

const PRESETS = [5, 10, 15, 20];
const COMPLETION_SOUND_VOLUME = 0.35;
const HISTORY_STORAGE_KEY = 'lucy-roots-meditation-history';

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function loadHistory() {
  try {
    const storedHistory = window.localStorage.getItem(HISTORY_STORAGE_KEY);

    if (!storedHistory) {
      return [];
    }

    const parsedHistory = JSON.parse(storedHistory);

    return Array.isArray(parsedHistory) ? parsedHistory : [];
  } catch {
    return [];
  }
}

function persistHistory(history) {
  try {
    window.localStorage.setItem(
      HISTORY_STORAGE_KEY,
      JSON.stringify(history),
    );
  } catch {
    // The session still completes if storage is unavailable.
  }
}

function Meditate() {
  const [customMinutes, setCustomMinutes] = useState('');
  const [history, setHistory] = useState(loadHistory);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedSoundId, setSelectedSoundId] = useState('');
  const [loopBySoundId, setLoopBySoundId] = useState({});
  const completionAudioRef = useRef(null);
  const [soundCoordinator] = useState(createSoundPlaybackCoordinator);

  const playCompletionSound = useCallback(() => {
    if (!completionAudioRef.current) {
      completionAudioRef.current = new Audio(completionSound);
      completionAudioRef.current.volume = COMPLETION_SOUND_VOLUME;
    }

    completionAudioRef.current.currentTime = 0;

    const playPromise = completionAudioRef.current.play();

    if (playPromise?.catch) {
      playPromise.catch(() => {
        // If the browser blocks audio, the completed state still works.
      });
    }
  }, []);

  const handleTimerComplete = useCallback(
    (completedTimer) => {
      soundCoordinator.stopActive();
      playCompletionSound();

      setHistory((currentHistory) => {
        const nextHistory = addCompletedTimer(
          currentHistory,
          completedTimer,
        );

        persistHistory(nextHistory);
        return nextHistory;
      });
    },
    [playCompletionSound, soundCoordinator],
  );

  const {
    selectedDurationSeconds,
    remainingSeconds,
    status,
    progress,
    start,
    pause,
    resume,
    reset,
    setDurationSeconds,
  } = useMeditationTimer({
    initialDurationSeconds: 5 * 60,
    onComplete: handleTimerComplete,
  });

  const isActive = status === 'running' || status === 'paused';
  const progressAngle = progress * 360;
  const highlightAngle = Math.max(0, progressAngle - 18);

  function choosePreset(minutes) {
    setDurationSeconds(minutes * 60);
    setCustomMinutes('');
  }

  function applyCustomDuration() {
    const minutes = Number(customMinutes);

    if (!Number.isFinite(minutes) || minutes <= 0) {
      return;
    }

    setDurationSeconds(Math.round(minutes * 60));
  }

  function startAgain() {
    reset();
  }

  function startSession() {
    if (selectedSoundId) {
      soundCoordinator.play(selectedSoundId);
    }

    start();
  }

  function changeBackgroundSound(nextSoundId) {
    setSelectedSoundId(nextSoundId);

    if (status !== 'running') {
      return;
    }

    if (!nextSoundId) {
      soundCoordinator.stopActive();
      return;
    }

    soundCoordinator.play(nextSoundId);
  }

  function changeSoundLoop(soundId, nextLoop) {
    if (!soundId) {
      return;
    }

    setLoopBySoundId((currentLoops) => ({
      ...currentLoops,
      [soundId]: nextLoop,
    }));
  }

  function changeSelectedSoundLoop(nextLoop) {
    changeSoundLoop(selectedSoundId, nextLoop);
  }

  function pauseSession() {
    soundCoordinator.pauseForTimer();
    pause();
  }

  function resumeSession() {
    resume();

    if (selectedSoundId) {
      soundCoordinator.play(selectedSoundId);
    }
  }

  function resetSession() {
    soundCoordinator.stopActive();
    reset();
  }

  function renameSession(sessionId, nextName) {
    setHistory((currentHistory) => {
      const nextHistory = currentHistory.map((session) =>
        session.id === sessionId
          ? { ...session, name: nextName }
          : session,
      );

      persistHistory(nextHistory);
      return nextHistory;
    });
  }

  if (status === 'completed') {
    return (
      <main className={styles.page}>
        <div
          className={`${styles.workspace} ${
            isHistoryOpen ? styles.historyOpen : ''
          }`}
        >
          <section className={styles.completedCard}>
            <div className={styles.completedBloom} aria-hidden="true" />

            <p className={styles.completedLabel}>SESSIONE TERMINATA</p>

            <h1 className={styles.completedTime}>
              {formatTime(selectedDurationSeconds)}
            </h1>

            <h2>Sessione completata</h2>

            <p>
              Resta ancora qualche istante dove sei. Nota il respiro, il corpo e
              ciò che è cambiato prima di tornare al resto della giornata.
            </p>

            <div className={styles.completedActions}>
              <button
                className={styles.primaryButton}
                type="button"
                onClick={startAgain}
              >
                Ancora
              </button>

              <Link className={styles.secondaryLink} to="/">
                Torna alla Home
              </Link>

              <button
                className={styles.historyButton}
                type="button"
                onClick={() => setIsHistoryOpen(true)}
                aria-expanded={isHistoryOpen}
              >
                Cronologia
              </button>
            </div>
          </section>

          {isHistoryOpen ? (
            <HistoryPanel
              history={history}
              onClose={() => setIsHistoryOpen(false)}
              onRenameSession={renameSession}
            />
          ) : null}
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div
        className={`${styles.workspace} ${
          isHistoryOpen ? styles.historyOpen : ''
        }`}
      >
        <section
          className={`${styles.timerCard} ${
            isActive ? styles.focusMode : ''
          }`}
        >
          <header className={styles.header}>
            <div>
              <h1>Medita</h1>
              <p>
                Scegli quanto tempo dedicarti, poi lascia che il timer faccia il
                resto.
              </p>
            </div>

            {isActive ? (
              <span className={styles.focusLabel}>Modalità focus</span>
            ) : null}
          </header>

          <div className={styles.timerStage}>
            <div
              className={styles.progressRing}
              style={{
                '--progress-angle': `${progressAngle}deg`,
                '--highlight-angle': `${highlightAngle}deg`,
              }}
              aria-label={`Progresso ${Math.round(progress * 100)}%`}
            >
              <div className={styles.timerCore}>
                <span className={styles.timerDigits}>
                  {formatTime(remainingSeconds)}
                </span>

                <span className={styles.timerStatus}>
                  {status === 'paused' ? 'In pausa' : 'Tempo rimanente'}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.controlsArea}>
            {!isActive ? (
              <div className={styles.setupPanel}>
                <div className={styles.presetGroup}>
                  <h2>Scegli la durata</h2>

                  <div className={styles.presetButtons}>
                    {PRESETS.map((minutes) => {
                      const isSelected =
                        selectedDurationSeconds === minutes * 60;

                      return (
                        <button
                          key={minutes}
                          className={`${styles.presetButton} ${
                            isSelected ? styles.selectedPreset : ''
                          }`}
                          type="button"
                          onClick={() => choosePreset(minutes)}
                        >
                          {minutes} minuti
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className={styles.customGroup}>
                  <label htmlFor="custom-duration">
                    Durata personalizzata
                  </label>

                  <div className={styles.customControls}>
                    <div className={styles.inputWrap}>
                      <input
                        id="custom-duration"
                        type="number"
                        min="1"
                        max="180"
                        step="1"
                        inputMode="numeric"
                        value={customMinutes}
                        onChange={(event) =>
                          setCustomMinutes(event.target.value)
                        }
                      />
                      <span>min</span>
                    </div>

                    <button
                      className={styles.secondaryButton}
                      type="button"
                      onClick={applyCustomDuration}
                    >
                      Usa durata
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.focusCopy}>
                <h2>
                  {status === 'paused'
                    ? 'La sessione è in pausa.'
                    : 'Resta con il respiro.'}
                </h2>

                <p>
                  {status === 'paused'
                    ? 'Riprendi quando vuoi: il tempo rimasto è stato preservato.'
                    : 'Non devi fare altro. Lascia passare pensieri e sensazioni, poi torna gentilmente al momento presente.'}
                </p>
              </div>
            )}

            <SoundQuickSelect
              value={selectedSoundId}
              onChange={changeBackgroundSound}
              loop={
                selectedSoundId
                  ? Boolean(loopBySoundId[selectedSoundId])
                  : false
              }
              onLoopChange={changeSelectedSoundLoop}
            />

            <div className={styles.actionRow}>
              {status === 'idle' ? (
                <button
                  className={styles.primaryButton}
                  type="button"
                  onClick={startSession}
                >
                  Inizia
                </button>
              ) : null}

              {status === 'running' ? (
                <button
                  className={styles.primaryButton}
                  type="button"
                  onClick={pauseSession}
                >
                  Pausa
                </button>
              ) : null}

              {status === 'paused' ? (
                <button
                  className={styles.primaryButton}
                  type="button"
                  onClick={resumeSession}
                >
                  Riprendi
                </button>
              ) : null}

              {isActive ? (
                <button
                  className={styles.resetButton}
                  type="button"
                  onClick={resetSession}
                >
                  Reset
                </button>
              ) : null}

              <button
                className={styles.historyButton}
                type="button"
                onClick={() => setIsHistoryOpen((current) => !current)}
                aria-expanded={isHistoryOpen}
              >
                Cronologia
              </button>
            </div>
          </div>
        </section>

        {isHistoryOpen ? (
          <HistoryPanel
            history={history}
            onClose={() => setIsHistoryOpen(false)}
            onRenameSession={renameSession}
          />
        ) : null}
      </div>

      <SoundLibrary
        coordinator={soundCoordinator}
        onSoundSelect={setSelectedSoundId}
        loopBySoundId={loopBySoundId}
        onLoopChange={changeSoundLoop}
      />
    </main>
  );
}

export default Meditate;
