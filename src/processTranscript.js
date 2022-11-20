let helpShown = false;
let tagsShown = false;
let dictationMode = false;
let capitalize = true;
let allcaps = false;

const changeLanguage = (lang, languageStr) => {
	chrome.storage.local.set({Language: lang}, () => {});
	language = lang;
	languageString = languageStr;
	changeLanguageBadge();
	terminateListening();
	initListening();
}

const processInterimTranscript = (interimTranscript) => {
	interimTranscript = interimTranscript.toLowerCase().trim();
	if(!listeningPaused){
		chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
			chrome.tabs.sendMessage(tabs[0].id, {message: interimTranscript});
		});
	}
}

const processFinalTranscript = (finalTranscript) => {
	finalTranscript = finalTranscript.toLowerCase().trim();

	if(!listeningPaused){
		chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
			chrome.tabs.sendMessage(tabs[0].id, {message: finalTranscript});
		});
	}

	let translation = {};
	translations.forEach((values) => {if(values.language === language) translation = values;});

	if(translation.dictationModeOn.some(t => finalTranscript.includes(t))){
		dictationMode = true;
		capitalize = true;
		allcaps = false;
	}
	else if(translation.dictationModeOff.some(t => finalTranscript.includes(t))){
		dictationMode = false;
	}
	else if(dictationMode){
		if(translation.capitalizeoff.some(t => finalTranscript.includes(t))){
			capitalize = false;
			translation.capitalizeoff.forEach((value) => {
				finalTranscript = finalTranscript.replaceAll(value, '').trim();
			});
		}
		else if(translation.capitalize.some(t => finalTranscript.includes(t))){
			capitalize = true;
			translation.capitalize.forEach((value) => {
				finalTranscript = finalTranscript.replaceAll(value, '').trim();
			});
		}
		else if(translation.allcaps.some(t => finalTranscript.includes(t))){
			allcaps = !allcaps;
			translation.allcaps.forEach((value) => {
				finalTranscript = finalTranscript.replaceAll(value, '').trim();
			});
		}
		processDictationMode(finalTranscript);
	}
	else if(translation.start.some(t => finalTranscript.includes(t))){
		startListening();
		startListeningIcon();
	}
	else if(translation.stop.some(t => finalTranscript.includes(t))){
		startListening();
		helpShown = false;
		tagsShown = false;
		dictationMode = false;
		listeningPaused = true;
		sendMessageToContent({value: "updateContent", help: false, tags: false});
		stopListeningIcon();
	}
	else if(translation.terminate.some(t => finalTranscript.includes(t))){
		terminateListening();
		helpShown = false;
		tagsShown = false;
		dictationMode = false;
		sendMessageToContent({value: "updateContent", help: false, tags: false});
		terminateListeningIcon();
	}
	else if (listeningPaused){
		//paused so do not proceed further
	}
	else if(translation.showHelp.some(t => finalTranscript.includes(t))){
		helpShown = true;
		sendMessageToContent({value: "showHelp"});
	}
	else if(translation.closeHelp.some(t => finalTranscript.includes(t))){
		helpShown = false;
		sendMessageToContent({value: "closeHelp"});
	}
	else if(translation.removeTags.some(t => finalTranscript.includes(t))){
		tagsShown = false;
		sendMessageToContent({value: "removeTags"});
	}
	else if(translation.addTags.some(t => finalTranscript.includes(t))){
		tagsShown = true;
		sendMessageToContent({value: "addTags"});
	}
	else if(translation.changeLanguage1.some(t => finalTranscript.includes(t))){
		changeLanguage("en-US", "EN");
		sendMessageToContent({value: "updateContent", help: helpShown, tags: tagsShown});
	}
	else if(translation.changeLanguage2.some(t => finalTranscript.includes(t))){
		changeLanguage("pl-PL", "PL");
		sendMessageToContent({value: "updateContent", help: helpShown, tags: tagsShown});
	}
	else if(tagsShown && !isNaN(finalTranscript)){
		sendMessageToContent({value: "click", tagId: finalTranscript});
	}
	else if(translation.gotoLink.some(t => finalTranscript.includes(t))){
		gotoLink(finalTranscript);
	}
	else if(translation.closeTab.some(t => finalTranscript.includes(t))){
		closeTab();
	}
	else if(translation.goBack.some(t => finalTranscript.includes(t))){
		goBack();
	}
	else if(translation.goForward.some(t => finalTranscript.includes(t))){
		goForward();
	}
	else if(translation.reload.some(t => finalTranscript.includes(t))){
		reload();
	}
	else if(translation.scrollUp.some(t => finalTranscript.includes(t))){
		sendMessageToContent({value: "scrollUp"});
	}
	else if(translation.scrollDown.some(t => finalTranscript.includes(t))){
		sendMessageToContent({value: "scrollDown"});
	}
	else if(translation.scrollTop.some(t => finalTranscript.includes(t))){
		sendMessageToContent({value: "scrollTop"});
	}
	else if(translation.scrollBottom.some(t => finalTranscript.includes(t))){
		sendMessageToContent({value: "scrollBottom"});
	}
	else if(translation.previousTab.some(t => finalTranscript.includes(t))){
		previousTab();
	}
	else if(translation.nextTab.some(t => finalTranscript.includes(t))){
		nextTab();
	}
	else if(translation.changeTab.some(t => finalTranscript.includes(t))){
		changeTab(finalTranscript);
	}
	else if(translation.google.some(t => finalTranscript.includes(t))){
		googleIt(finalTranscript);
	}
	else if(translation.youtube.some(t => finalTranscript.includes(t))){
		youtube(finalTranscript);
	}
	else if(translation.gmail.some(t => finalTranscript.includes(t))){
		gmail();
	}
	else if(translation.play.some(t => finalTranscript.includes(t))){
		sendMessageToContent({value: "play"});
	}
	else if(translation.pause.some(t => finalTranscript.includes(t))){
		sendMessageToContent({value: "pause"});
	}
	else if(translation.unmute.some(t => finalTranscript.includes(t))){
		sendMessageToContent({value: "unmute"});
	}
	else if(translation.mute.some(t => finalTranscript.includes(t))){
		sendMessageToContent({value: "mute"});
	}
	else if(translation.speedup.some(t => finalTranscript.includes(t))){
		sendMessageToContent({value: "speedup"});
	}
	else if(translation.slowdown.some(t => finalTranscript.includes(t))){
		sendMessageToContent({value: "slowdown"});
	}
	else if(translation.fullscreen.some(t => finalTranscript.includes(t))){
		sendMessageToContent({value: "fullscreen"});
	}
}

const sendMessageToContent = (message) => {
	chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
		chrome.tabs.sendMessage(tabs[0].id, message);
	});
}

chrome.tabs.onActivated.addListener( (info) => {
	sendMessageToContent({value: "updateContent", help: helpShown, tags: tagsShown});
});

chrome.tabs.onUpdated.addListener( (tabId, changeInfo, tab) => {
	if(changeInfo.status === "complete")
		sendMessageToContent({value: "updateContent", help: helpShown, tags: tagsShown});
});

chrome.runtime.onMessage.addListener(
	(request, sender, sendResponse) => {
		if (request.value === "getLanguage")
			sendResponse({language: language});
	}
);

const processDictationMode = (message) => {
	if(message === "")
		return;

	for (var key of Object.keys(dictationModeTranslations)) {
		message = message.replaceAll(key, dictationModeTranslations[key]);
	}
	if(capitalize)
		message = message.charAt(0).toUpperCase() + message.slice(1)
	if(allcaps)
		message = message.toUpperCase();

	message = message + ' ';
	sendMessageToContent({value: "dictationMode", message: message});
}

const gotoLink = (message) => {
	let translation = {};
	translations.forEach((values) => {if(values.language === language) translation = values;});
	message = message.replace(translation.gotoLink + ' ', '');

	chrome.tabs.create({ url: 'http://' + message });
}

const closeTab = () => {
	chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
		chrome.tabs.remove(tabs[0].id, () => { });
	});
}

const goBack = () => {
	chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
		chrome.tabs.goBack(tabs[0].id, () => { });
	});
}

const goForward = () => {
	chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
		chrome.tabs.goForward(tabs[0].id, () => { });
	});
}

const reload = () => {
	chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
		chrome.tabs.reload(tabs[0].id, () => { });
	});
}

const previousTab = () => {
	chrome.tabs.getAllInWindow((tabs)=>{
		chrome.tabs.query({ currentWindow: true, active: true }, (tab) => {
			for(let i=0; i< tabs.length; i++){
				if(tabs[i].id === tab[0].id){
					if(tabs[i-1] !== undefined)
						chrome.tabs.update(tabs[i-1].id, {selected: true});

					break;
				}
			}
		});
	});
}

const nextTab = () => {
	chrome.tabs.getAllInWindow((tabs)=>{
		chrome.tabs.query({ currentWindow: true, active: true }, (tab) => {
			for(let i=0; i < tabs.length; i++){
				if(tabs[i].id === tab[0].id){
					if(tabs[i+1] !== undefined)
						chrome.tabs.update(tabs[i+1].id, {selected: true});
					break;
				}
			}
		});
	});
}

const changeTab = (message) => {
	message = message.replace('one', '1');
	let translation = {};
	translations.forEach((values) => {if(values.language === language) translation = values;});
	let tabNumber = parseInt(message.replace(translation.changeTab + ' ', ''));

	chrome.tabs.getAllInWindow((tabs)=>{
		if(tabs[tabNumber-1] !== undefined)
			chrome.tabs.update(tabs[tabNumber-1].id, {selected: true});
	});
}


const googleIt = (message) => {
	let translation = {};
	translations.forEach((values) => {if(values.language === language) translation = values;});
	message = message.replace(translation.google, '');
	message = message.replace(' ', '+');

	if(message === ""){
		chrome.tabs.create({ url: 'https://www.google.com/'});
	}else
		chrome.tabs.create({ url: 'https://www.google.com/search?q=' + message });
}

const youtube = (message) => {
	let translation = {};
	translations.forEach((values) => {if(values.language === language) translation = values;});
	message = message.replace(translation.youtube, '');
	message = message.replace(' ', '+');

	if(message === ""){
		chrome.tabs.create({ url: 'https://www.youtube.com/'});
	}else
		chrome.tabs.create({ url: 'https://www.youtube.com/results?search_query=' + message });
}

const gmail = () => {
	chrome.tabs.create({ url: 'https://mail.google.com/mail/u/0/#inbox'});
}
