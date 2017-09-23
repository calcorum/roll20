// Syntax: !skillChecks [CHARACTER NAME]
// Example: !skillChecks Manticore

let chatIntro = "/w gm &{template:default}";
let skHelp1 = ""
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

on("chat:message", function(msg){
    if(msg.type != "api") return;
    
    if(msg.type == "api" && msg.content.indexOf("!skillChecks ") !== -1){
        let input = msg.content.replace("!skillChecks ","").split(" ");
        
        // find character send via API call
        let char = findObjs({
            _type: "character",
            name: input[0],
        })[0];
        
        let skillString = "{{name=" + char.get("name") + "'s Skills}} ";
        // get attributes associated with character
        let attributes = findObjs({
            _type: "attribute",
            _characterid: char.get("id"),
        });
        // if attribute name starts with "skill-" and is greater than 0,
        //   add it to the skillString
        _.each(attributes, function(att){
            let attName = att.get("name");
            let attCurrent = att.get("current");
            if(attName.indexOf("skill-") !== -1 && attCurrent > 0){
                log("Found attribute: " + attName);
                let skillName = attName.replace("skill-","");
                log("Modified attribute name: " + skillName);
                skillString += getOutputBySkill(skillName, attCurrent);
            }
        });
        skillString += "{{Default=[[1d20]]}}"
        
        sendChat("character|" + char.get("id"), "/w gm &{template:default} " + skillString);
    }
});
