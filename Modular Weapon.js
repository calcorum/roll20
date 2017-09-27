let laserPistolAzimuth = {"name":"Azimuth Laser Pistol", "damage":"1d4", "critical effect":"burn", "critical effect damage": "1d4", "toHitAttribute": "dexterity"};
let laserRifleAzimuth = {"name":"Azimuth Laser Rifle", "damage":"1d8", "critical effect":"burn", "critical effect damage": "1d6", "toHitAttribute": "dexterity"};
let weaponList = {"laserpistolazimuth":laserPistolAzimuth, "laserrifleazimuth":laserRifleAzimuth};

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
        let weapon = weaponList[input[1].toLowerCase().replace(" ","").replace(",","").replace("-","")];
        let toHitDie = randomInteger(20);
        let toHitBonus = Math.floor((getAttrByName(char.get("id"), "attribute-" + weapon["toHitAttribute"])-10)/2);
        let damageString = weapon["damage"];
        let criticalString = "";
        
        if (toHitDie == 20){
            damageString += " + " + weapon["damage"];
            if(weapon["critical effect damage"]){
                criticalString += "{{Critical!=" + weapon["critical effect"] + 
                    " [[" + weapon["critical effect damage"] + "]]}}";
            }
        }
        
        sendChat("character|" + char.get("id"), "/w gm &{template:default} {{name=" + char.get("name") + " / " + 
            weapon["name"] + "}} {{To Hit=[[" + toHitDie + " + " + toHitBonus + "]]}} {{Damage=[[" + damageString + 
            "]]}} " + criticalString);
    }
});
