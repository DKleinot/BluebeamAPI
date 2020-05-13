// JavaScript source code
// Title:		HollaBack
// Created by:	David Kleinot
// Date:		04/01/2020
// Purpose:		This will handle the call back from authentication.

//This will make it easier to turn off debugging
var bDebug = true;
var access_token;
var code;
var state;

function AutoLoad() {
    console.group("AutoLoad");

    console.debug("Load");

    var MyURL = new URL(window.location.href);

    state = sessionStorage.getItem("state", state);

    console.debug("Hash Brown2:");

    var pocket;
    pocket = MyURL.hash.split('#');
    console.debug(pocket);

    pocket = pocket[1].split('&');
    console.debug(pocket);


    console.debug("Parse that shit.");
    for (var i = 0; i < pocket.length; i++) {
        //Appears to go access_token, token_type, expires_in, state
        console.debug(pocket[i].split('='));
    }

    access_token = pocket[0].split('=')[1];
    console.debug(access_token);

    sessionStorage.setItem("Access_Token", access_token);

    window.location.href = "https://thirsty-kepler-b52ade.netlify.com/Dashboard.html";


    console.groupEnd();
}
