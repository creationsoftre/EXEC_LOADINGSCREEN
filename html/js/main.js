const progressFill = document.getElementById("progressFill");
const progressPercent = document.getElementById("progressPercent");
const progressLabel = document.getElementById("progressLabel");
const statusTitle = document.getElementById("statusTitle");
const logo = document.getElementById("logo");
const bgVideo = document.getElementById("bgVideo");
const audio = document.getElementById("music");
const audioHint = document.getElementById("audioHint");

const defaultConfig = {
  colors: {
    bgDeep: "#0E0E10",
    bgMid: "#141517",
    bodyGlow: "#1A1B1E",
    textMain: "#FFFFFF",
    textMuted: "#A8A8A8",
    accent: "#39FF14",
    accentCool: "#2EE60F",
    overlayGlow: "rgba(57, 255, 20, 0.15)",
    overlayDark: "rgba(0, 0, 0, 0.6)",
    overlayMid: "rgba(20, 21, 23, 0.85)",
    stripe: "rgba(255, 255, 255, 0.03)",
    progressTrack: "#1A1B1E",
    progressStroke: "#2A2C30",
    progressGlow: "rgba(57, 255, 20, 0.35)",
  },
  branding: {
    title: "Connecting",
    showLogo: true,
    logo: "assets/logo.png",
  },
  background: {
    useVideo: true,
    video: "assets/bgvideo.mp4",
  },
  audio: {
    enabled: true,
    src: "assets/music.mp3",
    volume: 0.12,
    loop: true,
    autoplay: true,
    playText: "Space: play music",
    pauseText: "Space: mute music",
  },
  progressLabels: {
    preparingSession: "Preparing session",
    initializingResources: "Initializing resources",
    loadingAssets: "Loading assets",
    loadingMap: "Loading map",
  },
};

let config = { ...defaultConfig };
let colors = { ...defaultConfig.colors };
let branding = { ...defaultConfig.branding };
let background = { ...defaultConfig.background };
let audioConfig = { ...defaultConfig.audio };
let labels = { ...defaultConfig.progressLabels };

let count = 1;
let mapCount = 0;
let currentProgress = 0;
let targetProgress = 0;

const progressStages = {
  initStart: 0.04,
  initEnd: 0.68,
  dataStart: 0.68,
  mapEnd: 1,
};

const viewportScaleFactor = () => {
  const widthFactor = window.innerWidth / 2560;
  const heightFactor = window.innerHeight / 1440;
  const responsive = Math.min(widthFactor, heightFactor);
  return Math.min(1, Math.max(0.62, responsive));
};

const applyViewportScale = () => {
  document.documentElement.style.setProperty("--loading-scale", viewportScaleFactor().toFixed(3));
};

const mergeSection = (defaults, incoming) => ({
  ...defaults,
  ...(incoming || {}),
});

const applyCssVars = (vars) => {
  const root = document.documentElement.style;
  const map = {
    bgDeep: "--bg-deep",
    bgMid: "--bg-mid",
    bodyGlow: "--body-glow",
    textMain: "--text-main",
    textMuted: "--text-muted",
    accent: "--accent",
    accentCool: "--accent-cool",
    overlayGlow: "--overlay-glow",
    overlayDark: "--overlay-dark",
    overlayMid: "--overlay-mid",
    stripe: "--stripe",
    progressTrack: "--progress-track",
    progressStroke: "--progress-stroke",
    progressGlow: "--progress-glow",
  };

  Object.entries(map).forEach(([key, cssVar]) => {
    if (vars[key]) {
      root.setProperty(cssVar, vars[key]);
    }
  });
};

const applyConfig = (incomingConfig = {}) => {
  config = {
    ...defaultConfig,
    ...incomingConfig,
  };
  colors = mergeSection(defaultConfig.colors, config.colors);
  branding = mergeSection(defaultConfig.branding, config.branding);
  background = mergeSection(defaultConfig.background, config.background);
  audioConfig = mergeSection(defaultConfig.audio, config.audio);
  labels = mergeSection(defaultConfig.progressLabels, config.progressLabels);
  applyCssVars(colors);

  if (statusTitle) {
    statusTitle.textContent = branding.title || defaultConfig.branding.title;
  }

  if (logo) {
    const showLogo = branding.showLogo !== false;
    logo.hidden = !showLogo;
    if (showLogo && branding.logo) {
      logo.src = branding.logo;
    }
  }

  if (bgVideo) {
    const useVideo = background.useVideo !== false;
    bgVideo.hidden = !useVideo;
    if (useVideo && background.video) {
      const source = bgVideo.querySelector("source");
      if (source) {
        source.src = background.video;
        bgVideo.load();
      } else {
        bgVideo.src = background.video;
      }
    }
  }

  if (audio) {
    const audioEnabled = audioConfig.enabled !== false;
    const nextAudioSrc = audioConfig.src || defaultConfig.audio.src;
    const currentAudioSrc = audio.getAttribute("src");

    if (currentAudioSrc !== nextAudioSrc) {
      audio.src = nextAudioSrc;
      audio.load();
    }

    audio.volume = Math.min(1, Math.max(0, Number(audioConfig.volume) || defaultConfig.audio.volume));
    audio.loop = audioConfig.loop !== false;

    if (audioEnabled && audioConfig.autoplay !== false && audio.paused) {
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
    }

    if (!audioEnabled) {
      audio.pause();
    }

    if (audioHint) {
      audioHint.hidden = !audioEnabled;
    }
  }
};

["resize", "orientationchange"].forEach((eventName) => {
  window.addEventListener(eventName, applyViewportScale);
});
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", applyViewportScale);
}
applyViewportScale();

const clamp = (value) => Math.min(1, Math.max(0, value));
const lerp = (start, end, amount) => start + (end - start) * clamp(amount);

const updateProgressUI = (value) => {
  const safeValue = clamp(value);
  if (progressFill) {
    progressFill.style.transform = `scaleX(${safeValue})`;
  }
  if (progressPercent) {
    progressPercent.textContent = `${Math.round(safeValue * 100)}%`;
  }
};

const setTargetProgress = (value, label) => {
  targetProgress = Math.max(targetProgress, currentProgress, clamp(value));
  if (progressLabel && label) {
    progressLabel.textContent = label;
  }
};

const animateProgress = () => {
  const delta = targetProgress - currentProgress;
  if (Math.abs(delta) > 0.001) {
    currentProgress += delta * 0.08;
  } else {
    currentProgress = targetProgress;
  }
  updateProgressUI(currentProgress);
  window.requestAnimationFrame(animateProgress);
};

const setCount = (newCount) => {
  count = Math.max(1, Number(newCount) || 1);
  mapCount = 0;
};

const handlers = {
  startInitFunctionOrder(data) {
    setCount(data.count);
    setTargetProgress(progressStages.initStart, labels.preparingSession);
  },

  initFunctionInvoking(data) {
    const idx = Number(data.idx) || 0;
    const phaseProgress = (idx + 1) / count;
    setTargetProgress(lerp(progressStages.initStart, progressStages.initEnd, phaseProgress), labels.initializingResources);
  },

  startDataFileEntries(data) {
    setCount(data.count);
    setTargetProgress(progressStages.dataStart, labels.loadingAssets);
  },

  performMapLoadFunction() {
    mapCount = Math.min(mapCount + 1, count);
    const phaseProgress = mapCount / count;
    setTargetProgress(lerp(progressStages.dataStart, progressStages.mapEnd, phaseProgress), labels.loadingMap);
  },
};

window.addEventListener("message", (event) => {
  const data = event.data || {};
  if (data.type === "loadscreenConfig") {
    applyConfig(data.config || {});
    return;
  }
  const handler = handlers[data.eventName];
  if (handler) {
    handler(data);
  }
});

if (audio) {
  const updateHint = () => {
    const audioEnabled = audioConfig.enabled !== false;
    const defaultPlayText = audioConfig.playText || defaultConfig.audio.playText;
    const defaultPauseText = audioConfig.pauseText || defaultConfig.audio.pauseText;
    if (!audioHint || !audioEnabled) {
      return;
    }
    audioHint.textContent = audio.paused ? defaultPlayText : defaultPauseText;
  };

  const safePlay = () => {
    const audioEnabled = audioConfig.enabled !== false;
    if (!audioEnabled) {
      return;
    }
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        updateHint();
      });
    }
  };

  document.addEventListener("keydown", (event) => {
    const audioEnabled = audioConfig.enabled !== false;
    if (!audioEnabled) {
      return;
    }
    if (event.code !== "Space" || event.repeat) {
      return;
    }
    event.preventDefault();
    if (audio.paused) {
      safePlay();
    } else {
      audio.pause();
    }
  });

  document.addEventListener(
    "click",
    () => {
      const audioEnabled = audioConfig.enabled !== false;
      if (audioEnabled && audio.paused) {
        safePlay();
      }
    },
    { once: true }
  );

  audio.addEventListener("play", updateHint);
  audio.addEventListener("pause", updateHint);
  applyConfig();
  updateHint();
  if (audioConfig.enabled !== false && audioConfig.autoplay !== false) {
    safePlay();
  }
}

window.requestAnimationFrame(animateProgress);
