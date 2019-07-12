import "babel-polyfill";

const fft = require('jsfft');
const undertone = require('../assets/audio/undertone.mpga');

const cv = document.querySelector('canvas');
cv.width = window.innerWidth;
cv.height = window.innerHeight;
const ctx = cv.getContext('2d');

const samplingRate = 44100;

const frames = [];

(async () => {
	let audioCtx = new AudioContext();
	const response = await fetch(undertone);
	const data = await response.arrayBuffer();
	const audioBuffer = await audioCtx.decodeAudioData(data);
	const samples = audioBuffer.getChannelData(0);
	console.log('Samples acquired');

	let currFrame = 0;
	(function nextFrame(samples){
		let signal = new fft.ComplexArray(samples.slice(currFrame*samplingRate/60, (currFrame+1)*samplingRate/60 + samplingRate));
		signal.FFT();
		let frame = signal.real.slice(0, signal.length/2);

		frames.push(frame);

		currFrame++;
		if(!(currFrame%50)){
			console.log(currFrame*samplingRate/60/samples.length*100, '% done');
		}
		if(currFrame*samplingRate/60 < samples.length){
			window.setTimeout(() => nextFrame(samples), 1);
		}	else {
			console.log('frames done:', frames);
			document.querySelector('button').onclick = () => {
				animFrame = 0;
				playAnim()
				const audioElem = document.querySelector('audio');
				audioElem.fastSeek(0);
				audioElem.play();
			};
		}
	})(samples);
})();

function range(size){
	return new Array(size).fill(0).map((v,i) => i);
}

let animFrame = 0;
let lastFrame = Date.now();
function playAnim(){
	lastFrame = Date.now();
	ctx.clearRect(0,0,cv.width,cv.height);
	for(let i = 0; i < cv.width && frames[animFrame]; i++) {
		const data = frames[animFrame];
		const transform = data.slice(Math.floor(i*data.length/cv.width), Math.ceil((i+1)*data.length/cv.width));
		const avg = transform.reduce((acc, v) => acc + Math.abs(v), 0)/transform.length;
		const height = Math.sqrt(avg) * cv.height;
		ctx.fillRect(i, cv.height - 5, 1, -height);
	}
	if(animFrame++ < frames.length)
		window.requestAnimationFrame(playAnim);
}
