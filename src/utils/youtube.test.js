import { describe, expect, it } from 'vitest';
import {
  buildYouTubeEmbedUrl,
  getYouTubeStartSeconds,
  getYouTubeVideoId,
} from './youtube';

describe('YouTube helpers', () => {
  it('extracts the video id from a watch URL', () => {
    expect(
      getYouTubeVideoId('https://www.youtube.com/watch?v=IKa5SBJA2dU'),
    ).toBe('IKa5SBJA2dU');
  });

  it('builds a stable privacy-enhanced embed URL', () => {
    const result = buildYouTubeEmbedUrl(
      'https://www.youtube.com/watch?v=IKa5SBJA2dU',
    );

    expect(result).toContain('youtube-nocookie.com/embed/IKa5SBJA2dU');
    expect(result).toContain('enablejsapi=1');
    expect(result).not.toContain('loop=1');
    expect(result).not.toContain('playlist=');
  });

  it('preserves storytelling start seconds', () => {
    const url = 'https://www.youtube.com/watch?v=Pvnvjqzj1O0&t=3s';

    expect(getYouTubeStartSeconds(url)).toBe(3);
    expect(buildYouTubeEmbedUrl(url)).toContain('start=3');
  });
});
