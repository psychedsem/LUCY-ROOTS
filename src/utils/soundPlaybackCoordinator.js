export function createSoundPlaybackCoordinator() {
  const players = new Map();
  let activeId = null;
  let pendingPlayId = null;

  function register(id, player) {
    players.set(id, player);

    if (pendingPlayId === id) {
      pendingPlayId = null;
      activeId = id;
      player.play();
    }
  }

  function unregister(id) {
    players.delete(id);

    if (activeId === id) {
      activeId = null;
    }

    if (pendingPlayId === id) {
      pendingPlayId = null;
    }
  }

  function handlePlaying(id) {
    if (activeId && activeId !== id) {
      players.get(activeId)?.pause();
    }

    activeId = id;
    pendingPlayId = null;
  }

  function handlePaused(id) {
    if (activeId === id) {
      activeId = null;
    }
  }

  function play(id) {
    if (!id) {
      return;
    }

    if (activeId && activeId !== id) {
      players.get(activeId)?.pause();
    }

    activeId = id;
    const player = players.get(id);

    if (player) {
      pendingPlayId = null;
      player.play();
    } else {
      pendingPlayId = id;
    }
  }

  function stopActive() {
    if (activeId) {
      players.get(activeId)?.pause();
    }

    activeId = null;
    pendingPlayId = null;
  }

  function pauseForTimer() {
    if (activeId) {
      players.get(activeId)?.pause();
    }
  }

  return {
    register,
    unregister,
    handlePlaying,
    handlePaused,
    play,
    stopActive,
    pauseForTimer,
  };
}
