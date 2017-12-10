function getAttribute(char, attrName, which="current"){
    let rawVal = getAttrByName(char.get("id"), attrName, which);
    if (isNaN(rawVal)) return rawVal;
    else return parseInt(rawVal);
}

function getChar(charName){
    let character = findObjs({
        _type: "character",
        name: charName,
    })[0];
    if(character) return character;
    switch(charName){
        case 'Player Account': 
            return findObjs({_type: "character",name: "Teste McButtface",})[0];
        case 'Rogue Physicist':
            return findObjs({_type: "character",name: "Riemann 2",})[0];
        case 'Logan G.':
            return findObjs({_type: "character",name: "Delta 1",})[0];
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
    if(to) whisper = "/w " + to.get("name").split(" ")[0];
    sendChat("character|" + from.get("id"), whisper + " " + msg);
}

function capitalizeFirst(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}
