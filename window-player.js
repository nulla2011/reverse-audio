const originPlayButton = document.querySelector('#origin .play-button');
const originPauseButton = document.querySelector('#origin .pause-button');
const originCurrentTime = document.querySelector('#origin .time.current');
const originDurationTime = document.querySelector('#origin .time.duration');
const originProgressBar = document.querySelector('#origin .progress-bar');
const reversePlayButton = document.querySelector('#reverse .play-button');
const reversePauseButton = document.querySelector('#reverse .pause-button');
const reverseCurrentTime = document.querySelector('#reverse .time.current');
const reverseDurationTime = document.querySelector('#reverse .time.duration');
const reverseProgressBar = document.querySelector('#reverse .progress-bar');

const s2MS = (s) => {
  const minutes = Math.floor(s / 60);
  const seconds = Math.floor(s % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};
originPauseButton.style.display = 'none';
originPauseButton.setAttribute('tabindex', '-1');
originPlayButton.style.display = 'inline-block';
originPlayButton.setAttribute('tabindex', '0');
reversePauseButton.style.display = 'none';
reversePauseButton.setAttribute('tabindex', '-1');
reversePlayButton.style.display = 'inline-block';
reversePlayButton.setAttribute('tabindex', '0');
originPlayButton.addEventListener('click', () => {
  originAudio.play();
});
originPauseButton.addEventListener('click', () => {
  originAudio.pause();
});
originAudio.addEventListener('play', () => {
  originPauseButton.style.display = 'inline-block';
  originPauseButton.setAttribute('tabindex', '0');
  originPlayButton.style.display = 'none';
  originPlayButton.setAttribute('tabindex', '-1');
});
originAudio.addEventListener('pause', () => {
  originPauseButton.style.display = 'none';
  originPauseButton.setAttribute('tabindex', '-1');
  originPlayButton.style.display = 'inline-block';
  originPlayButton.setAttribute('tabindex', '0');
});
originAudio.addEventListener('timeupdate', () => {
  const currentTime = originAudio.currentTime;
  originCurrentTime.textContent = s2MS(currentTime);
  originProgressBar.value = currentTime;
  originProgressBar.style.background = `linear-gradient(to right, #aaa ${(currentTime / originAudio.duration) * 100}%, #ddd ${(currentTime / originAudio.duration) * 100}%)`;
  // originProgressBar.style.setProperty('--value', (currentTime / originAudio.duration) * 100);
});
originAudio.addEventListener('loadedmetadata', () => {
  const duration = originAudio.duration;
  if (!Number.isFinite(duration)) {
    originDurationTime.textContent = '-:--';
    return
  }
  originDurationTime.textContent = s2MS(duration);
  originProgressBar.max = duration;
});
originProgressBar.addEventListener('input', () => {
  originAudio.currentTime = originProgressBar.value;
});
reversePlayButton.addEventListener('click', () => {
  reverseAudio.play();
});
reversePauseButton.addEventListener('click', () => {
  reverseAudio.pause();
});
reverseAudio.addEventListener('play', () => {
  reversePauseButton.style.display = 'inline-block';
  reversePauseButton.setAttribute('tabindex', '0');
  reversePlayButton.style.display = 'none';
  reversePlayButton.setAttribute('tabindex', '-1');
});
reverseAudio.addEventListener('pause', () => {
  reversePauseButton.style.display = 'none';
  reversePauseButton.setAttribute('tabindex', '-1');
  reversePlayButton.style.display = 'inline-block';
  reversePlayButton.setAttribute('tabindex', '0');
});
reverseAudio.addEventListener('timeupdate', () => {
  const currentTime = reverseAudio.currentTime;
  reverseCurrentTime.textContent = s2MS(currentTime);
  reverseProgressBar.value = currentTime;
  reverseProgressBar.style.background = `linear-gradient(to right, #aaa ${(currentTime / reverseAudio.duration) * 100}%, #ddd ${(currentTime / reverseAudio.duration) * 100}%)`;
  // originProgressBar.style.setProperty('--value', (currentTime / originAudio.duration) * 100);
});
reverseAudio.addEventListener('loadedmetadata', () => {
  const duration = reverseAudio.duration;
  if (!Number.isFinite(duration)) {
    reverseDurationTime.textContent = '-:--';
    return
  }
  reverseDurationTime.textContent = s2MS(duration);
  reverseProgressBar.max = duration;
});
reverseProgressBar.addEventListener('input', () => {
  reverseAudio.currentTime = reverseProgressBar.value;
});