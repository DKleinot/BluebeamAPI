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
    this.getSessionCount = function() { return Sessions.length; }

    this.Users = function() {

    }

    this.initialize = function() {

        log("Getting sessions");
        this.GetSessions();

        //Looks like this is running async..  will call this when the status comes back inside the previous one...
        //log("Loading each Session");
        //this.loadSessions();
    }

    this.loadSessions = function(){
        log("In loadSessions, lets look and see what we have");
        log(this.getSessionCount());
    }

    this.GetSessions = function() {
        var Request = new XMLHttpRequest();
        var i = 0;
        
        Request.open('GET', 'https://studioapi.bluebeam.com:443/publicapi/v1/sessions?includeDeleted=false', true);
        Request.setRequestHeader("Authorization", "Bearer " + access_token);
        

        Request.onload = function () {
            // Begin accessing JSON data here
            var data = JSON.parse(this.response);

            log(data);

            //To get individual sessions from the all sessions command:
            data.Sessions.forEach(Session => {
                Sessions[i] = Session.Id;
                i++;
            });

            log(Sessions);

            log("RequestStatus" + Request.status);

            if (Request.status = 200) {

                log("Loading each Session");
                this.loadSessions();

            } else {
                log('error');
            }
        }

        Request.send();
        
    }

}

//Variables
var access_token = "";

//Constants
const dsDashboard = new DashboardStructure();




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

    log("Initialize!");
    dsDashboard.initialize();



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