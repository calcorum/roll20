/*jshint esversion: 6 */

const CHARLOG = true;
let skillList = {
    "acrobatics":{"attribute":"dexterity","acp":true}, 
    "athletics":{"attribute":"strength","acp":true}, 
    "bluff":{"attribute":"charisma","acp":false}, 
    "computers":{"attribute":"intelligence","acp":false}, 
    "culture":{"attribute":"intelligence","acp":false}, 
    "diplomacy":{"attribute":"charisma","acp":false}, 
    "disguise":{"attribute":"charisma","acp":false}, 
    "engineering":{"attribute":"intelligence","acp":false}, 
    "intimidate":{"attribute":"charisma","acp":false}, 
    "lifescience":{"attribute":"intelligence","acp":false}, 
    "medicine":{"attribute":"intelligence","acp":false}, 
    "mysticism":{"attribute":"wisdom","acp":false}, 
    "perception":{"attribute":"wisdom","acp":false}, 
    "physicalscience":{"attribute":"intelligence","acp":false}, 
    "piloting":{"attribute":"dexterity","acp":false}, 
    "profession00":{"attribute":"unknown","acp":false}, 
    "profession01":{"attribute":"unknown","acp":false}, 
    "sensemotive":{"attribute":"wisdom","acp":false}, 
    "sleightofhand":{"attribute":"dexterity","acp":true}, 
    "stealth":{"attribute":"dexterity","acp":true}, 
    "survival":{"attribute":"wisdom","acp":false},
};
let saveList = {"fortitude":"constitution", "reflex":"dexterity", "will":"wisdom"};

function errorBadSkill(input, character){
    sendMessage(getChar("Clippy"), character, "Hi there! It looks like you're " + 
        "trying to roll a skill, but you must not be competent enough to get the syntax " + 
        "correct! Your skill input was: '" + input + "', but that ain't a skill.");
}

function errorBadSave(input, character){
    sendMessage(getChar("Clippy"), character, "Hi there! It looks like you're " + 
        "trying to make a saving throw, but you must not be competent enough to get the syntax " + 
        "correct! Your save input was: '" + input + "', but that ain't a save.");
}

function sendSkillDetailsToChar(char, skName, skBonus, skRanks, attBonus, chatBonus, acp){
    sendMessage(getChar("Clippy"), char, "&{template:default} {{name=" + char.get("name") + " / " +
        fixName(skName) + " Log}} {{Skill Ranks=" + skRanks + "}} {{Skill Bonus=" + skBonus + "}} {{" +
        "Attribute Bonus=" + attBonus + "}} {{Chat Bonus=" + chatBonus + "}} {{Armor Check Penalty=" + acp + 
        "}} {{Total Bonus=" + parseInt((skBonus) + (skRanks) + (attBonus) + (chatBonus) - (acp)) + "}}");
}

function sendSaveDetailsToChar(char, saveName, baseSave, miscBonus, attBonus, chatBonus){
    sendMessage(getChar("Clippy"), char, "&{template:default} {{name=" + char.get("name") + " / " +
        fixName(saveName) + " Log}} {{Base Save=" + baseSave + "}} {{Attribute Bonus=" + attBonus + "}} {{" +
        "Misc Bonus=" + miscBonus + "}} {{Chat Bonus=" + chatBonus + "}} {{Total Bonus=" + 
        parseInt((baseSave) + (miscBonus) + (attBonus) + (chatBonus)) + "}}");
}

function fixName(skill){
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

function rollCheck(char, skill, bonus, checkName){
    if(checkName.length < 1) checkName = "";
    else checkName = " / " + checkName;
    sendMessage(char, null, "&{template:default} {{name=" + char.get("name") + checkName + "}} {{" +
        fixName(skill) + " Check=[[1d20+" + bonus + "]]}}");
}

function rollSave(char, save, bonus){
    sendMessage(char, null, "&{template:default} {{name=" + char.get("name") + "}} {{" +
        capitalizeFirst(save) + " Save=[[1d20+" + bonus + "]]}}");
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
        let chatBonus = 0, attBonus = 0, skRanks = 0, skBonus = 0, acp = 0;
        let skillName = "", checkName = "";
        
        let rawInput = msg.content.replace("!skill ","");
        // Make sure there is something listed where the skill should be
        if(rawInput.length <= 0) return;
        let input = rawInput.split(" ");
        skillName = input[0];
        log("skillname: " + skillName);
        let skill = skillList[skillName] || null;
        log("acp: " + skill.acp);
        /*// Make sure what is listed first is a skill
        if(skill !== null){
            errorBadSkill(skillName, char);
            return;
        }*/
        // Get skill bonus from attributes
        skBonus = getAttribute(char, "skill-" + skillName, "max");
        if(isNaN(skBonus)) skBonus = 0;
        // Get skill ranks
        skRanks = getAttribute(char, "skill-" + skillName);
        if(isNaN(skRanks)) skRanks = 0;
        // get attribute bonus
        attBonus = Math.floor((getAttribute(char, "attribute-" + skill.attribute)-10)/2);
        if(isNaN(attBonus)) attBonus = 0;
        // check for armor check penalty
        if(skill.acp) acp = getAttribute(char, "armorcheckpenalty") || 0;

        // Check for bonus typed into chat
        _.each(input, function(param){
            if(param.indexOf("charname") === 0){
                log("alpha");
                char = getChar(param.split("=")[1]);
            }else if(param.indexOf("+") === 0){
                log("bravo");
                let bonus = parseInt(param.slice(1));
                chatBonus = bonus;
            }else if(param.indexOf("-") === 0){
                log("charlie / param: " + param);
                let penalty = parseInt(param.slice(1));
                chatBonus = -penalty;
            }else if(param.indexOf("checkname") === 0){
                log("delta");
                checkName = param.split("=")[1];
            }
        });
        
        log("SkillsSaves / main / Character: " + char.get("name"));
        log("SkillsSaves / main / skill: " + skillName);
        log("SkillsSaves / main / skBonus: " + skBonus);
        log("SkillsSaves / main / skRanks: " + skRanks);
        log("SkillsSaves / main / attBonus: " + attBonus);
        log("SkillsSaves / main / chatBonus: " + chatBonus);
        log("SkillsSaves / main / acp: " + acp);
        
        if(CHARLOG) sendSkillDetailsToChar(char, skillName, skBonus, skRanks, attBonus, chatBonus, acp);
        rollCheck(char, skillName, skBonus + skRanks + attBonus + chatBonus - acp, checkName);
    }else if(msg.content.indexOf("!save ") !== -1){
        let char = getChar(msg.who);
        if(char == null) {
            sendMessage(getChar("Clippy"), null, "Who just tried to make a saving throw?" +
                " I don't know youuuuuuu!");
            return;
        }
        let chatBonus = 0, attBonus = 0, baseSave = 0, miscBonus = 0; 
        let saveName = "";
        let rawInput = msg.content.replace("!save ","");
        // Make sure there is something listed where the save should be
        if(rawInput.length <= 0) return;
        let input = rawInput.split(" ");
        saveName = input[0];
        // Make sure what is listed first is a save
        if(!saveList[saveName]){
            errorBadSave(saveName, char);
            return;
        }
        // Get attribute bonus
        attBonus = Math.floor((getAttribute(char, "attribute-" + saveList[saveName])-10)/2);
        if(isNaN(attBonus)) skBonus = 0;
        // Get base save
        baseSave = getAttribute(char, "save-" + saveName);
        if(isNaN(baseSave)) baseSave = 0;
        // Get misc bonus
        miscBonus = getAttribute(char, "save-" + saveName, "max");
        if(isNaN(miscBonus)) miscBonus = 0;
        // Get chat bonus
        _.each(input, function(param){
            if(param.indexOf("charname") === 0){
                char = getChar(param.split("=")[1]);
            }else if(param.indexOf("+") === 0){
                let bonus = parseInt(param.slice(1));
                chatBonus = bonus;
            }else if(param.indexOf("-") === 0){
                let penalty = parseInt(param.slice(1));
                chatBonus = -penalty;
            }
        });
        
        log("Saves / Character: " + char.get("name"));
        log("Saves / attBonus: " + attBonus);
        log("Saves / baseSave: " + baseSave);
        log("Saves / miscBonus: " + miscBonus);
        log("Saves / chatBonus: " + chatBonus);
        
        if(CHARLOG) sendSaveDetailsToChar(char, saveName, baseSave, miscBonus, attBonus, chatBonus);
        rollSave(char, saveName, attBonus + baseSave + miscBonus + chatBonus);
    }
    
    if(msg.content.indexOf("!skillmacro") !== -1){
        let char = getChar(msg.who);
        sendMessage(getChar("Clippy"), char, "Please update your skill macro from 'Skills-List' to 'Skill-Checks'. That is the new drop-down interface.");
    }
});
