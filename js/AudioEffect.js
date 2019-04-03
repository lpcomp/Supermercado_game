var isIE;// = detectIE();

AudioEffect.audios = new Array();
AudioEffect.numAudiosToLoad = 0;
AudioEffect.numAudiosLoaded = 0;
//AudioEffect.context;// = new AudioContext();
//var audiosGamesBuffers = new Array();
//var audiosGamesSources = new Array();

try {
	
	isIE = false;
	window.AudioContext = window.AudioContext||window.webkitAudioContext;
	AudioEffect.context = new AudioContext();
	AudioEffect.AudiosNode = AudioEffect.context.createGain();
	AudioEffect.AudiosNode.connect(AudioEffect.context.destination);
}catch(e) { 
	isIE = true;
	console.log('Web Audio API is not supported in this browser'); 
}

function AudioEffect(name,vol,loop,onEndedCallback){
	this.name = name;
	this.vol = vol;
	this.loop = loop;
	this.onEndedCallback = onEndedCallback;

	this.startTime = 0;

	var audio = this;
	if(!isIE){

		var request = new XMLHttpRequest();
		request.open('GET', "audio/"+this.name, true);
		request.responseType = 'arraybuffer';
		request.onload = function() {
			AudioEffect.context.decodeAudioData(request.response, function(buffer) {
				audio.buffer = buffer;
				AudioEffect.numAudiosLoaded++;
				if(AudioEffect.numAudiosLoaded >= AudioEffect.numAudiosToLoad && AudioEffect.onAllAudiosLoaded) AudioEffect.onAllAudiosLoaded();
			}, function(e){ console.log("error : "+e); });
		}
		request.send();

		this.play = function(){
			this.source = AudioEffect.context.createBufferSource();
			this.source.buffer = this.buffer; //buffer;

			var gainNode = AudioEffect.context.createGain();
			gainNode.gain.value = this.vol;
			this.source.connect(gainNode);
			gainNode.connect(AudioEffect.AudiosNode);

			this.source.loop = this.loop;
			this.source.start(0);
			this.source.onended = this.onEndedCallback;

			this.startTime = AudioEffect.context.currentTime;
		}

		this.resume = function(){
			this.source.start(0);
			this.source.onended = this.onEndedCallback;
		}

		this.stop = function(){
			this.source.stop(0);
		}

	}else{

		this.htmlAudio = new Audio("audio/"+this.name);
		this.htmlAudio.loop = this.loop;
		this.htmlAudio.volume = this.vol;
		this.htmlAudio.oncanplay = function() {
			AudioEffect.numAudiosLoaded++;
			if(AudioEffect.numAudiosLoaded >= AudioEffect.numAudiosToLoad && AudioEffect.onAllAudiosLoaded) AudioEffect.onAllAudiosLoaded();
		}
		this.htmlAudio.load();

		this.play = function(){
			//console.log(">> "+nome+" "+audiosGames[nome].readyState);
			if(this.htmlAudio.readyState<=0) return;
			this.htmlAudio.time=0;
			this.htmlAudio.play();
			this.htmlAudio.onended = this.onEndedCallback;
		}

		this.stop = function(){
			if(this.htmlAudio.readyState<=0) return;
			this.htmlAudio.pause();
		}

	}

}

AudioEffect.registerAudio = function(name,vol,loop,onendedF) {
	AudioEffect.numAudiosToLoad++;
	AudioEffect.audios[name] = new AudioEffect(name,vol,loop,onendedF);
}
AudioEffect.playSound = function(name) {
	AudioEffect.audios[name].play();
}
AudioEffect.stopSound = function(name) {
	AudioEffect.audios[name].stop();
}

AudioEffect.mute = function() {
	if(!isIE)AudioEffect.AudiosNode.disconnect();
}
AudioEffect.unmute = function() {
	if(!isIE)AudioEffect.AudiosNode.connect(AudioEffect.context.destination);
}


window.onfocus = function() {
    AudioEffect.unmute();
};
/*window.onblur = function() {
    AudioEffect.mute();
};*/
document.addEventListener('pageshow',function(){
    AudioEffect.unmute();
}, false);
/*document.addEventListener('pagehide',function(){
    AudioEffect.mute();
}, false);*/
document.addEventListener('visibilitychange', function(){
   // if (document.hidden)  AudioEffect.mute();
   /*else */AudioEffect.unmute();
},false);