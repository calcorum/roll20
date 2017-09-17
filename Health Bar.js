on("change:attribute:current", function(obj) {
    if(obj.get("name") != "hitpoints"){
        return;
    }
    
    let hp = obj.get("current");
    if(hp < 0){
        let tokens = findObjs({
            _type: "graphic",
            _subtype: "token",
            represents: obj.get("_characterid"),
        });
        let name = tokens[0].get("name");
        log("Token found: " + name);
        
        sendChat("Helper Bot", "Brutal hit! " + name + "'s HP went to " + hp + ".");
        _.each(tokens, function(tokenObj){
            tokenObj.set("statusmarkers", "dead");
        });        
        obj.set({
            current: 0,
        });
    }
});
