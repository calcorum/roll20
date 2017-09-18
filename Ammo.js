function reduceAmmo(attributeId, usage){
    
}

on("chat:message", function(msg){
    if(msg.type != "api") return;
    
    if(msg.type == "api" && msg.content.indexOf("!ammo ") !== -1){
        log(msg.content);
        let weapon = msg.content.replace("!ammo ","").split(",");
        log("Without the !command: " + weapon);
        
        let player = getObj("player", msg.playerid);
        log("Player ID: " + msg.playerid);
        log("Player name: " + player.get("displayname"));
        /*let characters = findObjs({
            _type: "character",
        });
        
        _.each(characters, function(char){
            log("Character ID: " + char.get("_id"));
            log("Character Name: " + char.get("name"));
            log("Controlled By: " + char.get("controlledby")[0]);
        });
        
        if(character != null) log("Found character is: " + character.get("name"));
        else log("This is all I found: " + character);*/
        
        /*let attributes = findObjs({
            _type: "attribute"
            controlledby: 
        });
        reduceAmmo();*/
        /*log("Weapon ID: " + weapon[weapon]);
        
        weapon = weapon.replace("{","").replace("}","");
        log(weapon);
        
        weapon = weapon.split(",");
        log("Weapon: " + weapon);
        log("Weapon[0]: " + weapon[0]); */
        // Get character
        // Check usage vs charges
        // Subtract usage from charges
    }
});
