const getLanguage = () => {
	return new Promise((resolve, reject) => {
		chrome.runtime.sendMessage({value: "getLanguage"}, (response) => {
			resolve(response.language);
		});
	});
}