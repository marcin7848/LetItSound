let hideMessageAfterSeconds = 1;
let hideMessageRun = 0;

chrome.runtime.onMessage.addListener(
	(request, sender, sendResponse) => {
		if(request.message){
			hideMessageRun += 1;
			showMessageBox(request.message);
			hideAfterSeconds();
		}
	}
);

const showMessageBox = (message) => {
	hideMessageBox();
	document.body.insertAdjacentHTML("afterend", '<div class="letItSound_messageBox" id="letItSound_messageBox"></div>');
	$("#letItSound_messageBox").append('<div class="letItSound_messageBox_inside"><span class="messageText">'+ message +'</span></div>');
}

const hideMessageBox = () => {
	$("#letItSound_messageBox").remove();
}

const hideAfterSeconds = () => {
	if(hideMessageRun > 1) {
		hideMessageAfterSeconds = 1;
		hideMessageRun -= 1;
		return;
	}

	if(hideMessageAfterSeconds <= 0) {
		hideMessageBox();
		hideMessageRun = 0;
		hideMessageAfterSeconds = 1;
	}
	else{
		hideMessageAfterSeconds -= 1;
		refreshedReset = false;
		setTimeout(hideAfterSeconds, 1000);
	}
}

