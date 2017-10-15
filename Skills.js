let skillList = {"acrobatics":"dexterity", "athletics":"strength", 
    "bluff":"charisma", "computers":"intelligence", "culture":"intelligence", 
    "diplomacy":"charisma", "disguise":"charisma", "engineering":"intelligence", 
    "intimidate":"charisma", "lifescience":"intelligence", "medicine":"intelligence", 
    "mysticism":"wisdom", "perception":"wisdom", "physicalscience":"intelligence", 
    "piloting":"dexterity", "profession00":"unknown", "profession01":"unknown", 
    "sensemotive":"wisdom", "sleightofhand":"dexterity", "stealth":"dexterity", 
    "survival":"wisdom",
};

function getChar(charName){
    let character = findObjs({
        _type: "character",
        name: charName,
    })[0];
    if(character != undefined) return character;
    
    switch(charName){
        case 'Player Account': 
            return findObjs({_type: "character",name: "Teste McButtface",})[0];
        case 'Rogue Physicist':
            return findObjs({_type: "character",name: "Riemann 2",})[0];
        case 'Logan G.':
            return findObjs({_type: "character",name: "Delta",})[0];
        case 'Josh F.':
            return findObjs({_type: "character",name: "Leb",})[0];
        case 'Ryan K.':
            return findObjs({_type: "character",name: "Roze",})[0];
        default:
            return null;
    }
}

function sendMessage(from, to, msg){
    let whisper = "";
    if(to != null) whisper = "/w " + to.get("name").split(" ")[0];
    sendChat("character|" + from.get("id"), whisper + " " + msg);
}

function errorBadSkill(input, character){
    sendMessage(getChar("Clippy"), character, "Hi there! It looks like you're " + 
        "trying to roll a skill, but you must be too stupid to get the syntax " + 
        "correct! Your skill input was: '" + input + "', but that ain't a skill.")
}

function capitalizeFirst(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function fixSkillName(skill){
    switch(skill){
        case "lifescience":
            return "Life Science";
        case "physicalscience":
            return "Physical Science";
        case "sensemotive":
            return "Sense Motive";
        case "sleightofhand":
            return "Sleight of Hand";
        default:
            return capitalizeFirst(skill);
    }
}

function rollCheck(char, skill, bonus){
    sendMessage(char, null, "&{template:default} {{name=" + char.get("name") + "}} {{" +
        fixSkillName(skill) + " Check=[[1d20+" + bonus + "]]}}")
}

// Syntax: !skill [SKILL_NAME] [optional modifier]
// Example: !skill perception +2
// Example: !skill stealth
on("chat:message", function(msg){
    if(msg.type != "api") return;
    
    if(msg.content.indexOf("!skill ") !== -1){
        let char = getChar(msg.who);
        if(char == null) {
            sendMessage(getChar("Clippy"), null, "Who just tried to roll a skill check?" +
                " I don't know youuuuuuu!");
            return;
        }
        let chatBonus = 0, attBonus = 0, skRanks = 0, skBonus = 0;
        let skillName = "";
        
        let rawInput = msg.content.replace("!skill ","");
        // Make sure there is something listed where the skill should be
        if(rawInput.length <= 0) return;
        let input = rawInput.split(" ");
        skillName = input[0];
        // Make sure what is listed first is a skill
        if(skillList[skillName] == undefined){
            errorBadSkill(skillName, char);
            return;
        }
        // Get skill bonus from attributes
        skBonus = parseInt(getAttrByName(char.get("id"), "skill-" + skillName, "max"));
        if(isNaN(skBonus)) skBonus = 0;
        // Get skill ranks
        skRanks = parseInt(getAttrByName(char.get("id"), "skill-" + skillName, "current"));
        if(isNaN(skRanks)) skRanks = 0;
        // get attribute bonus
        attBonus = parseInt(Math.floor(getAttrByName(char.get("id"), "attribute-" + skillList[skillName])-10)/2);
        if(isNaN(attBonus)) attBonus = 0;
        // Check for bonus typed into chat
        if(input[1] != undefined){
            intSubString = parseInt(input[1].slice(1));
            if(input[1].charAt(0) == '+' ){
                if(intSubString){
                    chatBonus = intSubString;
                }
            }else if(input[1].charAt(0) == '-'){
                if(intSubString){
                    chatBonus = -intSubString;
                }
            }else{
                sendMessage(getChar("Clippy"), char, "Yo - imma roll this check for you, " +
                    "but I'm not including the bonus you typed. I don't recognize this: " + 
                    input[1]);
            }
        }
        
        log("Skills / Character: " + char.get("name"));
        log("Skills / skBonus: " + skBonus);
        log("Skills / skRanks: " + skRanks);
        log("Skills / attBonus: " + attBonus);
        log("Skills / chatBonus: " + chatBonus);
        
        rollCheck(char, skillName, skBonus + skRanks + attBonus + chatBonus);
    }
});
