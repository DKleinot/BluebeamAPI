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

const ClientID = "0dc1f1ba-32a5-4a18-aee2-baafe1cc2ea1";
const response_type = "token";
const redirect_uri = "https://thirsty-kepler-b52ade.netlify.com/";
const scope = "full_prime full_user jobs read_prime";

//  Variables

var state = "";

function GenerateState() {
    //This will generate a state and return a random string
    //Math.floor(Math.random() * (36 - 2 + 1) + 2);//generates a random number between 2 and 36.

    //Clear it.
    state = "";

    //create three separate strings with a random base between 2 and 36.
    state = Math.random().toString(Math.floor(Math.random() * (36 - 2 + 1) + 2)).slice(2);
    state += "-" + Math.random().toString(Math.floor(Math.random() * (36 - 2 + 1) + 2)).slice(2);
    state += "-" + Math.random().toString(Math.floor(Math.random() * (36 - 2 + 1) + 2)).slice(2);

    log(state);
}

function Athuenticate() {
    log("This will Authenticate the user?");

    var args = "";

    args = "https://authserver.bluebeam.com/auth/oauth/authorize?response_type=";
    args += response_type;
    args += "&client_id=";
    args += ClientID;
    args += " &redirect_uri=";
    args += redirect_uri;
    args += "&scope=";
    args += scope;


    var Request = new XMLHttpRequest();

    log("args=" + args);

    //Request.open('GET', API_GET_Session + '843-381-486' + '?' + API_KEY , true)
    Request.open('GET', args, true);

    Request.onload = function () {
        // Begin accessing JSON data here
        var data = JSON.parse(this.response);

        log(data);


        if (Request.status = 200) {
            log(data);
        } else {
            console.log('error');
        }
    }

    Request.send();




}