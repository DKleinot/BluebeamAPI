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
var CheckState;


//Credentials for the new one.
const ClientID = "d48c90a5-8752-46e1-ae3b-b0d7caecb7fd";
const Secret = "7a03638f-ed46-45b1-946f-e2dafa7de7e0";

//Added 071020
const redirect_uri = "https://thirsty-kepler-b52ade.netlify.com/Holla_Back.html";

function AutoLoad() {
    console.group("AutoLoad");

    console.debug("Load");

    var MyURL = new URL(window.location.href);

    //should probably check to see if the state matches...
    state = sessionStorage.getItem("state", state);

    GetRefresh();

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


    //window.location.href = "https://thirsty-kepler-b52ade.netlify.com/Dashboard.html";


    console.groupEnd();
}
function GetRefresh() {
    console.group("GetRefresh");

    //Ok, testing grabbing and storing the refresh token
    //  I believe this will need to be done every 60 days by me?
    //  How do I determine that I am requesting the Refresh token?  Or do I just hard code it in?

    console.debug("Requesting Refresh_token");

    var MyURL = new URL(window.location.href);
    console.debug(MyURL);

    var pocket;
    pocket = MyURL.search.split('?');
    console.debug(pocket);

    pocket = pocket[1].split('&');
    console.debug(pocket);


    console.debug("Parse that shit.");
    for (var i = 0; i < pocket.length; i++) {
        //Appears to go access_token, token_type, expires_in, state
        console.debug(pocket[i].split('='));
    }

    code = pocket[0].split('=')[1];
    console.debug(code);

    CheckState = pocket[0].split('=')[1];
    console.debug("Checking if states are equal");
    if (CheckState == state) {
        console.debug("states are equal");
    } else {
        console.debug("States are not equal:");
        console.debug(state + " is not equal to " + CheckState);
    }

    //sessionStorage.setItem("Access_Token", access_token);




    var args = "";

    args = "https://authserver.bluebeam.com/auth/token";
    args += "authorization_code&code=";
    args += code;
    args += "&client_id=";
    args += ClientID;
    args += "&client_secret=";
    args += Secret;
    args += "&redirect_uri=";
    args += redirect_uri;
    /*
    args += "&scope=";
    args += scope;

    GenerateState();

    args += "&state=";
    args += state;
    */
    console.debug(args);
    console.debug("returning a website????????????????????");

    //window.location.href = args;

    console.debug("Link done...");

    console.groupEnd();
}
