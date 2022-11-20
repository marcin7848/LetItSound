var recognition;
var language = "en-US";
var languageString = "EN";
var isListeningTerminated = false;
var listeningPaused = false;

const terminateListening = () => {
	try {
		isListeningTerminated = true;
		recognition.stop();
	}catch(e){}
}

const startListening = () => {
	try {
		isListeningTerminated = false;
		listeningPaused = false;
		recognition.start();
	}catch(e){}
}

const initListening = () => {
	recognition = new webkitSpeechRecognition();
	recognition.continuous = true;
	recognition.interimResults = true;
	recognition.lang = language;
	recognition.maxAlternatives = 1;
	startListening();
	startListeningIcon();

	recognition.onresult = (event) => {
		let interimTranscript = '';

		for (var i = event.resultIndex; i < event.results.length; ++i) {
		  if (event.results[i].isFinal) {
			let finalTranscript = event.results[i][0].transcript;
			processFinalTranscript(finalTranscript);
		  } else {
			interimTranscript += event.results[i][0].transcript;
			processInterimTranscript(interimTranscript);
		  }
		}
	}

	recognition.onend = (event) => {
		if (isListeningTerminated === false)
			startListening();
	}
}

$(document).ready((() => {
	initListening();
}));