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

function playAnim(){
	ctx.clearRect(0,0,cv.width,cv.height);
	const currentTime = audioElem.currentTime;
	const frame = getFrame(currentTime);
	for(let i = 0; i < cv.width; i++) {
		const data = [frame[0], frame[1]];
		const len = data[0].length;
    const left = data[0][~~(2**(i/120))] * (i/500 + 0.5) * cv.height/2;
    const right = data[1][~~(2**(i/120))] * (i/500 + 0.5) * cv.height/2;
		ctx.fillRect(i, cv.height/2, 1, -left*0.7);
    ctx.fillRect(i, cv.height/2, 1, right*0.7);
	}
	if(currentTime < audioElem.duration && !audioElem.paused)
		window.requestAnimationFrame(playAnim);
}
