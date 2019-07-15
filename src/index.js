import "babel-polyfill";

const ft = require('fourier-transform/asm');
const undertone = require('../assets/audio/undertone.mpga');

const cv = document.querySelector('canvas');
cv.width = window.innerWidth;
cv.height = window.innerHeight;
const ctx = cv.getContext('2d');

const samplingRate = 44100;
const audioElem = document.querySelector('audio');
let samples;

(async () => {
	let audioCtx = new AudioContext();
	const response = await fetch(undertone);
	const data = await response.arrayBuffer();
	const audioBuffer = await audioCtx.decodeAudioData(data);
	samples = audioBuffer.getChannelData(0);
	console.log('Samples acquired');

	document.querySelector('button').onclick = () => {
		playAnim();
		audioElem.fastSeek(0);
		audioElem.play();
	};
})();

function getFrame(time){
	const currFrame = ~~(time*60);
	return ft(samples.slice(currFrame*samplingRate/60, currFrame*samplingRate/60 + 8192));
}

function playAnim(){
	ctx.clearRect(0,0,cv.width,cv.height);
	const currentTime = audioElem.currentTime;
	const frame = getFrame(currentTime);
	for(let i = 0; i < cv.width; i++) {
		const data = frame;
		const transform = data.slice(Math.floor(i*data.length/cv.width), Math.ceil((i+1)*data.length/cv.width));
		const avg = transform.reduce((acc, v) => acc + Math.abs(v), 0)/transform.length;
		const height = Math.sqrt(avg) * cv.height;
		ctx.fillRect(i, cv.height - 5, 1, -height);
	}
	if(currentTime < audioElem.duration)
		window.requestAnimationFrame(playAnim);
}
