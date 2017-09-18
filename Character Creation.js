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
