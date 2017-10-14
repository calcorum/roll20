let skillList = ["acrobatics", "athletics", "bluff", "computers", "culture", 
    "diplomacy", "disguise", "engineering", "intimidate", "lifescience", 
    "medicine", "mysticism", "perception", "physicalscience", "piloting", 
    "profession00", "profession01", "sensemotive", "sleightofhand",
    "stealth", "survival"];

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
    if(to != null) whisper = "/w " + to;
    sendChat("character|" + getChar(from).get("id"), whisper + msg);
}

function errorBadSkill(input, character){
    sendMessage(getChar("Clippy"), character, "Hi there! It looks like you're " + 
        "trying to roll a skill, but you must be too stupid to get the syntax " + 
        "correct! Your skill input was: '" + input + "', but that ain't a skill.")
}

// Syntax: !skill [SKILL_NAME] [optional modifier]
// Example: !skill perception +2
// Example: !skill stealth
on("chat:message", function(msg){
    if(msg.type != "api") return;
    
    if(msg.content.indexOf("!skill ") !== -1){
        let char = getChar(msg.who);
        let rawInput = msg.content.replace("!skill ","");
        // Make sure there is something listed where the skill should be
        if(rawInput.length <= 0) return;
        let input = rawInput.split(" ");
        // Make sure what is listed first is a skill
        if(skillList.indexOf(input[0]) == -1){
            errorBadSkill(input[0], char);
            return;
        }
        
    }
});
