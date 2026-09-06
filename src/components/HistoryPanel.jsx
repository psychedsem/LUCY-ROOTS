import { useState } from 'react';
import { formatTimerStart } from '../utils/meditationHistory';
import styles from './HistoryPanel.module.css';

function formatSessionDate(timestamp) {
  return new Intl.DateTimeFormat('it-IT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(timestamp));
}

function HistoryPanel({
  history,
  onClose,
  onRenameSession,
}) {
  const [collapsedSessionIds, setCollapsedSessionIds] = useState(() => new Set());
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [draftName, setDraftName] = useState('');

  const hasFollowingDayTimer = history.some((session) =>
    session.timers.some((timer) =>
      formatTimerStart(timer.startedAt, session.startedAt).endsWith('*'),
    ),
  );

  function toggleSession(sessionId) {
    setCollapsedSessionIds((current) => {
      const next = new Set(current);

      if (next.has(sessionId)) {
        next.delete(sessionId);
      } else {
        next.add(sessionId);
      }

      return next;
    });
  }

  function beginRename(session) {
    setEditingSessionId(session.id);
    setDraftName(session.name);
  }

  function cancelRename() {
    setEditingSessionId(null);
    setDraftName('');
  }

  function saveRename(sessionId) {
    const nextName = draftName.trim();

    if (!nextName) {
      return;
    }

    onRenameSession(sessionId, nextName);
    cancelRename();
  }

  return (
    <aside
      className={styles.panel}
      aria-label="Cronologia meditazioni"
    >
      <header className={styles.panelHeader}>
        <div>
          <p className={styles.eyebrow}>LE TUE SESSIONI</p>
          <h2>Cronologia</h2>
        </div>

        <button
          className={styles.closeButton}
          type="button"
          onClick={onClose}
          aria-label="Chiudi cronologia"
        >
          ×
        </button>
      </header>

      {history.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Nessuna sessione completata ancora.</p>
          <span>
            Quando un timer arriva a zero comparirà qui automaticamente.
          </span>
        </div>
      ) : (
        <div className={styles.sessionList}>
          {history.map((session) => {
            const isCollapsed = collapsedSessionIds.has(session.id);
            const isEditing = editingSessionId === session.id;

            return (
              <section className={styles.sessionCard} key={session.id}>
                <div className={styles.sessionHeader}>
                  <button
                    className={styles.sessionToggle}
                    type="button"
                    onClick={() => toggleSession(session.id)}
                    aria-expanded={!isCollapsed}
                  >
                    {session.name}
                  </button>

                  <span className={styles.sessionDate}>
                    {formatSessionDate(session.startedAt)}
                  </span>

                  <button
                    className={styles.renameButton}
                    type="button"
                    onClick={() => beginRename(session)}
                    aria-label={`Rinomina ${session.name}`}
                    title="Rinomina sessione"
                  >
                    ✎
                  </button>
                </div>

                {isEditing ? (
                  <div className={styles.renameForm}>
                    <label htmlFor={`rename-${session.id}`}>
                      Nuovo nome sessione
                    </label>

                    <div className={styles.renameControls}>
                      <input
                        id={`rename-${session.id}`}
                        type="text"
                        maxLength="40"
                        value={draftName}
                        onChange={(event) => setDraftName(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            saveRename(session.id);
                          }

                          if (event.key === 'Escape') {
                            cancelRename();
                          }
                        }}
                      />

                      <button
                        type="button"
                        onClick={() => saveRename(session.id)}
                      >
                        Salva nome
                      </button>

                      <button
                        type="button"
                        onClick={cancelRename}
                      >
                        Annulla
                      </button>
                    </div>
                  </div>
                ) : null}

                {!isCollapsed ? (
                  <div className={styles.timerRows}>
                    {session.timers.map((timer, index) => (
                      <div className={styles.timerRow} key={timer.id}>
                        <span>Timer {index + 1}</span>
                        <time dateTime={new Date(timer.startedAt).toISOString()}>
                          {formatTimerStart(timer.startedAt, session.startedAt)}
                        </time>
                      </div>
                    ))}
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>
      )}

      {hasFollowingDayTimer ? (
        <p className={styles.calendarNote}>
          * iniziato nel giorno di calendario successivo
        </p>
      ) : null}
    </aside>
  );
}

export default HistoryPanel;
