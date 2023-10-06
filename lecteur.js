import { songs } from "/data.js";

let currentSongIndex = 0;
const audio = new Audio(songs[currentSongIndex].link);

const playButton = document.querySelector(".play");
const pauseButton = document.querySelector(".pause");
const nextButton = document.querySelector(".chanson-suivante");
const prevButton = document.querySelector(".chanson-precedente");
const progressBar = document.querySelector(".barre-progression");
const elapsedTime = document.querySelector(".temps-ecoule");

const songList = document.querySelector(".liste-des-chansons");
const equalizerDIV = document.querySelector(".equalizer");

pauseButton.addEventListener("click", () => {
  audio.pause();
  equalizerDIV.style.display = "none";
});

nextButton.addEventListener("click", () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  playSong(currentSongIndex);
  equalizerDIV.style.display = "flex";
});

prevButton.addEventListener("click", () => {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  playSong(currentSongIndex);
  equalizerDIV.style.display = "flex";
});

audio.addEventListener("timeupdate", () => {
  const progress = audio.currentTime / audio.duration;
  progressBar.style.width = `${progress * 100}%`;
  elapsedTime.textContent = formatTime(audio.currentTime);
});

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

audio.addEventListener("ended", () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  playSong(currentSongIndex);
});

const volumeSlider = document.querySelector(".volume-slider");

volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value;
});

let currentSongItem = null;

function playSong(index) {
  if (currentSongItem) {
    currentSongItem.style.backgroundColor = "";
  }

  currentSongIndex = index;
  audio.src = songs[currentSongIndex].link;

  audio.oncanplay = function () {
    audio.play();
  };

  currentSongItem = songList.children[currentSongIndex];
  currentSongItem.style.backgroundColor = "blue";
}

songs.forEach((song, index) => {
  const songItem = document.createElement("div");
  songItem.textContent = `${song.songName} - ${song.artist}`;

  songItem.addEventListener("dblclick", () => {
    playSong(index);
    equalizerDIV.style.display = "flex";
  });

  songList.appendChild(songItem);
});

playButton.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    equalizerDIV.style.display = "flex";
  } else {
    playSong(currentSongIndex);
  }
});

playSong(currentSongIndex);
