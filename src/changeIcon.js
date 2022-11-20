function toggleListening(){
	chrome.storage.local.get(['ListeningActive'], (variables) => {
			if(variables.ListeningActive === undefined || variables.ListeningActive === false){
				startListening();
				startListeningIcon();
			}
			else if (variables.ListeningActive === true){
				terminateListening();
				helpShown = false;
				tagsShown = false;
				dictationMode = false;
				sendMessageToContent({value: "updateContent", help: false, tags: false});
				terminateListeningIcon();
			}
			else {
				startListening();
				helpShown = false;
				tagsShown = false;
				dictationMode = false;
				listeningPaused = true;
				sendMessageToContent({value: "updateContent", help: false, tags: false});
				stopListeningIcon();
			}
		}
	);
}

chrome.browserAction.onClicked.addListener((tab) => {
	toggleListening();
});

const changeLanguageBadge = (languageStr) => {
	chrome.browserAction.setBadgeText({text: languageStr});

}

const startListeningIcon = () => {
	chrome.browserAction.setIcon({
		path: "/img/128on.png"
	});
	chrome.storage.local.set({ListeningActive: true}, () => {});
	changeLanguageBadge(languageString);
}

const stopListeningIcon = () => {
	chrome.browserAction.setIcon({
		path: "/img/128off.png"
	});
	chrome.storage.local.set({ListeningActive: false}, () => {});
	changeLanguageBadge("");
}

const terminateListeningIcon = () => {
	chrome.browserAction.setIcon({
		path: "/img/128.png"
	});
	chrome.storage.local.set({ListeningActive: null}, () => {});
	changeLanguageBadge("");
}
