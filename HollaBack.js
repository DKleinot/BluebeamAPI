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

function log(Val) {
    //Simple function to help log stuff to the console.
    if (bDebug) { console.log(Val); }
}

function AutoLoad() {
    log("Load");

    var MyURL = new URL(window.location.href);

    state = sessionStorage.getItem("state", state);


    log(MyURL);

    pocket = MyURL.search.split("?")[1].split("&");

    code = pocket[0].split("=")[1];
    state = pocket[1].split("=")[1];

    log(code);
    log(state);

    if (state == sessionStorage.getItem("state", state)) {
        log("True");
    } else {
        log(state);
        log(state + " <> " + sessionStorage.getItem("state", state));
    }

    log("Hash Brown2:");

    var pocket;
    pocket = MyURL.hash.split('#');
    log(pocket);

    pocket = pocket[1].split('&');
    log(pocket);


    log("Parse that shit.");
    for (var i = 0; i < pocket.length; i++) {
        //Appears to go access_token, token_type, expires_in, state
        log(pocket[i].split('='));
    }

    access_token = pocket[0].split('=')[1];
    log(access_token);

    sessionStorage.setItem("Access_Token", access_token);

    window.location.href = "https://thirsty-kepler-b52ade.netlify.com/Dashboard.html";

    /*
    var parser = document.createElement('a'), searchObject = {}, queries, split, i;

    // Let the browser do the work

    parser.href = window.location.href;

    // Convert query string to object
    queries = parser.search.replace(/^\?/, '').split('&');
    for (i = 0; i < queries.length; i++) {
        split = queries[i].split('=');
        searchObject[split[0]] = split[1];
    }

    log(parser.protocol);
    log(parser.host);
    log(parser.hostname);
    log(parser.port);
    log(parser.pathname);
    log(parser.search);
    log(searchObject);

    log("Hash");
    log(parser.hash);
    */
}