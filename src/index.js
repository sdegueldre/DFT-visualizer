import "babel-polyfill";

const ft = require('fourier-transform/asm');
const db = require('decibels');
const undertone = require('../assets/audio/undertone.mpga');

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
	const response = await fetch(undertone);
	const data = await response.arrayBuffer();
	const audioBuffer = await audioCtx.decodeAudioData(data);
	leftSamples = audioBuffer.getChannelData(0);
  rightSamples = audioBuffer.getChannelData(1);
	console.log('Samples acquired');

	document.querySelector('button').onclick = () => {
		playAnim();
		audioElem.fastSeek(0);
		audioElem.play();
	};
})();

function getFrame(time){
	const currFrame = ~~(time*60);
	return [
    ft(leftSamples.slice(Math.max(0, currFrame*samplingRate/60 - 2048), Math.max(4096, currFrame*samplingRate/60 + 2048))),
    ft(rightSamples.slice(Math.max(0, currFrame*samplingRate/60 - 2048), Math.max(4096, currFrame*samplingRate/60 + 2048)))
  ];
}

function playAnim(){
	ctx.clearRect(0,0,cv.width,cv.height);
	const currentTime = audioElem.currentTime;
	const frame = getFrame(currentTime);
	for(let i = 0; i < cv.width; i++) {
		const data = [frame[0].slice(20, -512), frame[1].slice(20, -512)];
    const left = Math.pow(data[0][~~(2**(i/80))], 0.3) * (i/500 + 0.5) * cv.height/2;
    const right = Math.pow(data[1][~~(2**(i/80))], 0.3) * (i/500 + 0.5) * cv.height/2;
		ctx.fillRect(i, cv.height/2, 1, -left);
    ctx.fillRect(i, cv.height/2, 1, right);
	}
	if(currentTime < audioElem.duration)
		window.requestAnimationFrame(playAnim);
}
