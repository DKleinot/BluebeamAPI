// JavaScript source code
// Title:		Dashboard App
// Created by:	David Kleinot
// Date:		11/13/2019
// Purpose:		To aid users in managing Bluebeam Studio sessions.


//This will make it easier to turn off debugging
function log(Val, verbose = false) {
    //Simple function to help log stuff to the console.
    if (verbose) { console.log(Val); }
}




//Variables


//Constants
const dsDashboard = new DashboardStructure();










function AutoLoad() {
    log("Ok, lets load that access token..");
    access_token = sessionStorage.getItem('Access_Token');
    log(access_token);


}



//In an effort to clean up code, the API calls will be built on the fly.  Just concatinate the API key onto the end of the call.
//Example:  API_GetAllSessions + API_KEY
//var API_KEY = 'api_key=' + _APIKEY;

//This will return all sessions.
var API_GET_AllSessions = 'https://studioapi.bluebeam.com:443/publicapi/v1/sessions?includeDeleted=false';




//Get a specific session.
//  Note: You will need to add the Session ID number to the end plus a ?
//  Example: Request.open('GET', API_GET_Session('843-381-486') , true)
function API_GET_Session(ID) {
    //return 'https://studioapi.bluebeam.com:443/publicapi/v1/sessions/' + ID + '?' + API_KEY;
    return 'https://studioapi.bluebeam.com:443/publicapi/v1/sessions/' + ID + '?' + access_token;
}


function API_GET_Session_Users(ID) {
    return 'https://studioapi.bluebeam.com:443/publicapi/v1/sessions/' + ID + '/users?' + API_KEY;
}


