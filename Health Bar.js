function hpNotice(name, hp){
    sendChat("character|" + getChar("Clippy").get("id"), "Kill shot! " + name + "'s HP went to " + hp + ".");
}

/*
// For PC hitpoint tracking
on("change:attribute:current", function(obj) {
    if(obj.get("name") != "hitpoints"){
        return;
    }else{
        let hp = obj.get("current");
        if(hp < 0){
            let tokens = findObjs({
                _type: "graphic",
                _subtype: "token",
                represents: obj.get("_characterid"),
            });
            let name = tokens[0].get("name");
            log("Token found: " + name);
            
            hpNotice(name, hp);
            _.each(tokens, function(tokenObj){
                tokenObj.set("statusmarkers", "dead");
            });        
            obj.set({
                current: 0,
            });
        }
    }
});*/

// For NPC hitpoint tracking
on("change:graphic:bar3_value", function(token) {
    // Don't trigger if the token represents a character
    // NPCs never represent a character to keep their HPs from syncing
    let bar3Value = token.get("bar3_value");
    if(token.get("bar3_link") != ""){
        return;
    }else if(bar3Value < 0){
        token.set({
            bar3_value: 0,
            statusmarkers: "dead",
        });
        hpNotice(token.get("name"), bar3Value);
    }else if(bar3Value === 0){
        token.set({
            statusmarkers: "dead",
        });
        hpNotice(token.get("name"), bar3Value);
    }
});

// Assigning hit points and ACs to a newly assigned token
on("change:graphic:represents", function(token){
    let char = getObj("character", token.get("represents")) || null;
    if(char){
        let hitpoints = getAttribute(char, "hitpoints");
        if(hitpoints){
            token.set({
                bar3_value: hitpoints,
                bar3_max: hitpoints,
                showplayers_bar3: true,
                showplayers_name: true,
            });
        }
        
        let eac = getAttribute(char, "eac");
        let kac = getAttribute(char, "kac");
        // Set bar 1 to eac
        if(eac) token.set("bar1_value", eac);
        // Set bar 2 to kac
        if(kac) token.set("bar2_value", kac);
    }
});
