let weaponList = {
    "arcpistolstatic":{"id":"arcpistolstatic","name":"Arc Pistol, Static", "damage":"1d6", "damageType":"E", "critical effect":"Arc", "critical effect damage":"[[2]]", "toHitAttribute":"dexterity", "special":"Stun","ammo":"charge","capacity":20,"usage":2}, 
    "artillerylaserazimuth":{"id":"artillerylaserazimuth","name":"Artillery Laser, Azimuth", "damage":"1d10", "damageType":"F", "critical effect":"burn", "critical effect damage":"1d6", "toHitAttribute":"dexterity", "special":"Penetrating","ammo":"charge","capacity":20,"usage":2},
    "club":{"id":"club","name":"Club", "damage":"1d6", "damageType":"B", "toHitAttribute":"strength", "toDamageAttribute":"strength", "special":"Analog, archaic"}, 
    "hammerassault":{"id":"hammerassault","name":"Hammer, Assault", "damage":"1d6", "damageType":"B", "toHitAttribute":"strength", "toDamageAttribute":"strength", "special":"Analog"},
    "huchketrifle":{"id":"huchketrifle","name":"Huchket Rifle", "damage":"1d10", "damageType":"P", "critical effect":"wound", "critical effect damage":"1t[CriticalWounds]", "toHitAttribute":"dexterity","ammo":"round","capacity":6,"usage":1}, 
    "laserpistolazimuth":{"id":"laserpistolazimuth","name":"Laser Pistol, Azimuth", "damage":"1d4", "damageType":"F", "critical effect":"burn", "critical effect damage":"1d4", "toHitAttribute":"dexterity","ammo":"charge","capacity":40,"usage":1}, 
    "laserrifleazimuth":{"id":"laserrifleazimuth","name":"Laser Rifle, Azimuth", "damage":"1d8", "damageType":"F", "critical effect":"burn", "critical effect damage":"1d6", "toHitAttribute":"dexterity","ammo":"charge","capacity":40,"usage":2}, 
    "longsword":{"id":"longsword","name":"Longsword", "damage":"1d8", "damageType":"S", "toHitAttribute":"strength", "toDamageAttribute":"strength", "special":"Analog"}, 
    "semiautopistoltactical":{"id":"semiautopistoltactical","name":"Semi-Auto Pistol, Tactical", "damage":"1d6", "damageType":"P", "toHitAttribute":"dexterity","ammo":"round","capacity":9,"usage":1}, 
    "shockrevolverlvl4":{"id":"shockrevolverlvl4","name":"Shock Revolver, Level 4", "damage":"1d8", "damageType":"E", "critical effect":"Arc", "critical effect damage":"[[1d4]]", "toHitAttribute":"dexterity","ammo":"charge","capacity":8,"usage":1}, 
    "survivalknife":{"id":"survivalknife","name":"Survival Knife", "damage":"1d4", "damageType":"S", "toHitAttribute":"strength", "toDamageAttribute":"strength", "special":"Operative"}, 
    "unarmedstrike":{"id":"unarmedstrike","name":"Unarmed Strike", "damage":"1d3", "damageType":"B", "toHitAttribute":"strength", "toDamageAttribute":"strength", "special":"Archaic, nonlethal"}, 
};
let grenadeList = {
    "cryogrenade1":{"id":"cryogrenade1","name":"Cryo Grenade I", "level":"6", "effect":"[[1d8]] C, staggered [[1]] round, 10 ft."},
    "flashgrenade1":{"id":"flashgrenade1","name":"Flash Grenade I", "level":"2", "effect":"blinded [[1d4]] rounds, 5 ft."},
    "flashgrenade2":{"id":"flashgrenade2","name":"Flash Grenade II", "level":"6", "effect":"blinded [[1d4]] rounds, 10 ft."},
    "fraggrenade1":{"id":"fraggrenade1","name":"Frag Grenade I", "level":"1", "effect":"[[1d6]] P, 15 ft."},
    "fraggrenade2":{"id":"fraggrenade2","name":"Frag Grenade II", "level":"4", "effect":"[[2d6]] P, 15 ft."},
    "incendiarygrenade1":{"id":"incendiarygrenade1","name":"Incendiary Grenade I", "level":"2", "effect":"[[1d6]] F, [[1d4]] burn, 5 ft."},
    "incendiarygrenade2":{"id":"incendiarygrenade2","name":"Incendiary Grenade II", "level":"6", "effect":"[[2d6]] F, [[1d6]] burn, 10 ft."},
    "screamergrenade1":{"id":"screamergrenade1","name":"Screamer Grenade I", "level":"4", "effect":"[[1d10]] So, deafened [[1d4]] minutes, 15 ft."},
    "shockgrenade1":{"id":"shockgrenade1","name":"Shock Grenade I", "level":"1", "effect":"[[1d8]] E, 15 ft."},
    "shockgrenade2":{"id":"shockgrenade2","name":"Shock Grenade II", "level":"4", "effect":"[[1d12]] E, 15 ft."},
    "smokegrenade":{"id":"smokegrenade","name":"Smoke Grenade", "level":"1", "effect":"smoke cloud 1 min., 20 ft."},
    "stickybombgrenade1":{"id":"stickybombgrenade1","name":"Stickybomb Grenade I", "level":"1", "effect":"entangled [[2d4]] rounds, 10 ft."},
    "stickybombgrenade2":{"id":"stickybombgrenade2","name":"Stickybomb Grenade II", "level":"4", "effect":"entangled [[2d4]] rounds, 15 ft."},
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

function weaponChoices(){
    let weaponString = "";
    _.each(weaponList, function(weapon){
        weaponString += "[" + weapon["name"] + "](!newweapon " + weapon["id"] + ") ";
    });
    return weaponString;
}

function grenadeChoices(){
    let grenadeString = "";
    _.each(grenadeList, function(grenade){
        grenadeString += "[" + grenade["name"] + "](!newweapon " + grenade["id"] + ") ";
    });
    return grenadeString;
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
        let char = null;
        if(msg.who != "Cal C. (GM)"){
            char = getChar(msg.who);
            if(char == null){
                sendMessage(getChar("Clippy"), null, "Who just tried to use a weapon?" + 
                    " I don't know youuuuuuuuuu!");
                return;
            }
        }
        
        let rawInput = msg.content.replace("!useweapon ","");
        if(rawInput.length <= 0) return;
        let input = rawInput.split(" ");
        let weapon = weaponList[input[0].toLowerCase()];
        if(weapon == undefined){
            sendMessage(getChar("Clippy"), char, "That sounds like a dope gun...too bad I've never heard of it... :/ You said: " + input[0]);
            return;
        }
        
        // Check for all parameters sent
        // valid parameters are: 'charname' and 'tohitbonus'
        let chatToHitBonus = 0;
        let chatDamageBonus = 0;
        _.each(input, function(param){
            if(param.indexOf("charname") != -1){
                char = getChar(param.split("=")[1]);
            }else if(param.indexOf("tohitbonus") != -1){
                log("ModularWeapons / main / chatBonus / recognized 'tohitbonus'");
                log("ModularWeapons / main / chatBonus / parameter: " + param);
                let bonus = param.split("=")[1]
                log("ModularWeapons / main / chatBonus / bonus: " + bonus);
                let intSubString = parseInt(bonus.slice(1));
                if(bonus.charAt(0) == '+' ){
                    if(intSubString){
                        chatToHitBonus = intSubString;
                    }
                }else if(bonus.charAt(0) == '-'){
                    if(intSubString){
                        chatToHitBonus = -intSubString;
                    }
                }else{
                    sendMessage(getChar("Clippy"), char, "I'm not sure what the 'tohitbonus'" +
                        "you're sending me means. You said: " + bonus + "; the bonus should " + 
                        "start with + or - and be followed by an integer.")
                }
            }else if(param.indexOf("damagebonus") != -1){
                let bonus = param.split("=")[1]
                let intSubString = parseInt(bonus.slice(1));
                if(bonus.charAt(0) == '+' ){
                    if(intSubString){
                        chatDamageBonus = intSubString;
                    }
                }else if(bonus.charAt(0) == '-'){
                    if(intSubString){
                        chatDamageBonus = -intSubString;
                    }
                }else{
                    sendMessage(getChar("Clippy"), char, "I'm not sure what the 'damagebonus'" +
                        "you're sending me means. You said: " + bonus + "; the bonus should " + 
                        "start with + or - and be followed by an integer.")
                }
            }
        });
        if(char == null){
            sendMessage(getChar("Clippy"), getChar("Clippy"), "Who dafuq is trying to shoot?");
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
            let str = parseInt(Math.floor((getAttrByName(char.get("id"), "attribute-strength")-10)/2));
            if(dex > str) attributeBonus = dex;
            else attributeBonus = str;
        }else attributeBonus = parseInt(Math.floor((getAttrByName(char.get("id"), "attribute-" + weapon["toHitAttribute"])-10)/2));
        let toHitBonus = attributeBonus + chatToHitBonus;
        
        // Pull the Base Attack Bonus
        if (getAttrByName(char.get("id"), "baseattackbonus") != undefined){
            toHitBonus += parseInt(getAttrByName(char.get("id"), "baseattackbonus"));
        }
        log("ModularWeapons / main / toHitBonus: " + toHitBonus);
        
        // Gather the damage dice and bonuses
        let damageBase = weapon["damage"];
        let damageBonus = 0 + chatDamageBonus;
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
        
        if(char.get("name") == "Delta 1"){
            specialString += "{{Trick Attack=[Click Here](!trickattack 1d4)}}";
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
        
        // Check for all parameters sent
        // valid parameters are: 'charname' and 'tohitbonus'
        let chatBonus = 0;
        _.each(input, function(param){
            if(param.indexOf("charname") != -1){
                char = getChar(param.split("=")[1]);
            }else if(param.indexOf("tohitbonus") != -1){
                log("ModularWeapons / main / chatBonus / recognized 'tohitbonus'");
                log("ModularWeapons / main / chatBonus / parameter: " + param);
                let bonus = param.split("=")[1]
                log("ModularWeapons / main / chatBonus / bonus: " + bonus);
                let intSubString = parseInt(bonus.slice(1));
                if(bonus.charAt(0) == '+' ){
                    if(intSubString){
                        chatBonus = intSubString;
                    }
                }else if(bonus.charAt(0) == '-'){
                    if(intSubString){
                        chatBonus = -intSubString;
                    }
                }else{
                    sendMessage(getChar("Clippy"), char, "I'm not sure what the 'tohitbonus'" +
                        "you're sending me means. You said: " + bonus + "; the bonus should " + 
                        "start with + or - and be followed by an integer.")
                }
            }
        });
        if(char == null){
            sendMessage(getChar("Clippy"), null, "Who just tried to use a weapon?" + 
                " I don't know youuuuuuuuuu!");
            return;
        }
        
        // Calculate the hit die
        let toHitDie = randomInteger(20);
        if(getAttrByName(char.get("id"), "attribute-strength") == undefined){
            sendChat("character|" + getChar("Clippy").get("id"), "/w " + char.get("name") + " Bruh. This character is missing its Strength attribute.");
            return;
        }
        let toHitBonus = parseInt(Math.floor((getAttrByName(char.get("id"), "attribute-strength")-10)/2)) + chatBonus;
        if (getAttrByName(char.get("id"), "baseattackbonus") != undefined){
            toHitBonus += parseInt(getAttrByName(char.get("id"), "baseattackbonus"));
        }
        
        // Gather the damage dice and bonuses
        let effect = grenade["effect"];
        if(getAttrByName(char.get("id"), "attribute-dexterity") == undefined){
            sendChat("character|" + getChar("Clippy").get("id"), "/w " + char.get("name") + " Bruh. This character is missing its Dexterity attribute.");
            return;
        }
        let reflexSave = "{{Reflex Save=half; DC [[10+" + Math.floor(grenade["level"]/2) + "+" + Math.floor((getAttrByName(char.get("id"), "attribute-dexterity")-10)/2) + "]]}}";
        
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
        
    }else if(msg.content.indexOf("!trickattack ") !== -1){
        let char = getChar(msg.who);
        let rawInput = msg.content.replace("!trickattack ","");
        if(rawInput.length <= 0) return;
        let input = rawInput.split(" ");
        sendMessage(char, null, "&{template:default} {{name=" + char.get("name") + " / Trick Attack}} {{Damage=[[" + input[0] + "]]}}");
        
    }else if(msg.content.indexOf("!fireweapon") !== -1){
        let char = getChar(msg.who);
        if(char == null){
            sendMessage(getChar("Clippy"), null, "Who just tried to use a weapon?" + 
                " I don't know youuuuuuuuuu!");
            return;
        }
        sendMessage(getChar("Clippy"), char, "Please update your weapon macro from '!fireweapon' to '!useweapon'. Yeah, I know it's pedantic, but " +
            "it's for the greater good.");
    }else if(msg.content.indexOf("!addweapon") !== -1){
        let char = getChar(msg.who);
        if(char == null){
            sendMessage(getChar("Clippy"), null, "Who just tried to add a weapon?" + 
                " I don't know youuuuuuuuuu!");
            return;
        }
        
        let rawInput = msg.content.replace("!addweapon","");
        if(rawInput.length <= 0){
            sendMessage(getChar("Clippy"), char, "Select weapon for anything other than a grenade. [Weapon](!addweapon weapon) [Grenade](!addweapon grenade)");
        }
        let input = rawInput.split(" ");
        
        _.each(input, function(param){
            if(param.indexOf("weapon") != -1){
                sendMessage(getChar("Clippy"), char, "Select your weapon. Ammo and macro will (probably) be auto configured.") 
                sendMessage(getChar("Clippy"), char, weaponChoices());
            }else if(param.indexOf("grenade") != -1){
                sendMessage(getChar("Clippy"), char, "Select your grenade. Macro will (probably) be auto configured.")
                sendMessage(getChar("Clippy"), char, grenadeChoices());
            }
        });
        
    }else if(msg.content.indexOf("!newweapon ") !== -1){
        let char = getChar(msg.who);
        let rawInput = msg.content.replace("!newweapon ","");
        if(rawInput.length <= 0) return;
        let input = rawInput.split(" ");
        let newWeaponName = input[0];
        let isGrenade = false, isWeapon = false;
        if(weaponList[newWeaponName.toLowerCase()] == undefined){
            if(grenadeList[newWeaponName.toLowerCase()] == undefined){
                sendMessage(getChar("Clippy"), char, "This is awkward. I don't know what a ' " + newWeaponName + "' is.");
                return;
            }else isGrenade = true;
        }else isWeapon = true;
        
        _.each(input, function(param){
            if(param.indexOf("charname") != -1){
                char = getChar(param.split("=")[1]);
            }
        });
        
        if(char == null){
            sendMessage(getChar("Clippy"), null, "Who just tried to add a weapon?" + 
                " I don't know youuuuuuuuuu!");
            return;
        }
        
        if(isWeapon){
            let weapon = weaponList[newWeaponName.toLowerCase()];
            let macroString = "!useweapon " + weapon["id"];
            if(weapon["ammo"]){
                createObj("attribute", {
                    name: "ammo-" + weapon["id"],
                    current: weapon["capacity"],
                    max: weapon["capacity"],
                    characterid: char.id
                });
                macroString += " HITENTERHERE!ammo @{character_id} ammo-" + weapon["id"] + " -" + 
                    weapon["usage"] + " " + weapon["ammo"];
            }
            createObj("ability", {
                name: "Attack-" + weapon["id"],
                action: macroString,
                istokenaction: true,
                characterid: char.id,
            });
            if(weapon["ammo"]){
                sendMessage(getChar("Clippy"), char, "Added! " +
                    "Open up your macro and replace the ALL CAPS text with a carriage return (hit enter).");
            }else sendMessage(getChar("Clippy"), char, "Added! EZ-PZ. I mean, you should double check it...");
        }else{
            let grenade = grenadeList[newWeaponName.toLowerCase()];
            createObj("attribute", {
                name: "ammo-" + grenade["id"],
                current: 1,
                characterid: char.id
            });
            let macroString = "!throwgrenade " + grenade["id"] + " HITENTERHERE!ammo " +
                "@{character_id} ammo-" + grenade["id"] + " -1 grenade";
            
            createObj("ability", {
                name: "Grenade-" + grenade["id"],
                action: macroString,
                istokenaction: true,
                characterid: char.id,
            });
            sendMessage(getChar("Clippy"), char, "Added! " +
                "Open up your macro and replace the ALL CAPS text with a carriage return (hit enter).");
        }
    }
});
