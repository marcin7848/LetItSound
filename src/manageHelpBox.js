const showHelp = async () => {
    await closeHelp();

    let commandsHTML = "";
    let language = await getLanguage();
    translations.forEach((lan) => {
        if (lan.language === language) {
            Object.values(lan).forEach((t) => {
                if (t.constructor === Array)
                    commandsHTML += '<div class="letItSound_helpBox_commandName"> ' + t[0] + '</div>';
            });

        }
    });

    document.body.insertAdjacentHTML("afterend", '<div class="letItSound_helpBox" id="letItSound_helpBox"></div>');
    $("#letItSound_helpBox").append('<div class="letItSound_helpBox_outside"><div class="letItSound_helpBox_relative"><div class="letItSound_helpBox_main">' +
        '<div class="letItSound_helpBox_inside">' +
        '<div><span class="letItSound_helpBox_commandTitle">Commands</span></div>' +
        '<div class="letItSound_helpBox_commands">' +
        '<div class="letItSound_helpBox_commandLine"><div>' +
        commandsHTML +
        '</div></div></div>' +
        '</div><div></div></div></div></div></div>');
}

const closeHelp = () => {
    $("#letItSound_helpBox").remove();
}