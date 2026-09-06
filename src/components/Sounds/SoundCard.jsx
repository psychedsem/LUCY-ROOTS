import { useEffect, useMemo, useRef } from 'react';
import {
  buildYouTubeEmbedUrl,
  getYouTubeStartSeconds,
  getYouTubeVideoId,
  loadYouTubeIframeApi,
} from '../../utils/youtube';
import styles from './SoundCard.module.css';

function SoundCard({
  title,
  url,
  coordinator,
  onSoundSelect,
  loop = false,
  onLoopChange,
}) {
  const iframeRef = useRef(null);
  const playerRef = useRef(null);
  const loopRef = useRef(loop);

  const soundId = useMemo(() => getYouTubeVideoId(url), [url]);
  const startSeconds = useMemo(() => getYouTubeStartSeconds(url), [url]);
  const embedUrl = useMemo(() => buildYouTubeEmbedUrl(url), [url]);

  useEffect(() => {
    loopRef.current = loop;
  }, [loop]);

  useEffect(() => {
    let cancelled = false;

    loadYouTubeIframeApi().then((YT) => {
      if (cancelled || !YT?.Player || !iframeRef.current || playerRef.current) {
        return;
      }

      playerRef.current = new YT.Player(iframeRef.current, {
        events: {
          onReady: (event) => {
            event.target
              .getIframe?.()
              ?.setAttribute('title', `${title} YouTube player`);

            coordinator?.register(soundId, {
              play: () => event.target.playVideo(),
              pause: () => event.target.pauseVideo(),
            });
          },
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.PLAYING) {
              coordinator?.handlePlaying(soundId);
              onSoundSelect?.(soundId);
              return;
            }

            if (event.data === YT.PlayerState.ENDED && loopRef.current) {
              // Loop at runtime so changing the toggle never reloads the iframe.
              event.target.seekTo(startSeconds, true);
              event.target.playVideo();
              return;
            }

            if (
              event.data === YT.PlayerState.PAUSED ||
              event.data === YT.PlayerState.ENDED
            ) {
              coordinator?.handlePaused(soundId);
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      coordinator?.unregister(soundId);
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
  }, [coordinator, onSoundSelect, soundId, startSeconds, title]);

  return (
    <article className={styles.card}>
      <div className={styles.playerFrame}>
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title={`${title} YouTube player`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>

      <div className={styles.cardBody}>
        <div className={styles.titleRow}>
          <h4>{title}</h4>

          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${title} on YouTube`}
          >
            YouTube ↗
          </a>
        </div>

        <label className={styles.loopToggle}>
          <input
            type="checkbox"
            checked={loop}
            onChange={(event) => onLoopChange?.(soundId, event.target.checked)}
            aria-label={`Loop ${title}`}
          />
          <span className={styles.loopIndicator} aria-hidden="true" />
          <span>Loop</span>
        </label>
      </div>
    </article>
  );
}

export default SoundCard;
