let weaponList = {
    "laserpistolazimuth":{"name":"Laser Pistol, Azimuth", "damage":"1d4", "damageType":"F", "critical effect":"burn", "critical effect damage":"1d4", "toHitAttribute":"dexterity"}, 
    "laserrifleazimuth":{"name":"Laser Rifle, Azimuth", "damage":"1d8", "damageType":"F", "critical effect":"burn", "critical effect damage":"1d6", "toHitAttribute":"dexterity"}, 
    "semiautopistoltactical":{"name":"Semi-Auto Pistol, Tactical", "damage":"1d6", "damageType":"P", "toHitAttribute":"dexterity"}, 
    "longsword":{"name":"Longsword", "damage":"1d8", "damageType":"S", "toHitAttribute":"strength", "toDamageAttribute":"strength", "special":"Analog"}, 
    "survivalknife":{"name":"Survival Knife", "damage":"1d4", "damageType":"S", "toHitAttribute":"strength", "toDamageAttribute":"strength", "special":"Operative"}, 
    "artillerylaserazimuth":{"name":"Artillery Laser, Azimuth", "damage":"1d10", "damageType":"F", "critical effect":"burn", "critical effect damage":"1d6", "toHitAttribute":"dexterity", "special":"Penetrating"},
    "huchketrifle":{"name":"Huchket Rifle", "damage":"1d10", "damageType":"P", "critical effect":"wound", "critical effect damage":"1t[CriticalWounds]", "toHitAttribute":"dexterity"}, 
    "membraneholdoutpistol":{"name":"Membrane Holdout Pistol", "damage":"1d6", "damageType":"F", "critical effect":"burn", "critical effect damage":"1d6", "toHitAttribute":"dexterity"}, 
    "club":{"name":"Club", "damage":"1d6", "damageType":"B", "toHitAttribute":"strength", "toDamageAttribute":"strength", "special":"Analog, archaic"}, 
    "hammerassault":{"name":"Hammer, Assault", "damage":"1d6", "damageType":"B", "toHitAttribute":"strength", "toDamageAttribute":"strength", "special":"Analog"},
    "unarmedstrike":{"name":"Unarmed Strike", "damage":"1d3", "damageType":"B", "toHitAttribute":"strength", "toDamageAttribute":"strength", "special":"Archaic, nonlethal"}, 
    "arcpistolstatic":{"name":"Arc Pistol, Static", "damage":"1d6", "damageType":"E", "critical effect":"Arc", "critical effect damage":"[[2]]", "toHitAttribute":"dexterity", "special":"Stun"}, 
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

// Syntax: !useweapon [WEAPON] [OPTIONAL_BONUS]
// Example: !useweapon laserpistolazimuth
// Example: !useweapon laserpistolazimuth +2

on("chat:message", function(msg){
    if(msg.type != "api") return;
    
    if(msg.content.indexOf("!useweapon ") !== -1){
        let char = getChar(msg.who);
        if(char == null){
            sendMessage(getChar("Clippy"), null, "Who just tried to use a weapon?" + 
                " I don't know youuuuuuuuuu!");
            return;
        }
        let rawInput = msg.content.replace("!useweapon ","");
        if(rawInput.length <= 0) return;
        let input = rawInput.split(" ");
        let weapon = weaponList[input[0].toLowerCase()];
        if(weapon == undefined){
            sendMessage(getChar("Clippy"), char, "That sounds like a dope gun...too bad I've never heard of it... :/ You said: " + input[0]);
            return;
        }
        // Calculate the hit die
        let toHitDie = randomInteger(20);
        // Check for an attribute in the character sheet
        if(getAttrByName(char.get("id"), "attribute-" + weapon["toHitAttribute"]) == undefined){
            sendChat("character|" + getChar("Clippy").get("id"), "/w " + char.get("name") + " Bruh. This character is missing its To-Hit attribute.");
            return;
        }
        // Pull the attribute bonus
        let attributeBonus = 0;
        if(weapon["special"] == "Operative"){
            let dex = parseInt(Math.floor((getAttrByName(char.get("id"), "attribute-dexterity")-10)/2));
            log("Modular Weapons / main / dex: " + dex);
            let str = parseInt(Math.floor((getAttrByName(char.get("id"), "attribute-strength")-10)/2));
            log("Modular Weapons / main / str: " + str);
            if(dex > str) attributeBonus = dex;
            else attributeBonus = str;
        }else attributeBonus = parseInt(Math.floor((getAttrByName(char.get("id"), "attribute-" + weapon["toHitAttribute"])-10)/2));
        let toHitBonus = attributeBonus;
        
        // Check for bonus typed into chat
        let chatBonus = 0;
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
        toHitBonus += chatBonus;
        
        // Pull the Base Attack Bonus
        if (getAttrByName(char.get("id"), "baseattackbonus") != undefined){
            toHitBonus += parseInt(getAttrByName(char.get("id"), "baseattackbonus"));
        }
        log("ModularWeapons / main / toHitBonus: " + toHitBonus);
        
        // Gather the damage dice and bonuses
        let damageBase = weapon["damage"];
        let damageBonus = 0;
        if (weapon["toDamageAttribute"]){
            damageBonus += parseInt(Math.floor((getAttrByName(char.get("id"), "attribute-" + weapon["toDamageAttribute"])-10)/2));
        }
        let whisperToGM = false;
        let specialString = "";
        let criticalString = "";
        
        if(getAttrByName(char.get("id"), "npc") == "yes"){
            whisperToGM = true;
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
        
        let messageRecipient = null;
        if(whisperToGM) messageRecipient = getChar("Clippy");
        
        sendMessage(char, messageRecipient, "&{template:default} {{name=" + char.get("name") + " / " + 
            weapon["name"] + "}} {{To Hit=[[" + toHitDie + " + " + toHitBonus + "]]}} {{Damage=[[" + 
            damageBase + "+" + damageBonus + "]] " + weapon["damageType"] + "}} " + specialString + criticalString);
        
    }else if(msg.content.indexOf("!throwgrenade ") !== -1){
        let char = getChar(msg.who);
        if(char == null){
            sendMessage(getChar("Clippy"), null, "Who just tried to use a weapon?" + 
                " I don't know youuuuuuuuuu!");
            return;
        }
        let rawInput = msg.content.replace("!throwgrenade ","");
        if(rawInput.length <= 0) return;
        let input = rawInput.split(" ");
        let grenadeName = input[0];
        let grenade = grenadeList[grenadeName.toLowerCase()];
        if(grenade == undefined){
            sendMessage(getChar("Clippy"), char, "Sorry, bro, I've got no clue what grenade you're throwing :/")
            sendMessage(getChar("Clippy"), char, "You said: '" + grenadeName +"'. Maybe you forgot to change the roman numeral (IV) to its value (4)?");
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
        
        let whisperToGM = false;
        if(getAttrByName(char.get("id"), "npc") == "yes"){
            whisperToGM = true;
        }
        
        let messageRecipient = null;
        if(whisperToGM) messageRecipient = getChar("Clippy");
        
        sendMessage(char, messageRecipient, "&{template:default} {{name=" + char.get("name") + " / " + 
            grenade["name"] + "}} {{To Hit=[[" + toHitDie + " + " + toHitBonus + "]]; DC 5}} {{Effect=" + effect +
            "}}" + reflexSave + " {{Scatter=[Roll Here](!thrownscatter)}}")
            
    }else if(msg.content.indexOf("!thrownscatter") !== -1){
        let char = getChar(msg.who);
        let from = null;
        if(char != null) from = char
        
        sendMessage(from, null, "&{template:default} {{name=Thrown Weapon Scatter}} {{Scatter Roll:=[[1d8]]}} " + 
            "{{Scatter Chart:=[Click here](http://journal.roll20.net/handout/-KthZMTSVrge17fkMsil)}} {{Distance:=[[1d4]] squares}}");
        
    }else if(msg.content.indexOf("!addweapon") !== -1){
        let char = getChar(msg.who);
        if(char == null){
            sendMessage(getChar("Clippy"), null, "Who just tried to add a weapon?" + 
                " I don't know youuuuuuuuuu!");
            return;
        }
        sendMessage(getChar("Clippy"), char, "Select weapon for anything other than a grenade. [Weapon](!newweapon) [Grenade](!newgrenade)");
        log("Hopefully the character got a response from Clippy :)");
        
    }else if(msg.content.indexOf("!fireweapon") !== -1){
        let char = getChar(msg.who);
        if(char == null){
            sendMessage(getChar("Clippy"), null, "Who just tried to use a weapon?" + 
                " I don't know youuuuuuuuuu!");
            return;
        }
        sendMessage(getChar("Clippy"), char, "Please update your weapon macro from '!fireweapon' to '!useweapon'. Yeah, I know it's pedantic, but " +
            "it's for the greater good.");
    }else if(msg.content.indexOf("!newweapon") !== -1){
        let char = getChar(msg.who);
        if(char == null){
            sendMessage(getChar("Clippy"), null, "Who just tried to add a weapon?" + 
                " I don't know youuuuuuuuuu!");
            return;
        }
    }
});
