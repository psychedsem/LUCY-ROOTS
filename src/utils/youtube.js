let youtubeApiPromise = null;

function parseStartSeconds(value) {
  if (!value) {
    return 0;
  }

  if (/^\d+$/.test(value)) {
    return Number(value);
  }

  const match = value.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);

  if (!match) {
    return 0;
  }

  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  const seconds = Number(match[3] || 0);

  return hours * 3600 + minutes * 60 + seconds;
}

export function getYouTubeVideoId(urlValue) {
  const url = new URL(urlValue);

  if (url.hostname === 'youtu.be') {
    return url.pathname.slice(1);
  }

  if (url.pathname.startsWith('/embed/') || url.pathname.startsWith('/shorts/')) {
    return url.pathname.split('/')[2];
  }

  return url.searchParams.get('v');
}

export function getYouTubeStartSeconds(urlValue) {
  const url = new URL(urlValue);
  return parseStartSeconds(url.searchParams.get('t'));
}

export function buildYouTubeEmbedUrl(urlValue) {
  const videoId = getYouTubeVideoId(urlValue);

  if (!videoId) {
    throw new Error('Invalid YouTube URL');
  }

  const params = new URLSearchParams({
    enablejsapi: '1',
    playsinline: '1',
    rel: '0',
  });

  if (
    typeof window !== 'undefined' &&
    window.location?.origin &&
    window.location.origin !== 'null'
  ) {
    params.set('origin', window.location.origin);
  }

  const startSeconds = getYouTubeStartSeconds(urlValue);

  if (startSeconds > 0) {
    params.set('start', String(startSeconds));
  }

  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

export function loadYouTubeIframeApi() {
  if (typeof window === 'undefined') {
    return Promise.resolve(null);
  }

  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }

  if (youtubeApiPromise) {
    return youtubeApiPromise;
  }

  youtubeApiPromise = new Promise((resolve) => {
    const previousReadyHandler = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      previousReadyHandler?.();
      resolve(window.YT);
    };

    const existingScript = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]',
    );

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.head.appendChild(script);
    }
  });

  return youtubeApiPromise;
}
