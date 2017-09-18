let skills = ["skill-acrobatics", "skill-athletics", "skill-bluff", 
    "skill-computers", "skill-culture", "skill-diplomacy", "skill-disguise",
    "skill-engineering", "skill-intimidate", "skill-lifescience", 
    "skill-medicine", "skill-mysticism", "skill-perception",
    "skill-physicalscience", "skill-piloting", "skill-profession00",
    "skill-profession01", "skill-sensemotive", "skill-sleightofhand",
    "skill-stealth", "skill-survival"];
let saves = ["save-fortitude", "save-reflex", "save-will"];
let stats = ["hitpoints", "stamina", "resolve", "initiative",
    "profession00-name", "profession00-attribute", "profession01-name",
    "profession00-attribute", "languages", "alignment", "size", "race"]
let weaponExample = "&{template:default} {{name=@{character_name} / Tactical Semi-Auto Pistol}} {{To Hit=[[1d20+2]]}} {{Damage=[[1d6]] F; critical burn [[1d4]]}} {{Effect=None}}";
let grenadeExample = "&{template:default} {{name=@{character_name} / Name of Grenade}} {{To Hit=[[1d20-?{Range Penalty?|0}]]; DC 5}} {{Damage=[[1d6]] P}} {{Effect=Explode 15 ft.}} {{Scatter=[Roll Here](!&#13;#ThrownWeapon-Scatter)}}";

on("ready", function(){
    on("add:character", function(char){
        log("Character name: " + char.get("name"));
        _.each(stats, function(st){
            createObj("attribute", {
                name: st,
                current: 0,
                characterid: char.id
            });
        });
        _.each(saves, function(sv){
            createObj("attribute", {
                name: sv,
                current: 0,
                characterid: char.id
            });
        });
        _.each(skills, function(sk){
            createObj("attribute", {
                name: sk,
                current: 0,
                characterid: char.id
            });
        });
        createObj("ability", {
            name: "Attack-Weapon-Sample",
            action: weaponExample,
            istokenaction: true,
            characterid: char.id,
        });
        createObj("ability", {
            name: "Attack-Grenade-Sample",
            action: grenadeExample,
            istokenaction: true,
            characterid: char.id,
        });
        createObj("ability", {
            name: "Initiative",
            action: "#Initiative",
            istokenaction: true,
            characterid: char.id,
        });
        createObj("ability", {
            name: "Skills-List",
            action: "#Skills-List",
            istokenaction: true,
            characterid: char.id,
        });
        createObj("ability", {
            name: "Saves",
            action: "#Saves",
            istokenaction: true,
            characterid: char.id,
        });
    });
});


// Syntax: !addAbility [weapon, grenade] [CHARACTER NAME]
// Example: !addAbility weapon Manticore
on("chat:message", function(msg){
    if(msg.type != "api") return;
    
    if(msg.type == "api" && msg.content.indexOf("!addAbility ") !== -1){
        let input = msg.content.replace("!addAbility ","").split(" ");
        let newAbility = input[0];
        let char = findObjs({
            _type: "character",
            name: input[1],
        })[0];
        log("Found object: " + char.get("name"));
        
        if(newAbility == "weapon"){
            createObj("ability", {
                name: "Attack-Weapon-Sample",
                action: weaponExample,
                characterid: char.id,
            });
            sendChat("Helper Bot", "Added a weapon macro for" + char.get("name"));
        }else if(newAbility == "grenade"){
            createObj("ability", {
                name: "Attack-Grenade-Sample",
                action: grenadeExample,
                characterid: char.id,
            });
            sendChat("Helper Bot", "Added a grenade macro for " + char.get("name"));
        }
    }
});
