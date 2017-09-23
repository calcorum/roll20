// Syntax: !skillChecks [CHARACTER NAME]
// Example: !skillChecks Manticore

function getOutputBySkill(skillName, currentValue){
    let outputVal = "";
    switch(skillName){
        case "acrobatics":
            outputVal += "{{Acrobatics=[[1d20+" + currentValue + "]]}} ";
            break;
        case "athletics":
            outputVal += "{{Athletics=[[1d20+" + currentValue + "]]}} ";
            break;
        case "bluff":
            outputVal += "{{Bluff=[[1d20+" + currentValue + "]]}} ";
            break;
        case "computers":
            outputVal += "{{Computers=[[1d20+" + currentValue + "]]}} ";
            break;
        case "culture":
            outputVal += "{{Culture=[[1d20+" + currentValue + "]]}} ";
            break;
        case "diplomacy":
            outputVal += "{{Diplomacy=[[1d20+" + currentValue + "]]}} ";
            break;
        case "disguise":
            outputVal += "{{Disguise=[[1d20+" + currentValue + "]]}} ";
            break;
        case "engineering":
            outputVal += "{{Engineering=[[1d20+" + currentValue + "]]}} ";
            break;
        case "intimidate":
            outputVal += "{{Intimidate=[[1d20+" + currentValue + "]]}} ";
            break;
        case "lifescience":
            outputVal += "{{Life Science=[[1d20+" + currentValue + "]]}} ";
            break;
        case "medicine":
            outputVal += "{{Medicine=[[1d20+" + currentValue + "]]}} ";
            break;
        case "mysticism":
            outputVal += "{{Mysticism=[[1d20+" + currentValue + "]]}} ";
            break;
        case "perception":
            outputVal += "{{Perception=[[1d20+" + currentValue + "]]}} ";
            break;
        case "physicalscience":
            outputVal += "{{PhysicalScience=[[1d20+" + currentValue + "]]}} ";
            break;
        case "piloting":
            outputVal += "{{Piloting=[[1d20+" + currentValue + "]]}} ";
            break;
        case "sensemotive":
            outputVal += "{{SenseMotive=[[1d20+" + currentValue + "]]}} ";
            break;
        case "sleightofhand":
            outputVal += "{{Sleight Of Hand=[[1d20+" + currentValue + "]]}} ";
            break;
        case "stealth":
            outputVal += "{{Stealth=[[1d20+" + currentValue + "]]}} ";
            break;
        case "survival":
            outputVal += "{{Survival=[[1d20+" + currentValue + "]]}} ";
            break;
    }
    return outputVal;
}

function getOutputBySave(saveName, currentValue){
    let outputVal = "";
    switch(saveName){
        case "fortitude":
            outputVal += "{{Fortitude=[[1d20+" + currentValue + "]]}} ";
            break;
        case "reflex":
            outputVal += "{{Reflex=[[1d20+" + currentValue + "]]}} ";
            break;
        case "will":
            outputVal += "{{Will=[[1d20+" + currentValue + "]]}} ";
            break;
    }
    return outputVal;
}

// find character sent via API call
function getChar(charName){
    return findObjs({
        _type: "character",
        name: charName,
    })[0];
}
// get attributes associated with character
function getAttrs(charObj){
    return findObjs({
        _type: "attribute",
        _characterid: charObj.get("id"),
    });
}

on("chat:message", function(msg){
    if(msg.type != "api") return;
    
    if(msg.content.indexOf("!skillChecks ") !== -1){
        let input = msg.content.replace("!skillChecks ","").split(" ");
        let char = getChar(input[0]);
        let skillString = "{{name=" + char.get("name") + "'s Skills}} ";
        let attributes = getAttrs(char);
        
        // if attribute name starts with "skill-" and is greater than 0,
        //   add it to the skillString
        _.each(attributes, function(att){
            let attName = att.get("name");
            let attCurrent = att.get("current");
            if(attName.indexOf("skill-") !== -1 && attCurrent > 0){
                let skillName = attName.replace("skill-","");
                skillString += getOutputBySkill(skillName, attCurrent);
            }
        });
        skillString += "{{Default=[[1d20]]}}"
        
        sendChat("character|" + char.get("id"), "/w gm &{template:default} " + skillString);
    }else if(msg.content.indexOf("!saves ") !== -1){
        let input = msg.content.replace("!saves ","").split(" ");
        let char = getChar(input[0]);
        let saveString = "{{name=" + char.get("name") + "'s Saves}} ";
        let attributes = getAttrs(char);

        // if attribute name starts with "save-" then add it to the saveString
        _.each(attributes, function(att){
            let attName = att.get("name");
            let attCurrent = att.get("current");
            if(attName.indexOf("save-") !== -1){
                let saveName = attName.replace("save-","");
                saveString += getOutputBySave(saveName, attCurrent);
            }
        });

        sendChat("character|" + char.get("id"), "/w gm &{template:default} " + saveString);
    }
});
