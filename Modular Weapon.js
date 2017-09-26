// find character sent via API call
function getChar(charName){
    return findObjs({
        _type: "character",
        name: charName,
    })[0];
}

// Syntax: !fireweapon [CHARACTER_NAME] [WEAPON_JSON]
// Example: !fireweapon @{character_name} {"name": "Azimuth Laser Pistol", "damage":"1d4+1", 
//      "critical":"burn 1d4", "toHitAttribute": "dexterity","toDamageAttribute": "strength"}

on("chat:message", function(msg){
    if(msg.type != "api") return;
    
    if(msg.content.indexOf("!fireweapon ") !== -1){
        let input = msg.content.replace("!fireweapon ","");
        let weapStart = input.indexOf("{");
        let char = getChar(input.slice(0,weapStart-1));
        let attributes = getAttrs(char);
        let weapon = JSON.parse(input.slice(weapStart));
        let damage = weapon["damage"];
        let toHitRoll = randomInteger(20);
        let criticalEffect = "";
        
        if (toHitRoll == 20){
            if(weapon["critical"]){
                criticalEffect = " {{Critical Effect=" + weapon["critical"] + "}}";
            }
            damage += " + " + damage;
        }
        log("On the die: " + toHitRoll);
        
        switch(weapon["toHitAttribute"]){
            case "strength":
                toHitRoll += Math.floor((getAttrByName(char.get("id"), "attribute-strength")-10)/2);
                break;
            case "dexterity":
                toHitRoll += Math.floor((getAttrByName(char.get("id"), "attribute-dexterity")-10)/2);
                break;
        }
        
        log("Total roll: " + toHitRoll);
        
        sendChat("character|" + char.get("id"), "/w gm &{template:default} {{name=" + char.get("name") + " / " + 
            weapon["name"] + "}} {{To Hit=[[" + toHitRoll + "]]}} {{Damage=[[" + damage + 
            "]]}}" + criticalEffect);
    }
});
