// JavaScript source code
// Title:		Authentication
// Created by:	David Kleinot
// Date:		3/31/2020
// Purpose:		This will break out the Authentication portion of the code.

/*
https://authserver.bluebeam.com/auth/oauth/authorize

response_type   Must be set to token
client_id       Client ID received during App registration process; found on Back of App Card.
redirect_uri	Redirect URI specified during App registration process; listed on Front of App Card.
scope	        Space separated list of scopes specified during App registration process; listed on Front of App Card.
state           Random string generated by your App. Studio will return this state in a callback to your redirect_uri.
                Validate it against the state in your App to prevent cross-site request forgery.

*/

//  Constants

//importScripts('./Dashboard.js');
//import { log } from './Dashboard';
//let log = log();


//const Dashboard = require('./Dashboard');

/* Credentials for the old app?
const ClientID = "0dc1f1ba-32a5-4a18-aee2-baafe1cc2ea1";
const Secret = "9c0ae51c-1926-4759-8bf2-f8514691431b";
*/

//Credentials for the new one.
const ClientID = "d48c90a5-8752-46e1-ae3b-b0d7caecb7fd";
const Secret = "7a03638f-ed46-45b1-946f-e2dafa7de7e0";

const response_type = "token";
const redirect_uri = "https://thirsty-kepler-b52ade.netlify.com/Holla_Back.html";

//The old app
//const scope = "full_prime full_user jobs read_prime";

//New app
const scope = "read_prime";

//  Variables

var state = "";

function pushToLog(Method = "", Endpoint = "", Header = "", Body = "") {
    console.group("pushToLog");

    var pocket = "";
    var d = new Date();

    pocket = d.getMonth() + 1 + ":" + d.getDate() + ":" + d.getFullYear() + "_" + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + ":" + d.getMilliseconds();
    pocket += ";";
    pocket += Method + ";" + Endpoint + ";" + Header + ";" + Body;

    console.log(pocket);

    console.groupEnd();
}

function GenerateState() {
    console.group("GenerateState");
    //This will generate a state and return a random string
    //Math.floor(Math.random() * (36 - 2 + 1) + 2);//generates a random number between 2 and 36.

    //Clear it.
    state = "";

    //create three separate strings with a random base between 2 and 36.
    state = Math.random().toString(Math.floor(Math.random() * (36 - 2 + 1) + 2)).slice(2);
    state += "-" + Math.random().toString(Math.floor(Math.random() * (36 - 2 + 1) + 2)).slice(2);
    state += "-" + Math.random().toString(Math.floor(Math.random() * (36 - 2 + 1) + 2)).slice(2);

    sessionStorage.setItem("state", state);

    console.groupEnd();
}


function Athuenticate() {
    console.group("Athuenticate");

    console.debug("This will Authenticate the user?");

    //pushToLog("This is some data");

    var args = "";

    args = "https://authserver.bluebeam.com/auth/oauth/authorize?response_type=";
    args += response_type;
    args += "&client_id=";
    args += ClientID;
    args += "&redirect_uri=";
    args += redirect_uri;
    args += "&scope=";
    args += scope;

    GenerateState();

    args += "&state=";
    args += state;

    console.debug(args);
    console.debug("returning a website????????????????????");

    window.location.href = args;

    console.debug("Link done...");

    console.groupEnd();
}
