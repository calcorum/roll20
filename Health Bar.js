function hpNotice(name, hp){
    sendChat("Helper Bot", "Kill shot! " + name + "'s HP went to " + hp + ".");
}

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
});

// For NPC hitpoint tracking
on("change:graphic:bar2_value", function(token) {
    // Don't trigger if the token represents a character
    // NPCs never represent a character to keep their HPs from syncing
    let bar2Value = token.get("bar2_value");
    if(token.get("bar2_link") != ""){
        return;
    }else if(bar2Value < 0){
        token.set({
            bar2_value: 0,
            statusmarkers: "dead",
        });
        hpNotice(token.get("name"), bar2Value);
    }else if(bar2Value == 0){
        token.set({
            statusmarkers: "dead",
        });
        hpNotice(token.get("name"), bar2Value);
    }
});
