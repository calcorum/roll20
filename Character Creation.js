let skills = ["skill-acrobatics", "skill-athletics", "skill-bluff", 
    "skill-computers", "skill-culture", "skill-diplomacy", "skill-disguise",
    "skill-engineering", "skill-intimidate", "skill-lifescience", 
    "skill-medicine", "skill-mysticism", "skill-perception",
    "skill-physicalscience", "skill-piloting", "skill-profession00",
    "skill-profession01", "skill-sensemotive", "skill-sleightofhand",
    "skill-stealth", "skill-survival"];
let saves = ["save-fortitude", "save-reflex", "save-will"];
let stats = ["hitpoints", "stamina", "resolve", "initiative", 
     "baseattackbonus", "languages", "alignment", "size", "race",
    "profession00-name", "profession00-attribute", "profession01-name",
    "profession01-attribute"]
let attributes = ["attribute-strength", "attribute-dexterity", 
    "attribute-constitution", "attribute-intelligence",
    "attribute-wisdom", "attribute-charisma"];
let npchelpers = ["damagebonus","npc"]
let weaponExample = "!useweapon laserpistolazimuth charname=@{character_name}";
let naturalWeaponExample = "/w gm &{template:default} {{name=Bite Attack}} {{To Hit=[[1d20+6]]}} {{Damage=[[1d6+3]] S plus [[1d3]] So}} {{Effect=None}}"
let grenadeExample = "!throwgrenade fraggrenade1 charname=@{character_name}";
let spellExample = "/w gm &{template:default} {{name=@{character_name} / Spell Name}} {{Target=one creature}} {{Duration=instantaneous}} {{Saving Throw=Will half; DC [[10+SpellLevel+floor(((@{selected|attribute-intelligence}-10)/2))]]}} {{Spell Resistance=yes}} {{Damage=[[1d10]]}} {{Description=Any extra description needed}}"
let notes = "/w gm &{template:default} {{name=@{character_name} / Notes}}{{Alignment / Race=@{alignment} / @{race}}} {{Speed=30 ft.}} {{Languages=@{languages}}} {{Before Combat=SampleText}} {{During Combat=SampleText}} {{Morale=SampleText}} {{Gear=AllTheLoot}}"

on("ready", function(){
    on("add:character", function(char){
        log("Character name: " + char.get("name"));
        _.each(attributes, function(att){
            createObj("attribute", {
                name: att,
                current: 10,
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
        _.each(stats, function(st){
            createObj("attribute", {
                name: st,
                current: 0,
                characterid: char.id
            });
        });
        createObj("attribute", {
                name: "npc",
                current: "yes",
                characterid: char.id
        });
        createObj("attribute", {
                name: "damagebonus",
                current: "1",
                characterid: char.id
        });
        createObj("attribute", {
                name: "eac",
                current: "10",
                characterid: char.id
        });
        createObj("attribute", {
                name: "kac",
                current: "10",
                characterid: char.id
        });
        createObj("attribute", {
                name: "characterlevel",
                current: "1",
                characterid: char.id
        });
        createObj("attribute", {
                name: "weapon-specializtions",
                current: "basic-melee,small-arms",
                characterid: char.id
        });
        createObj("ability", {
            name: "Attack-Weapon-Sample",
            action: weaponExample,
            characterid: char.id,
        });
        createObj("ability", {
            name: "Attack-NaturalWeapon-Sample",
            action: naturalWeaponExample,
            characterid: char.id,
        });
        createObj("ability", {
            name: "Attack-Grenade-Sample",
            action: grenadeExample,
            characterid: char.id,
        });
        createObj("ability", {
            name: "Attack-Spell-Sample",
            action: spellExample,
            characterid: char.id,
        });
        createObj("ability", {
            name: "Initiative",
            action: "#Initiative-Enemy",
            istokenaction: true,
            characterid: char.id,
        });
        createObj("ability", {
            name: "Skills",
            action: "!skillChecks @{character_name}",
            istokenaction: true,
            characterid: char.id,
        });
        createObj("ability", {
            name: "Saves",
            action: "!saves @{character_name}",
            istokenaction: true,
            characterid: char.id,
        });
        createObj("ability", {
            name: "Notes",
            action: notes,
            istokenaction: true,
            characterid: char.id,
        });
    });
});
