// JavaScript source code
// Title:		DashboardObject
// Created by:	David Kleinot
// Date:		04/03/2020
// Purpose:		This is the Data structure for the Dashboard app.


/*Ok, here's the workflow
 *  Get all session data, and grab the IDs
 *  Iterate on all the IDs and grab the users inside it.
 *  Fill out the data structure.


*/

//This will make it easier to turn off debugging
var bDebug = true;
function log(Val) {
    //Simple function to help log stuff to the console.
    if (bDebug) { console.log(Val); }
}

//Variables
const Sessions = [];
var iSessions = 0;
var iUsers = 0;
var access_token = sessionStorage.getItem('Access_Token');

function Main() {
    checkAuthentication();
    //log("Loading main function...");

    pullDatafromAPI().then();

    log("Data Pulled, lets do something with it now!!");

}


function AddSession(id, name, createddate, expirationdate, url, status) {
    Sessions[iSessions++] = {
        ID: id,
        Name: name,
        CreatedDate: createddate,
        ExpirationDate: expirationdate,
        URL: url,
        Status: status,
        Users: []
    }
}

function SessionExists(sID) {
    //This isn't super efficient, but whatever.
    for (i = 0; i < Sessions.length; i++) {
        if (Sessions[i].ID == sID) {
            return true;
        }
    }
    return false;
}

function AddUsertoSessionByID(sID, id, name, email, status) {
    for (i = 0; i < Sessions.length; i++) {
        if (Sessions[i].ID == sID) {
            Sessions[i].Users[Sessions[i].Users.length] = {
                ID: id,
                Name: name,
                Email: email,
                Status:status
            }
            //No point continuing, exit out of function.
            return;
        }
    }
}

function getSessionIndex(sID) {
    for (i = 0; i < Sessions.length; i++) {
        if (Sessions[i].ID == sID) {
            return i;
        }
    }
}

function AddUsertoSessionByIndex(s, id, name, email, status) {
    Sessions[s].Users[Sessions[s].Users.length] = {
        ID: id,
        Name: name,
        Email: email,
        Status: status
    }
}

//

function checkAuthentication() {
    //This will check to see if the Authentication is still valid.

    //https://studioapi.bluebeam.com:443/publicapi/v1/users/me

    var Request = new XMLHttpRequest();
    var i = 0;

    Request.open('GET', 'https://studioapi.bluebeam.com:443/publicapi/v1/users/me', false);
    Request.setRequestHeader("Authorization", "Bearer " + access_token);

    Request.onload = function () {
        // Begin accessing JSON data here
        var data = JSON.parse(this.response);

        if (Request.status = 200) {

        } else {
            log(Request.status);
            log(data);
        }
    }
    Request.send();

}

async function pullDatafromAPI() {
    //Pull all sessions from the API and store them locally.
    var Request = new XMLHttpRequest();
    var i = 0;

    Request.open('GET', 'https://studioapi.bluebeam.com:443/publicapi/v1/sessions?includeDeleted=false', false);
    Request.setRequestHeader("Authorization", "Bearer " + access_token);

    Request.onload = function () {
        // Begin accessing JSON data here
        var data = JSON.parse(this.response);

        if (Request.status = 200) {

            //log("Loading each Session:");
            //log(data);

            //To get individual sessions from the all sessions command:
            data.Sessions.forEach(s => {
                //Sessions[i] = Session.Id;
                AddSession(s.Id, s.Name, s.Created, s.ExpirationDate, s.InviteUrl, s.Status);
            });
            pullUsers();
        } else {
            log('error');
        }
    }
    Request.send();
}

function pullUsers() {
    //This will pull all the users from the sessions stored and store them locally.
    //log("Inside pullUsers.  Session count is " + Sessions.length);
    //log(Sessions);

    var Request = new XMLHttpRequest();
    var i = 0;
    var arg = "";
    var sID = "";

    for (i = 0; i < Sessions.length; i++) {

        //log("Prepping to extract user data for Session " + Sessions[i].ID);

        arg = "https://studioapi.bluebeam.com:443/publicapi/v1/sessions/" + Sessions[i].ID + "/users?";
        Request.open('GET', arg, false);
        Request.setRequestHeader("Authorization", "Bearer " + access_token);

        Request.onload = function () {
            // Begin accessing JSON data here
            var data = JSON.parse(this.response);

            if (Request.status = 200) {

                //log("Loading user data for Session " + Sessions[i].ID);
                //log(data);

                sID = getSessionIndex(Sessions[i].ID);

                //To get individual sessions from the all sessions command:
                data.SessionUsers.forEach(u => {
                    AddUsertoSessionByIndex(sID, u.Id, u.Name, u.Email, u.StatusMessage);
                });
            } else {
                log('error');
            }
        }
        Request.send();
    }

    log("Done...");
    log(Sessions);
    
}