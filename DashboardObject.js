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
function log(Val, verbose = false) {
    //Simple function to help log stuff to the console.
    if (verbose) { console.log(Val); }
}

//Variables
const Sessions = [];
const Users = [];


var access_token = sessionStorage.getItem('Access_Token');

function AutoLoad(verbose = false) {
    checkAuthentication(verbose).then();

    pullDatafromAPI(verbose).then();

    log("Pull users", verbose);

    PopulateUsers(verbose).then();

    console.log("Ready");
}

//Datastructure functions
//  Sessions

function AddSession(id, name, createddate, expirationdate, url, status) {
    Sessions[Sessions.length++] = {
        ID: id,
        Name: name,
        CreatedDate: createddate,
        ExpirationDate: expirationdate,
        URL: url,
        Status: status,
        Users: []
    }
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

function AddUsertoSessionByIndex(s, id, name, email, status) {
    Sessions[s].Users[Sessions[s].Users.length] = {
        ID: id,
        Name: name,
        Email: email,
        Status: status
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

function getSessionIndex(sID) {
    for (i = 0; i < Sessions.length; i++) {
        if (Sessions[i].ID == sID) {
            return i;
        }
    }
}

//  Users

function AddUser(id, name, email) {
    //This will add a user to the database

    if (!UserExists(name)) {
        Users[Users.length++] = {
            ID: id,
            Name: name,
            Email: email,
            mySessionCount: 0,
            mySessions: []
        }
    } else {
        //log("User already exists");
    }
}

function UserExists(uName) {
    //Checks to see if a user exists
    for (i = 0; i < Users.length; i++) {
        if (Users[i].Name == uName) {
            return true;
        }
    }
    return false;
}

function getUserIndex(uName) {
    //Returns the Index of the user.
    for (i = 0; i < Users.length; i++) {
        if (Users[i].Name == uName) {
            return i;
        }
    }
}

function AddSessionToUser(uName, sID, verbose = false) {
    //This will check to see if the User exists
    //This will check to see if the Session exists
    //  If so, it will add that session ID to the Users list of Sessions

    var iMySessions;

    log(">Adding " + sID + " to " + uName + "'s sessions list", verbose);

    if (UserExists(uName)) {
        if (SessionExists(sID)) {
            //Ok, the user exists and the session exists, lets store this to make things easier to understand
            iMySessions = Users[getUserIndex(uName)].mySessions
            if (iMySessions.length > 0) {
                log(uName + " has " + iMySessions.length + " sessions", verbose);
                log(Users[getUserIndex(uName)].mySessions, verbose);
                for (i = 0; i < iMySessions.length; i++) {
                    if (iMySessions[i].ID == sID) {
                        log("already has it, do nothing", verbose);
                    } else {
                        iMySessions[iMySessions.length++] = Sessions[getSessionIndex(sID)];
                    }
                }
            } else {
                log(uName + "'s Session count is 0", verbose);
                iMySessions[iMySessions.length++] = Sessions[getSessionIndex(sID)];
            }
        }
    } else {
        //User does not exist.
        log("Hey, the user does not exist!", verbose);
    }
}

async function PopulateUsers(verbose = false) {
    //This will create the Users data structure
    var i = 0, j = 0;

    log("Populating users", verbose);

    //I feel like this is going to be very inefficient...
    //Iterate through each session
    for (i = 0; i < Sessions.length; i++) {
        //Iterate throught each user in a session
        for (j = 0; j < Sessions[i].Users.length; j++) {
            AddUser(Sessions[i].Users[j].ID, Sessions[i].Users[j].Name, Sessions[i].Users[j].Email);

            if (verbose) {
                log("Adding " + Sessions[i].ID + " to " + Sessions[i].Users[j].Name + "'s sessions list", verbose);

                AddSessionToUser(Sessions[i].Users[j].Name, Sessions[i].ID);
            }
        }

        log("Done, lets check", verbose);
        log(Users, verbose);
    }
}

//API functions

async function checkAuthentication(verbose = false) {
    //This will check to see if the Authentication is still valid.
    var Request = new XMLHttpRequest();

    Request.open('GET', 'https://studioapi.bluebeam.com:443/publicapi/v1/users/me', false);
    Request.setRequestHeader("Authorization", "Bearer " + access_token);

    Request.onload = function () {
        // Begin accessing JSON data here
        var data = JSON.parse(this.response);

        if (Request.status = 200) {
            if (data.Message == "Authorization has been denied for this request.") {
                alert("Need to reauthenticate");
                //Need to reauthenticate.
                Athuenticate();
            }
        }
    }
    Request.send();
}

async function pullDatafromAPI(verbose = false) {
    //Pull all sessions from the API and store them locally.
    var Request = new XMLHttpRequest();
    var i = 0;

    Request.open('GET', 'https://studioapi.bluebeam.com:443/publicapi/v1/sessions?includeDeleted=false', false);
    Request.setRequestHeader("Authorization", "Bearer " + access_token);

    Request.onload = function () {
        // Begin accessing JSON data here
        var data = JSON.parse(this.response);

        if (Request.status = 200) {

            log("Loading each Session:", verbose);
            log(data, verbose);

            //To get individual sessions from the all sessions command:
            data.Sessions.forEach(s => {
                //Sessions[i] = Session.Id;
                AddSession(s.Id, s.Name, s.Created, s.ExpirationDate, s.InviteUrl, s.Status);
            });
            pullUsers();
        } else {
            log('error', verbose);
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
                //log('error');
            }
        }
        Request.send();
    }
    //log(Sessions);
}

//Dashboard Functions

function displayUserByName(uName, verbose = false) {
    //This will pull the user from the database and display data about them.

}

function SelectText(txtBox, verbose = false) {
    console.log(txtBox);
    //This will select the text of the box on click
    const input = document.getElementById(txtBox);
    input.focus();
    input.select();
}