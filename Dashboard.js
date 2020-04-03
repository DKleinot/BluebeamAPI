// JavaScript source code
// Title:		Dashboard App
// Created by:	David Kleinot
// Date:		11/13/2019
// Purpose:		To aid users in managing Bluebeam Studio sessions.


//This will make it easier to turn off debugging
var bDebug = true;
function log(Val) {
    //Simple function to help log stuff to the console.
    if (bDebug) { console.log(Val); }
}


//Datastructure
function DashboardStructure() {
    /*This will house the data structure
     *  and calls for filling it out?

    */
    
    //This will hold all the sessions
    var Sessions = [];
    function getSessionCount() { return Sessions.length; }

    function Users() {

    }
}

//Variables
var access_token = "";

//Constants
const dsDashboard = DashboardStructure();




function LoadDashboardData() {
    /*Ok, here's the workflow
     *  Get all session data, and grab the IDs
     *  Iterate on all the IDs and grab the users inside it.
     *  Fill out the data structure.


    */
}






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


function getAllSessions() {
    

    log("moving on.");

    var Request = new XMLHttpRequest();

    Request.open('GET', API_GET_AllSessions, true);
    Request.setRequestHeader("Authorization", "Bearer " + access_token);

    Request.onload = function () {
        // Begin accessing JSON data here
        var data = JSON.parse(this.response);

        log(data);

        //To get individual sessions from the all sessions command:
        data.Sessions.forEach(Session =>
            console.log(Session.Id)
        )

        if (Request.status = 200) {
            data.$id
            data.forEach(sesh => {
                console.log(sesh.Id)
            })
        
        } else {
            console.log('error');
        }
    }

    Request.send();
}