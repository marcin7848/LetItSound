let tagId = 100;
let elements = [];

const addTags = () => {
    let removedTags = removeTags();
    if(removedTags){
        $("input").each(function(){
            elements.push($(this));
        });

        $("button").each(function(){
            elements.push($(this));
        });

        $("a").each(function(){
            elements.push($(this));
        });

        document.body.insertAdjacentHTML("afterend", '<div class="letItSound_tagsBox" id="letItSound_tagsBox"></div>');
        elements.forEach((elem) => {
            let rect = elem[0].getBoundingClientRect();
            let posLeft = rect.left - 15;
            if(posLeft < 0)
                posLeft = posLeft + 2*15;
            let posTop= rect.top - 15;
            if(posTop < 0)
                posTop = posTop + 2*15;

            elem.attr("letItSound_tagId", tagId);
            $("#letItSound_tagsBox").append('<div class="letItSound_tagsBox_inside" style="left: '+posLeft+'px; top: '+ posTop +'px;"><span class="tagText">'+ tagId +'</span></div>');
            tagId += 1;
        });
    }
}

const clickTagId = (tagId) => {
    let elem = $('[letItSound_tagId="'+tagId+'"]')
    if(elem.is("input"))
        elem.focus();
    else if (elem.is("button"))
        elem.click();
    else if (elem.is("a"))
        elem[0].click();
}

const removeTags = () => {
    tagId = 100;
    elements = [];
    $("#letItSound_tagsBox").remove();
    let tags = $('[letItSound_tagId]');
    if (!tags.length) {
        return true;
    }
    for(const [index, value] in tags){
        let elem = $(value);
        elem.removeAttr("letItSound_tagId");
        if (tags[index + 1] === undefined) {
            return true;
        }
    }
}