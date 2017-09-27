let weaponList = {
    "laserPistolAzimuth":{"name":"Laser Pistol, Azimuth", "damage":"1d4", "critical effect":"burn", "critical effect damage":"1d4", "toHitAttribute":"dexterity"}, 
    "laserRifleAzimuth":{"name":"Laser Rifle, Azimuth", "damage":"1d8", "critical effect":"burn", "critical effect damage":"1d6", "toHitAttribute":"dexterity"}, 
    "semiautopistoltactical":{"name":"Semi-Auto Pistol, Tactical", "damage":"1d6","toHitAttribute":"dexterity"}, 
    "longsword":{"name":"Longsword", "damage":"1d8","toHitAttribute":"strength", "toDamageAttribute":"strength"}, 
    "survivalknife":{"name":"Survival Knife", "damage":"1d4", "toHitAttribute": "strength", "toDamageAttribute":"strength"}
};

// find character sent via API call
function getChar(charName){
    return findObjs({
        _type: "character",
        name: charName,
    })[0];
}

// Syntax: !fireweapon [CHARACTER_NAME] --[WEAPON]
// Example: !skillChecks Manticore --laserpistolazimuth

on("chat:message", function(msg){
    if(msg.type != "api") return;
    
    if(msg.content.indexOf("!fireweapon ") !== -1){
        let input = msg.content.replace("!fireweapon ","").split(" --");
        let char = getChar(input[0]);
        let weapon = weaponList[input[1].toLowerCase().replace(/-/,"").replace(/,/,"").replace(/-/,"").replace(/ /,"")];
        let toHitDie = randomInteger(20);
        let toHitBonus = parseInt(Math.floor((getAttrByName(char.get("id"), "attribute-" + weapon["toHitAttribute"])-10)/2)) + 
            parseInt(getAttrByName(char.get("id"), "baseattackbonus"));
        let damageBase = weapon["damage"];
        let damageBonus = parseInt(Math.floor((getAttrByName(char.get("id"), "attribute-" + weapon["toDamageAttribute"])-10)/2));
        let whisper = "";
        let criticalString = "";
        
        if(char.get("npc") == "yes"){
            whisper = "/w gm ";
            damageBonus += parseInt(getAttrByName(char.get("id"), "damagebonus"));
        }
        
        if (toHitDie == 20){
            damageBase += " + " + weapon["damage"];
            criticalString += "{{Critical!=";
            if(weapon["critical effect"]){
                criticalString += weapon["critical effect"];
            }
            if(weapon["critical effect damage"]){
                criticalString += " [[" + weapon["critical effect damage"] + "]]";
            }
            criticalString += "}}";
        }
        
        sendChat("character|" + char.get("id"), whisper + "&{template:default} {{name=" + char.get("name") + " / " + 
            weapon["name"] + "}} {{To Hit=[[" + toHitDie + " + " + toHitBonus + "]]}} {{Damage=[[" + damageBase + 
            "]]}} " + criticalString);
    }
});
