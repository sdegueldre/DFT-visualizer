import "babel-polyfill";

const ft = require('fourier-transform/asm');
const db = require('decibels');
const soundfile = require('../assets/audio/Komiku - Mushrooms.mp3');
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
const gradient = ctx.createLinearGradient(0, 0, cv.width, cv.height);
gradient.addColorStop(0, '#30bf33');
gradient.addColorStop(1, '#008ce2');
ctx.fillStyle = gradient;

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
function playAnim(){
	ctx.clearRect(0,0,cv.width,cv.height);
	const currentTime = audioElem.currentTime;
	const data = getFrame(currentTime);

  const frame = data.map((channel, i) => channel.map((v, j) => {
    const x = ln(j+1)*cv.width*hScale;
    return ({
      x: x,
      y: ((i%2) ? v : -v) * cv.height/2 * (Math.pow(25, x/cv.width)/2) + cv.height/2
    })
  }));

  frame.forEach(channel => {
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

	if(currentTime < audioElem.duration && !audioElem.paused)
		window.requestAnimationFrame(playAnim);
}
