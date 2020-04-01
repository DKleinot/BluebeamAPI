// JavaScript source code
// Title:		HollaBack
// Created by:	David Kleinot
// Date:		04/01/2020
// Purpose:		This will handle the call back from authentication.


//This will make it easier to turn off debugging
var bDebug = true;

function log(Val) {
    //Simple function to help log stuff to the console.
    if (bDebug) { console.log(Val); }
}

function AutoLoad() {
    log("Load");

    var MyURL = new URL(window.location.href);

    log(MyURL);

    log("URL..");

    log(MyURL.toJSON);

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