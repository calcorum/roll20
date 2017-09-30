let weaponList = {
    "laserpistolazimuth":{"name":"Laser Pistol, Azimuth", "damage":"1d4", "damageType":"F", "critical effect":"burn", "critical effect damage":"1d4", "toHitAttribute":"dexterity"}, 
    "laserrifleazimuth":{"name":"Laser Rifle, Azimuth", "damage":"1d8", "damageType":"F", "critical effect":"burn", "critical effect damage":"1d6", "toHitAttribute":"dexterity"}, 
    "semiautopistoltactical":{"name":"Semi-Auto Pistol, Tactical", "damage":"1d6", "damageType":"P", "toHitAttribute":"dexterity"}, 
    "longsword":{"name":"Longsword", "damage":"1d8", "damageType":"S", "toHitAttribute":"strength", "toDamageAttribute":"strength", "special":"Analog"}, 
    "survivalknife":{"name":"Survival Knife", "damage":"1d4", "damageType":"S", "toHitAttribute":"strength", "toDamageAttribute":"strength"}, 
    "artillerylaserazimuth":{"name":"Artillery Laser, Azimuth", "damage":"1d10", "damageType":"F", "critical effect":"burn", "critical effect damage":"1d6", "toHitAttribute":"dexterity", "special":"Penetrating"},
    "huchketrifle":{"name":"Huchket Rifle", "damage":"1d10", "damageType":"P", "critical effect":"wound", "critical effect damage":"1t[CriticalWounds]", "toHitAttribute":"dexterity"}, 
    "membraneholdoutpistol":{"name":"Membrane Holdout Pistol", "damage":"1d6", "damageType":"F", "critical effect":"burn", "critical effect damage":"1d6", "toHitAttribute":"dexterity"}, 
    "club":{"name":"Club", "damage":"1d6", "damageType":"B", "toHitAttribute":"strength", "toDamageAttribute":"strength", "special":"Analog, archaic"}, 
    "hammerassault":{"name":"Hammer, Assault", "damage":"1d6", "damageType":"B", "toHitAttribute":"strength", "toDamageAttribute":"strength", "special":"Analog"},
    "unarmedstrike":{"name":"Unarmed Strike", "damage":"1d3", "damageType":"B", "toHitAttribute":"strength", "toDamageAttribute":"strength", "special":"Archaic, nonlethal"}, 
};
let grenadeList = {
    "fraggrenade1":{"name":"Frag Grenade I", "level":"1", "effect":"[[1d6]] P, 15 ft."},
    "shockgrenade1":{"name":"Shock Grenade I", "level":"1", "effect":"[[1d8]] E, 15 ft."},
    "smokegrenade":{"name":"Smoke Grenade", "level":"1", "effect":"smoke cloud 1 min., 20 ft."},
    "stickybombgrenade1":{"name":"Stickybomb Grenade I", "level":"1", "effect":"entangled [[2d4]] rounds, 10 ft."},
    "flashgrenade1":{"name":"Flash Grenade I", "level":"1", "effect":"blinded [[1d4]] rounds, 5 ft."},
    "incendiarygrenade1":{"name":"Incendiary Grenade I", "level":"1", "effect":"[[1d6]] F, [[1d4]] burn, 5 ft."},
};

// find character sent via API call
function getChar(charName){
    return findObjs({
        _type: "character",
        name: charName,
    })[0];
}

// Syntax: !fireweapon [CHARACTER_ID] --[WEAPON]
// Example: !fireweapon @{character_id} --laserpistolazimuth

on("chat:message", function(msg){
    if(msg.type != "api") return;
    
    if(msg.content.indexOf("!fireweapon ") !== -1){
        let rawInput = msg.content.replace("!fireweapon ","");
        if(rawInput.indexOf(" --") !== -1){
            let input = rawInput.split(" --");
            let char = getObj('character',input[0]);
            let weapon = weaponList[input[1].toLowerCase()];
            // Parameter checks
            if(char == undefined){
                sendChat("character|" + getChar("Clippy").get("id"), "Jesus Christopher...whoever just tried to shoot a gun is sending me an invalid character name.");
                return;
            }else if(weapon == undefined){
                sendChat("character|" + getChar("Clippy").get("id"), "/w " + char.get("name") + " That sounds like a dope gun...too bad I've never heard of it... :/ You said: " + input[1]);
                return;
            }
            
            // Calculate the hit die
            let toHitDie = randomInteger(20);
            if(getAttrByName(char.get("id"), "attribute-" + weapon["toHitAttribute"]) == undefined){
                sendChat("character|" + getChar("Clippy").get("id"), "/w " + char.get("name") + " Bruh. This character is missing its To-Hit attribute.");
                return;
            }
            let toHitBonus = parseInt(Math.floor((getAttrByName(char.get("id"), "attribute-" + weapon["toHitAttribute"])-10)/2));
            if (getAttrByName(char.get("id"), "baseattackbonus") != undefined){
                toHitBonus += parseInt(getAttrByName(char.get("id"), "baseattackbonus"));
            }
            
            // Gather the damage dice and bonuses
            let damageBase = weapon["damage"];
            let damageBonus = 0;
            if (weapon["toDamageAttribute"]){
                damageBonus += parseInt(Math.floor((getAttrByName(char.get("id"), "attribute-" + weapon["toDamageAttribute"])-10)/2));
            }
            let whisper = "";
            let specialString = "";
            let criticalString = "";
            
            if(getAttrByName(char.get("id"), "npc") == "yes"){
                whisper = "/w gm ";
                damageBonus += parseInt(getAttrByName(char.get("id"), "damagebonus"));
            }
            
            if(weapon["special"] != undefined){
                specialString += "{{Special=" + weapon["special"];
                if(weapon["specialDice"]){
                    specialString += " [[" + weapon["specialDice"] + "]]";
                }
                specialString += "}}";
            }
            
            if (toHitDie == 20){
                damageBase += "+" + weapon["damage"] + "+" + damageBonus;
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
                weapon["name"] + "}} {{To Hit=[[" + toHitDie + " + " + toHitBonus + "]]}} {{Damage=[[" + 
                damageBase + "+" + damageBonus + "]] " + weapon["damageType"] + "}} " + specialString + criticalString );
        }else sendChat("character|" + getChar("Clippy").get("id"), "/w " + msg.who + " Oh my god, what a loser. You fucked the gun syntax up...again.")
        
    }else if(msg.content.indexOf("!throwgrenade ") !== -1){
        let rawInput = msg.content.replace("!throwgrenade ","");
        if(rawInput.indexOf(" --") !== -1){
            let input = rawInput.split(" --");
            let char = getObj('character',input[0]);
            let grenade = grenadeList[input[1].toLowerCase()];
            // Parameter checks
            if(char == undefined){
                sendChat("character|" + getChar("Clippy").get("id"), "Bruh...whoever just tried to throw a grenade is sending me an invalid character name.");
                return;
            }else if(grenade == undefined){
                sendChat("character|" + getChar("Clippy").get("id"), "/w " + char.get("name") + " Sorry, bro, I've got no clue what grenade you're throwing :/")
                sendChat("character|" + getChar("Clippy").get("id"), "/w " + char.get("name") + " You said: '" + input[1] +"'. Maybe you forgot to change the roman numeral (IV) to its value (4)?");
                return;
            }
            
            // Calculate the hit die
            let toHitDie = randomInteger(20);
            if(getAttrByName(char.get("id"), "attribute-strength") == undefined){
                sendChat("character|" + getChar("Clippy").get("id"), "/w " + char.get("name") + " Bruh. This character is missing its Strength attribute.");
                return;
            }
            let toHitBonus = parseInt(Math.floor((getAttrByName(char.get("id"), "attribute-strength")-10)/2));
            if (getAttrByName(char.get("id"), "baseattackbonus") != undefined){
                toHitBonus += parseInt(getAttrByName(char.get("id"), "baseattackbonus"));
            }
            
            // Gather the damage dice and bonuses
            let effect = grenade["effect"];
            if(getAttrByName(char.get("id"), "attribute-dexterity") == undefined){
                sendChat("character|" + getChar("Clippy").get("id"), "/w " + char.get("name") + " Bruh. This character is missing its Dexterity attribute.");
                return;
            }
            let reflexSave = "{{Reflex Save=half; DC [[10+" + grenade["level"] + "+" + Math.floor((getAttrByName(char.get("id"), "attribute-dexterity")-10)/2) + "]]}}";
            
            let whisper = "";
            if(getAttrByName(char.get("id"), "npc") == "yes"){
                whisper = "/w gm ";
            }
            
            sendChat("character|" + char.get("id"), whisper + "&{template:default} {{name=" + char.get("name") + " / " + 
                grenade["name"] + "}} {{To Hit=[[" + toHitDie + " + " + toHitBonus + "]]; DC 5}} {{Effect=" + effect +
                "}}" + reflexSave + " {{Scatter=[Roll Here](!&#13;#ThrownWeapon-Scatter)}}");
        }
    }else if(msg.content.indexOf("!addweapon ") !== -1){
        let rawInput = msg.content.replace("!addweapon ","");
        if(rawInput.indexOf(" --") !== -1){
        }
    }
});
