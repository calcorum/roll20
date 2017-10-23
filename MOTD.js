let motd = "<p>Welcome back! I'm very drunk and may repeat myself...</p>" +
    "<p>If you have any questions about the automation used in the game, see the User Guide <u>[right here](https://docs.google.com/document/d/1dqyiMXDHpbpYE6Uu8XLiq5RMBCByWRvMBmM8AfdS0Ig/edit?usp=sharing)</u></p>" +
    "<p>For last week's session notes, <u>[click here](https://docs.google.com/document/d/1uyYtx4XapSF-Xzzh08DzbbK_7av5kNVUeC6sAtrTY_A/edit#heading=h.wa1tznaoeysj)</u></p>" +
    "<p>Here's a meme for your time.</p> [meme](http://imgsrv.roll20.net/?src=s2.quickmeme.com/img/44/4452f10634f1f76f260f244012ecdd2dad58a288bdebd88a845f08d92cdcaa45.jpg)";

on('ready',function() {
	on('change:player:_online',function(player){
	    if(player.get("_online")){
	        setTimeout(function(){
    	        if(player.get("_online")){
            	    sendChat("character|" + findObjs({_type:"character",name:"Clippy",})[0].get("id"), 
            	        "/w " + player.get("displayname").split(" ")[0] + " " + motd);
        	    }
    	    }, 8000);
	    }
	});
});
