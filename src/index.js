import "babel-polyfill";

const ft = require('fourier-transform/asm');
const db = require('decibels');
const soundfile = require('../assets/audio/Komiku - Mushrooms.mp3');
const audioElt = document.createElement('audio');
audioElt.src = soundfile;
audioElt.controls = true;
audioElt.loop = true;
document.body.appendChild(audioElt);

const cv = document.querySelector('canvas');
cv.width = window.innerWidth;
cv.height = window.innerHeight;
let ctx = cv.getContext('2d');

let gradient = ctx.createLinearGradient(0, 0, cv.width, cv.height);
gradient.addColorStop(0, '#30bf33');
gradient.addColorStop(1, '#008ce2');
ctx.fillStyle = gradient;

const samplingRate = 44100;
const audioElem = document.querySelector('audio');
let leftSamples;
let rightSamples;

const input = document.querySelector('input');
let startTime = 0;
let audioCtx;
let bufferSource;

input.addEventListener('change', async (e) => {
	const reader = new FileReader();
	reader.readAsArrayBuffer(input.files[0]);
	audioCtx = new AudioContext();
	reader.onload = async () => {
		if(bufferSource){
			console.log('There was already a buffer source, stopping it...', bufferSource);
			bufferSource.stop();
		}
		const audioBuffer = await audioCtx.decodeAudioData(reader.result);
		bufferSource = audioCtx.createBufferSource();
		bufferSource.buffer = audioBuffer;
		bufferSource.connect(audioCtx.destination);
		bufferSource.start();
		console.log(bufferSource);
		console.log(audioBuffer);
		leftSamples = audioBuffer.getChannelData(0);
	  rightSamples = audioBuffer.getChannelData(1);
		startTime = audioCtx.currentTime;
    if(!playing)
		  playAnim();
		console.log('Samples acquired');
	}

	window.addEventListener('resize', () => {
		cv.width = window.innerWidth;
		cv.height = window.innerHeight;
		ctx = cv.getContext('2d');

		gradient = ctx.createLinearGradient(0, 0, cv.width, cv.height);
		gradient.addColorStop(0, '#30bf33');
		gradient.addColorStop(1, '#008ce2');
		ctx.fillStyle = gradient;

    if(!playing)
		  playAnim();
	});
});

const halfWinsize = 4096;
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

let playing = false;
function playAnim(){
  playing = true;
	ctx.clearRect(0,0,cv.width,cv.height);
	const currentTime = audioCtx.currentTime - startTime;
	const data = getFrame(currentTime);

  const frame = data.map((channel, i) => channel.map((v, j) => {
    const x = ln(j+1)*cv.width*hScale;
    return ({
      x: x,
      y: ((i%2) ? v : -v) * cv.height/2 * (Math.pow(25, x/cv.width)/2) + cv.height/2
    })
  }));

  frame.forEach(channel => {
		if(channel.length == 0)
			return;
    ctx.beginPath();
    ctx.moveTo(0, cv.height/2);
    ctx.lineTo(0, channel[0].y);

    for(let i = 1; i < channel.length - 1; i++){
      const point = channel[i];
      const next = channel[i+1];
      const control = {
        x: (point.x + next.x) * 0.5,
        y: (point.y + next.y) * 0.5
      };
      ctx.quadraticCurveTo(point.x, point.y, control.x, control.y);
    }

    ctx.lineTo(cv.width, channel[channel.length-1].y);
    ctx.lineTo(cv.width, cv.height/2);
    ctx.fill();
  })

  window.requestAnimationFrame(playAnim);
}
