var tagsActived = false;

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.value === "showHelp")
            showHelp();
        else if (request.value === "closeHelp")
            closeHelp();
        else if (request.value === "removeTags"){
            tagsActived = false;
            removeTags();
        }
        else if (request.value === "addTags"){
            tagsActived = true;
            addTags();
        }
        else if (request.value === "updateContent")
            updateContentAfterTabUpdate(request.help, request.tags);
        else if (request.value === "click")
            clickTagId(request.tagId);
        else if (request.value === "dictationMode")
            insertTextToField(request.message);
        else if (request.value === "scrollUp")
            scrollUp();
        else if (request.value === "scrollDown")
            scrollDown();
        else if (request.value === "scrollTop")
            scrollTop();
        else if (request.value === "scrollBottom")
            scrollBottom();
        else if (request.value === "play")
            pressKey("K","KeyK", "K".charCodeAt(0));
        else if (request.value === "pause")
            pressKey("K","KeyK", "K".charCodeAt(0));
        else if (request.value === "unmute")
            pressKey("M", "KeyM", "M".charCodeAt(0));
        else if (request.value === "mute")
            pressKey("M", "KeyM", "M".charCodeAt(0));
        else if (request.value === "speedup"){
            for(let i=0; i < 4; i++){
                pressKey(">", "Period", 190, true);
            }
        }
        else if (request.value === "slowdown"){
            for(let i=0; i < 4; i++){
                pressKey("<", "Comma", 188, true);
            }
        }
        else if (request.value === "fullscreen")
            pressKey("F", "KeyF", "F".charCodeAt(0));
    }
);

const updateContentAfterTabUpdate = (help, tags) => {
    if(help)
        showHelp();
    else closeHelp();
    if(tags) {
        tagsActived = true;
        addTags();
    }
    else {
        tagsActived = false;
        removeTags();
    }
}

window.onscroll = (e) => {
    if(tagsActived){
        addTags();
    }
}

const insertTextToField = (message) => {
    navigator.clipboard.writeText(message).then(() => {
        document.execCommand('paste');
    });

}

var scrollHeight = 0;

const scrollUp = () => {
    scrollHeight = scrollHeight-window.innerHeight * 8/10;
    $("html, body").animate({ scrollTop: scrollHeight }, "slow");
}

const scrollDown = () => {
    scrollHeight = scrollHeight + window.innerHeight * 8/10;
    $("html, body").animate({ scrollTop: scrollHeight }, "slow");
}

const scrollTop = () => {
    scrollHeight = 0;
    $("html, body").animate({ scrollTop: 0 }, "slow");
}

const scrollBottom = () => {
    scrollHeight = document.body.scrollHeight - window.innerHeight;
    $("html, body").animate({ scrollTop: scrollHeight }, "slow");
}

const pressKey = (key, code, keyCode, shift = false, ctrl = false) => {
    document.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: key,
            code: code,
            keyCode: keyCode,
            which: keyCode,
            shiftKey: shift,
            ctrlKey: ctrl,
            metaKey: false
        })
    );
}
