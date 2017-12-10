const AUTOCRIT = false;
const WEAPONLOG = true;
const GRENADELOG = true;

function weaponChoices(){
    let weaponString = "";
    _.each(weaponList, function(weapon){
        weaponString += "<p>[" + weapon["name"] + "](!newweapon " + weapon["id"] + ")</p>";
    });
    return weaponString;
}

function grenadeChoices(){
    let grenadeString = "";
    _.each(grenadeList, function(grenade){
        grenadeString += "<p>[" + grenade["name"] + "](!newweapon " + grenade["id"] + ")</p>";
    });
    return grenadeString;
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
            if(WEAPONLOG) log("Modular Weapons / !useweapon / character: " + char.get("name"));
            if(!char){
                sendMessage(getChar("Clippy"), null, "Yikes...Somebody is trying to shoot. Who was that?");
                return;
            }
        }
        
        let rawInput = msg.content.replace("!useweapon ","");
        if(rawInput.length <= 0) return;
        let input = rawInput.split(" ");
        let weapon = weaponList[input[0].toLowerCase()];
        if(!weapon){
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
                if(WEAPONLOG) log("Modular Weapons / !useweapon / character: " + char.get("name"));
            }else if(param.indexOf("tohitbonus") != -1){
                if(WEAPONLOG) log("ModularWeapons / !useweapon / chatBonus / recognized 'tohitbonus'");
                if(WEAPONLOG) log("ModularWeapons / !useweapon / chatBonus / parameter: " + param);
                let bonus = param.split("=")[1]
                if(WEAPONLOG) log("ModularWeapons / !useweapon / chatBonus / bonus: " + bonus);
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
                if(WEAPONLOG) log("Modular Weapons / !useweapon / damagebonus / recognized 'damagebonus'");
                if(WEAPONLOG) log("Modular Weapons / !useweapon / damagebonus / parameter: " + param);
                let bonus = param.split("=")[1]
                if(WEAPONLOG) log("Modular Weapons / !useweapon / damagebonus / bonus: " + bonus);
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
        if(!char){
            sendMessage(getChar("Clippy"), getChar("Clippy"), "Who dafuq is trying to shoot?");
            return;
        }
        
        let toHitDie = 0;
        if(AUTOCRIT) toHitDie = 20;
        else{
            // Roll the hit die
            toHitDie = randomInteger(20);
            // Check for an attribute in the character sheet
            if(!getAttribute(char, "attribute-" + weapon["toHitAttribute"])){
                sendMessage(getChar("Clippy"), char, "Bruh. This character is missing its To-Hit attribute.");
                return;
            }
        }
        
        // Pull the attribute bonus
        let attributeBonus = 0;
        if(weapon["special"] == "Operative"){
            if(WEAPONLOG) log("Modular Weapons / !useweapon / weapon type: Operative");
            let dex = Math.floor((getAttribute(char, "attribute-dexterity")-10)/2);
            let str = Math.floor((getAttribute(char, "attribute-strength")-10)/2);
            if(WEAPONLOG) log("Modular Weapons / !useweapon / operative / dex: " + dex);
            if(WEAPONLOG) log("Modular Weapons / !useweapon / operative / str: " + str);
            if(dex > str) attributeBonus = dex;
            else attributeBonus = str;
        }else attributeBonus = Math.floor((getAttribute(char, "attribute-" + weapon["toHitAttribute"])-10)/2);
        let toHitBonus = attributeBonus + chatToHitBonus;
        if(WEAPONLOG) log("Modular Weapons / !useweapon / attribute to hit bonus: " + attributeBonus);
        
        // Check for weapon focus
        // Get comma-separated list of specializations from char attribute "weapon-specializations"
        let focusBonus = 0;
        if (getAttribute(char, "weapon-focus")){
            let focusCsv = getAttribute(char, "weapon-focus");
            let weaponFocuses = focusCsv.replace(" ","").split(",");
            _.each(weaponFocuses, function(focus){
                if (weapon["type"] == focus){
                    focusBonus = 1;
                    if(WEAPONLOG) log("Modular Weapons / !useweapon / focusBonus: " + focusBonus);
                }
            });
        }
        toHitBonus += focusBonus;
        
        // Pull the Base Attack Bonus
        if (getAttribute(char, "baseattackbonus")){
            let bab = getAttribute(char, "baseattackbonus");
            if(WEAPONLOG) log("Modular Weapons / !useweapon / bab: " + bab)
            toHitBonus += bab;
        }
        if(WEAPONLOG) log("Modular Weapons / !useweapon / toHitBonus: " + toHitBonus);
        
        // Gather the damage dice and bonuses
        let damageBase = weapon["damage"];
        let damageBonus = 0 + chatDamageBonus;
        if (weapon["toDamageAttribute"]){
            let attributeDamageBonus = Math.floor((getAttribute(char, "attribute-" + weapon["toDamageAttribute"])-10)/2);
            if(WEAPONLOG) log("Modular Weapons / !useweapon / attributeDamageBonus: " + attributeDamageBonus);
            damageBonus += attributeDamageBonus;
        }
        
        // Check for weapon specialization
        // Get comma-separated list of specializations from char attribute "weapon-specializations"
        let specBonus = 0;
        let charLevel = getAttribute(char, "characterlevel");
        if(WEAPONLOG) log("Modular Weapons / !useweapon / character level: " + charLevel);
        if(charLevel > 2){
            if (getAttribute(char, "weapon-specializations")){
                let specCsv = getAttribute(char, "weapon-specializations");
                let weaponSpecs = specCsv.split(",");
                _.each(weaponSpecs, function(specialization){
                    if (weapon["type"] == specialization){
                        if(WEAPONLOG) log("Modular Weapons / !useweapon / specialization: " + specialization);
                        if (weapon["type"] == "small-arms"){
                            specBonus = Math.floor(charLevel / 2);
                        }else{
                            specBonus = getAttribute(char, "characterlevel");
                        }
                        _.each(weapon["special"], function(special){
                           if (special == "Operative"){
                               specBonus = Math.floor(charLevel / 2);
                               if(WEAPONLOG) log("Modular Weapons / !useweapon / operative specBonus: " + specBonus);
                           }
                        });
                    }
                });
                log("Modular Weapons / !useweapon / weapon specialization bonus: " + specBonus);
            }
        }
        damageBonus += specBonus;
        
        let whisperToGM = false;
        let specialString = "";
        let criticalString = "";
        if(getAttribute(char, "npc") === "yes"){
            whisperToGM = true;
            let npcDamageBonus = getAttribute(char, "damagebonus");
            if(WEAPONLOG) log("Modular Weapons / !useweapon / npc damage bonus: " + npcDamageBonus);
            damageBonus += npcDamageBonus;
        }
        if(WEAPONLOG) log("Modular Weapons / !useweapon / damageBonus: " + damageBonus);
        
        if(weapon["special"] != undefined){
            specialString += "{{Special=" + weapon["special"];
            if(weapon["specialDice"]){
                specialString += " [[" + weapon["specialDice"] + "]]";
            }
            specialString += "}}";
        }
        
        // Check if char has trickattack-dice and, if so, add a button to roll it
        if(getAttribute(char, "trickattack-dice")){
            trickDice = getAttribute(char, "trickattack-dice");
            specialString += "{{Trick Attack=[Click Here](!trickattack " + trickDice + ")}}";
        }
        
        if (toHitDie == 20){
            if(WEAPONLOG) log("Modular Weapons / !useweapon / critical hit")
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
        let chatBonus = 0, toHitBonus = 0;
        _.each(input, function(param){
            if(param.indexOf("charname") != -1){
                char = getChar(param.split("=")[1]);
            }else if(param.indexOf("tohitbonus") != -1){
                if(GRENADELOG) log("ModularWeapons / main / chatBonus / recognized 'tohitbonus'");
                if(GRENADELOG) log("ModularWeapons / main / chatBonus / parameter: " + param);
                let bonus = param.split("=")[1]
                let intSubString = parseInt(bonus.slice(1));
                if(bonus.charAt(0) == '+' ){
                    if(intSubString){
                        chatBonus = intSubString;
                        if(GRENADELOG) log("ModularWeapons / main / chatBonus / bonus: " + chatBonus);
                    }
                }else if(bonus.charAt(0) == '-'){
                    if(intSubString){
                        chatBonus = -intSubString;
                        if(GRENADELOG) log("ModularWeapons / main / chatBonus / bonus: " + chatBonus);
                    }
                }else{
                    sendMessage(getChar("Clippy"), char, "I'm not sure what the 'tohitbonus'" +
                        "you're sending me means. You said: " + bonus + "; the bonus should " + 
                        "start with + or - and be followed by an integer.")
                }
            }
        });
        toHitBonus += chatBonus;
        
        if(!char){
            sendMessage(getChar("Clippy"), null, "Who just tried to throw a grenade?" + 
                " I don't know youuuuuuuuuu!");
            return;
        }
        
        // Calculate the hit die
        let toHitDie = randomInteger(20);
        
        // Get attribute bonus
        if(getAttribute(char, "attribute-strength")){
            let attrToHitBonus = Math.floor((getAttribute(char, "attribute-strength")-10)/2);
            if(GRENADELOG) log("Modular Weapons / !throwgrenade / attrToHitBonus: " + attrToHitBonus);
            toHitBonus += attrToHitBonus;
        }else{
            sendMessage(getChar("Clippy"), char, "Bruh. This character is missing its Strength attribute.");
            return;
        }
        
        // Get BAB
        if (getAttribute(char, "baseattackbonus")){
            let bab = getAttribute(char, "baseattackbonus");
            if(GRENADELOG) log("Modular Weapons / !throwgrenade / bab: " + bab);
            toHitBonus += bab;
        }
        
        if(GRENADELOG) log("Modular Weapons / !throwgrenade / toHitBonus: " + toHitBonus);
        
        // Gather the damage dice and bonuses
        let effect = grenade["effect"];
        let reflexSaveString = "";
        if(!getAttribute(char, "attribute-dexterity")){
            sendChat("character|" + getChar("Clippy").get("id"), "/w " + char.get("name") + " Bruh. This character is missing its Dexterity attribute.");
            return;
        }else{
            let grenadeDcBonus = Math.floor(grenade["level"]/2);
            let dexBonus =  Math.floor((getAttribute(char, "attribute-dexterity")-10)/2);
            if(GRENADELOG){
                log("Modular Weapons / !throwgrenade / grenadeDcBonus: " + grenadeDcBonus);
                log("Modular Weapons / !throwgrenade / dexBonus: " + dexBonus);
            }
            reflexSaveString = "{{Reflex Save=half; DC [[10+" + grenadeDcBonus + "+" + dexBonus + "]]}}";
        }
        
        
        let whisperToGM = false;
        if(getAttrByName(char.get("id"), "npc") == "yes"){
            whisperToGM = true;
        }
        
        let messageRecipient = null;
        if(whisperToGM) messageRecipient = getChar("Clippy");
        
        sendMessage(char, messageRecipient, "&{template:default} {{name=" + char.get("name") + " / " + 
            grenade["name"] + "}} {{To Hit=[[" + toHitDie + " + " + toHitBonus + "]]; DC 5}} {{Effect=" + effect +
            "}}" + reflexSaveString + " {{Scatter=[Roll Here](!thrownscatter)}}")
            
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
        if(!char){
            sendMessage(getChar("Clippy"), null, "Who just tried to use a weapon?" + 
                " I don't know youuuuuuuuuu!");
            return;
        }
        sendMessage(getChar("Clippy"), char, "Please update your weapon macro from '!fireweapon' to '!useweapon'. Yeah, I know it's pedantic, but " +
            "it's for the greater good.");
    }else if(msg.content.indexOf("!addweapon") !== -1){
        let char = getChar(msg.who);
        if(!char){
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
            let macroString = "!useweapon " + weapon["id"] + " charname=@{character_name}";
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
            }else sendMessage(getChar("Clippy"), char, "Added! EZ-PZ. I mean, you should probably double check it...");
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
