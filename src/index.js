// Todo: use analyzer instead!
import ft from 'fourier-transform/asm';
const audioElt = document.querySelector('audio');
const soundfile = audioElt.src;

const cv = document.querySelector('#animation');
const bg = document.querySelector("#background");
cv.width = bg.width = window.innerWidth;
cv.height = bg.height = window.innerHeight;
let ctx = cv.getContext('2d');
let bgCtx = bg.getContext("2d");

let gradient = ctx.createLinearGradient(0, 0, cv.width, cv.height);
gradient.addColorStop(0, '#30bf33');
gradient.addColorStop(1, '#008ce2');
ctx.fillStyle = gradient;

let leftSamples, rightSamples;
let cache = {};

const audioCtx = new AudioContext();
const samplingRate = audioCtx.sampleRate;

function loadAudio(fileOrBlob) {
  const reader = new FileReader();
  const objectUrl = URL.createObjectURL(fileOrBlob);
  audioElt.src = objectUrl;
  reader.readAsArrayBuffer(fileOrBlob);
  reader.onload = async () => {
    const audioBuffer = await audioCtx.decodeAudioData(reader.result);
    leftSamples = audioBuffer.getChannelData(0);
    rightSamples = audioBuffer.getChannelData(1);
    if (!playing) {
      playAnim();
    }
    console.log('Samples acquired');
  }
}

const input = document.querySelector('input');
input.addEventListener('change', async () => {
  cache = {};
  loadAudio(input.files[0]);
});

// Load base audio file.
if (input.files.length) {
  loadAudio(input.files[0]);
} else {
  fetch(soundfile).then(async response => {
    loadAudio(await response.blob());
  });
}

window.addEventListener('resize', () => {
  cv.width = bg.width = window.innerWidth;
  cv.height = bg.height = window.innerHeight;
  ctx = cv.getContext('2d');
  bgCtx = bg.getContext("2d");

  gradient = ctx.createLinearGradient(0, 0, cv.width, cv.height);
  gradient.addColorStop(0, '#30bf33');
  gradient.addColorStop(1, '#008ce2');
  ctx.fillStyle = gradient;

  if (!playing) {
    playAnim();
  }
});

const halfWinsize = 1024;

function getFrame(time) {
  const centerSample = roundTo(time * samplingRate, samplingRate / 60);
  // TODO: make cache actually useful
  if (!cache[centerSample]) {
    const sliceStart = Math.max(0, centerSample - halfWinsize);
    const sliceEnd = Math.max(2 * halfWinsize, centerSample + halfWinsize);
    let left = leftSamples.slice(sliceStart, sliceEnd);
    let right = rightSamples.slice(sliceStart, sliceEnd);
    const scaleFactor = i => Math.cos(i / left.length * 2 * Math.PI + Math.PI) + 1;
    left = left.map((v, i) => v * scaleFactor(i));
    right = right.map((v, i) => v * scaleFactor(i));
    // TODO: return something when close to boundaries
    if (left.length != 2 * halfWinsize) {
      cache[centerSample] = [
        [],
        [],
      ];
    } else {
      cache[centerSample] = [
        [...ft(left)],
        [...ft(right)],
      ];
    }
  }
  return cache[centerSample];
}

const ln = Math.log;
const hScale = 1 / ln(halfWinsize + 1); // horizontal scaling factor

let playing = false;
let lastFrameTime;
let frameTimes = [];

function playAnim() {
  playing = true;
  ctx.clearRect(0, 0, cv.width, cv.height);
  const data = leftSamples ? getFrame(audioElt.currentTime) : [];

  const channels = data.map((channel, i) => channel.map((v, j) => {
    const x = j/channel.length * cv.width;
    v = intensityOf(v);
    return ({
      x: x,
      y: ((i % 2) ? v : -v) * cv.height / 2 + cv.height / 2,
      // y: ((i % 2) ? v : -v) * cv.height / 2 * (Math.pow(25, x / cv.width) / 2) + cv.height / 2,
    })
  }));
  drawBackgroundSlice(data, audioElt.currentTime / audioElt.duration * bg.width);

  channels.forEach(channel => {
    if (channel.length == 0) {
      return;
    }
    ctx.beginPath();
    ctx.moveTo(0, cv.height / 2);
    ctx.lineTo(0, channel[0].y);

    for (let i = 1; i < channel.length - 1; i++) {
      const point = channel[i];
      const next = channel[i + 1];
      const control = {
        x: (point.x + next.x) * 0.5,
        y: (point.y + next.y) * 0.5,
      };
      // Curve between halfway points using actual points as control points
      ctx.quadraticCurveTo(point.x, point.y, control.x, control.y);
    }

    ctx.lineTo(cv.width, channel[channel.length - 1].y);
    ctx.lineTo(cv.width, cv.height / 2);
    ctx.fill();
  })

  const now = Date.now();
  if (lastFrameTime) {
    frameTimes.push(now - lastFrameTime);
  }
  if (frameTimes.length >= 120) {
    frameTimes = frameTimes.slice(1);
    const fps = 1000 / frameTimes.reduce((a, v) => a + v) * frameTimes.length;
    const text = `FPS: ${fps.toFixed(1)}`;
    const textWidth = ctx.measureText(text).width;
    const topOffset = audioElt.clientHeight + 10 + 10; // 10 for padding, 10 for text height
    ctx.fillText(text, ctx.canvas.width - textWidth - 10, topOffset)
  }
  lastFrameTime = now;
  window.requestAnimationFrame(playAnim);
}

function roundTo(number, precision) {
  return Math.round(number / precision) * precision;
}

window.fillCache = () => {
  for (let i = 0; i < audioElt.duration; i += .001) {
    getFrame(i);
  }
}

const clamp = (n, min, max) => Math.max(Math.min(max, n), min);

const log = Math.log10;
const intensityOf = el => clamp((10*log(el) + 80)/80, 0, 1);
function drawBackgroundSlice([left, right], x) {
  x = ~~x;
  bgCtx.clearRect(x, 0, 1, bg.height);
  left.forEach((el, i) => {
    const intensity = intensityOf(el)**2.2;
    bgCtx.fillStyle = `rgb(255,255,255,${intensity})`;
    bgCtx.fillRect(x, ~~((1 - i / left.length) * bg.height / 2), 1, 1);
  });
  right.forEach((el, i) => {
    const intensity = intensityOf(el)**2.2;
    bgCtx.fillStyle = `rgb(255,255,255,${intensity})`;
    bgCtx.fillRect(x, ~~((i / left.length + 1) * bg.height / 2), 1, 1);
  });
}