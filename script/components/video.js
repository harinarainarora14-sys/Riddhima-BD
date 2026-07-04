(function () {
  window.Components = window.Components || {};

  // ── YouTube IFrame API loader (shared across any video sections) ──
  let ytApiPromise = null;
  function loadYouTubeAPI() {
    if (ytApiPromise) return ytApiPromise;
    ytApiPromise = new Promise((resolve, reject) => {
      if (window.YT && window.YT.Player) {
        resolve(window.YT);
        return;
      }
      const prevReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prevReady === "function") prevReady();
        resolve(window.YT);
      };
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.onerror = () => reject(new Error("YouTube API failed to load"));
      document.head.appendChild(tag);
      // Safety timeout in case the API script hangs/blocks
      setTimeout(() => reject(new Error("YouTube API timed out")), 8000);
    });
    return ytApiPromise;
  }

  window.Components.video = {
    render(container, section) {
      const div = document.createElement("div");
      div.className = "section section-video";
      const playerId = "yt-player-" + Math.random().toString(36).slice(2, 9);

      div.dataset.holdAfterEnd = section.holdAfterEnd ?? 5;
      div.dataset.playerId = playerId;
      div.dataset.youtubeId = section.youtubeId || "";
      div.dataset.src = section.src || "";

      div.innerHTML = `
        <div class="video-card">
          ${section.title ? `<p class="video-title">${section.title}</p>` : ""}
          <div class="video-wrapper">
            ${
              section.youtubeId
                ? `<div id="${playerId}" class="hbd-video-frame"></div>`
                : `<video
                    class="hbd-video"
                    src="${section.src}"
                    playsinline
                    controls
                    preload="metadata"
                    ${section.poster ? `poster="${section.poster}"` : ""}
                  ></video>`
            }
          </div>
          <button class="rewatch-btn" type="button">↻ ${section.rewatchText || "Rewatch"}</button>
          <p class="video-skip-link" style="display:none;">Skip ahead</p>
          ${section.caption ? `<p class="video-caption">${section.caption}</p>` : ""}
        </div>
      `;
      container.appendChild(div);
      return div;
    },

    animate(tl, el) {
      const card = el.querySelector(".video-card");
      const wrapper = el.querySelector(".video-wrapper");
      const rewatchBtn = el.querySelector(".rewatch-btn");
      const skipLink = el.querySelector(".video-skip-link");
      const nativeVideo = el.querySelector(".hbd-video");
      const holdAfterEnd = Number(el.dataset.holdAfterEnd) || 5;
      const youtubeId = el.dataset.youtubeId;
      const playerId = el.dataset.playerId;

      const audio = document.querySelector(".song");
      let musicWasPlaying = false;
      let ytPlayer = null;
      let resumed = false;

      function pauseMusic() {
        if (audio && !audio.paused) {
          musicWasPlaying = true;
          audio.pause();
        }
      }
      function resumeMusic() {
        if (audio && musicWasPlaying) {
          audio.play().catch(() => {});
        }
      }

      // Resume the master timeline (only needs to actually fire once per pause point)
      function proceed() {
        if (resumed) return;
        resumed = true;
        skipLink.style.display = "none";
        tl.play();
      }

      function onEnded() {
        resumeMusic();
        rewatchBtn.style.display = "inline-block";
        proceed();
      }

      function rewatch() {
        resumed = false;
        tl.pause();
        rewatchBtn.style.display = "none";
        if (ytPlayer) {
          ytPlayer.seekTo(0);
          ytPlayer.playVideo();
        } else if (nativeVideo) {
          nativeVideo.currentTime = 0;
          nativeVideo.play().catch(() => {});
        }
      }
      rewatchBtn.addEventListener("click", rewatch);

      // ── YouTube (unlisted) video path ─────────────────────────────
      function initYouTube() {
        loadYouTubeAPI()
          .then((YT) => {
            ytPlayer = new YT.Player(playerId, {
              videoId: youtubeId,
              playerVars: { rel: 0, playsinline: 1, modestbranding: 1 },
              events: {
                onStateChange: (e) => {
                  if (e.data === YT.PlayerState.PLAYING) {
                    rewatchBtn.style.display = "none";
                    pauseMusic();
                  } else if (e.data === YT.PlayerState.PAUSED) {
                    resumeMusic();
                  } else if (e.data === YT.PlayerState.ENDED) {
                    onEnded();
                  }
                },
              },
            });
          })
          .catch(() => {
            // Embed failed to load (network issue, blocked script, etc.)
            // Don't strand the viewer on this section forever.
            skipLink.textContent = "Video couldn't load — tap to continue";
            skipLink.style.display = "block";
            skipLink.style.pointerEvents = "auto";
            skipLink.style.cursor = "pointer";
            skipLink.addEventListener("click", proceed);
          });
      }

      // ── Local video fallback path (if youtubeId isn't set) ────────
      function initNativeVideo() {
        if (!nativeVideo) return;
        nativeVideo.addEventListener("play", () => {
          rewatchBtn.style.display = "none";
          pauseMusic();
        });
        nativeVideo.addEventListener("pause", () => {
          if (!nativeVideo.ended) resumeMusic();
        });
        nativeVideo.addEventListener("ended", onEnded);
      }

      tl.from(card, {
        duration: 0.7, opacity: 0, y: 20, scale: 0.95, ease: "back.out(1.4)",
      })
      // Only allow taps on the video while this section is actually on screen
      .set(wrapper, { pointerEvents: "auto" })
      .call(() => {
        if (youtubeId) initYouTube();
        else initNativeVideo();
      })
      // Pause the whole timeline right here — it only advances once the
      // video has actually played through to the end (see onEnded/proceed above)
      .addPause()
      .to({}, { duration: holdAfterEnd }) // brief hold so the Rewatch button is visible
      .to(card, { duration: 0.6, opacity: 0, y: -20 })
      .set(wrapper, { pointerEvents: "none" })
      .set(rewatchBtn, { pointerEvents: "none", display: "none" })
      .set(skipLink, { pointerEvents: "none", display: "none" })
      .call(() => {
        if (ytPlayer && ytPlayer.stopVideo) ytPlayer.stopVideo();
        if (nativeVideo) {
          nativeVideo.pause();
          nativeVideo.currentTime = 0;
        }
      });
    },
  };
})();
