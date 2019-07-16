import "babel-polyfill";

const ft = require('fourier-transform/asm');
const db = require('decibels');
const soundfile = require('../assets/audio/undertone.mpga');
const audioElt = document.createElement('audio');
audioElt.src = soundfile;
audioElt.controls = true;
audioElt.loop = true;
audioElt.style = 'position: absolute; top: 0; right: 0; width: 100%;'
document.body.appendChild(audioElt);

const cv = document.querySelector('canvas');
cv.width = window.innerWidth;
cv.height = window.innerHeight;
const ctx = cv.getContext('2d');

const samplingRate = 44100;
const audioElem = document.querySelector('audio');
let leftSamples;
let rightSamples;

(async () => {
	let audioCtx = new AudioContext();
	const response = await fetch(soundfile);
	const data = await response.arrayBuffer();
	const audioBuffer = await audioCtx.decodeAudioData(data);
	console.log(audioBuffer);
	leftSamples = audioBuffer.getChannelData(0);
  rightSamples = audioBuffer.getChannelData(1);
	console.log('Samples acquired');

	audioElt.onplay = async () => {
		playAnim();
	};

	if(!audioElt.paused) {
		playAnim();
	}
})();

const halfWinsize = 2048;
function getFrame(time){
	let left = leftSamples.slice(Math.max(0, ~~(time*samplingRate) - halfWinsize), Math.max(2*halfWinsize, ~~(time*samplingRate) + halfWinsize));
	let right = rightSamples.slice(Math.max(0, ~~(time*samplingRate) - halfWinsize), Math.max(2*halfWinsize, ~~(time*samplingRate) + halfWinsize));
	left = left.map((v, i) => v * (Math.cos(i/left.length*2*Math.PI + Math.PI) + 1));
	right = right.map((v, i) => v * (Math.cos(i/right.length*2*Math.PI + Math.PI) + 1));
	if(left.length != 2*halfWinsize)
		return [[],[]];
	return [
    [...ft(left)],
    [...ft(right)]
  ];
}

const ln = Math.log;
const hScale = 1/ln(halfWinsize + 1); // horizontal scaling factor
function playAnim(){
	ctx.clearRect(0,0,cv.width,cv.height);
	const currentTime = audioElem.currentTime;
	const data = getFrame(currentTime);
  const frame = data.map((channel) => channel.map((v, i) => ({x: ln(i+1)*cv.width*hScale, y: v*cv.height/2})));
  ctx.beginPath();
  ctx.moveTo(0, cv.height/2);
  frame.forEach((channel, i) => {
    if(i%2) {
      for(let point of channel){
        ctx.lineTo(point.x, -point.y * (1 + (point.x/cv.width)) + cv.height/2);
      }
    } else {
      for(let point of channel){
        ctx.lineTo(point.x, point.y * (1 + (point.x/cv.width)) + cv.height/2);
      }
    }
  })
  ctx.lineTo(cv.width, cv.height/2);
  ctx.fill();
	if(currentTime < audioElem.duration && !audioElem.paused)
		window.requestAnimationFrame(playAnim);
}
