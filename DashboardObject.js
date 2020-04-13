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

function getUserStatusInSession(uName, sID) {
    //This will look in a session and get the users status
    var sUsers = Sessions[getSessionIndex(sID)].Users;
    for (i = 0; i < sUsers.length; i++) {
        if (sUsers[i].Name == uName) {
            return sUsers[i].Status;
        }
    }
}

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

            log("Adding " + Sessions[i].ID + " to " + Sessions[i].Users[j].Name + "'s sessions list", verbose);

            AddSessionToUser(Sessions[i].Users[j].Name, Sessions[i].ID);
        }

    }

    log("Done, lets check it", verbose);
    log(Users, verbose);
}

//API functions

async function checkAuthentication(verbose = false) {
    //This will check to see if the Authentication is still valid.
    var Request = new XMLHttpRequest();

    log("Checking Auth.", verbose);

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

function displaySessionDataByUser(uName,verbose = false) {
    //This will pull the user from the database and display data about them.

    var i = 0;

    log(uName, verbose);
    if (UserExists(uName)) {

        var me = Users[getUserIndex(uName)];
        log(me, verbose);

        DisplayError("Displaying data for " + uName);

        //Check to see if they have any sessions
        if (me.mySessions.length == 0) { DisplayError("No sessions found for " + uName); return;}

        //Ok, user exists and has sessions, lets do this.
        var htmlCode = "";
        var RowColor = "";
        var BarWidth = 0;
        var dStart = new Date();
        var dEnd = new Date();
        var dDiff;


        /* This is the HTML code that I need to emulate.
        <div class="w3-bar" style="width:100%;background-color:lightgrey;display:flex;border:1px solid darkgray">                               //Outter wrapper.
            <div class="w3-bar-item" style="width:25%">                                                                                         //Title Wrapper
                T123456789 - This is the name of the session, it is very long.  What will happen if its this long?
            </div>
            <div class="w3-bar-item" style="width:75%;padding:3px 10px 3px 10px;display:flex;border-left:3px solid darkgray">                   //Bar outter wrapper
                <div class="w3-bar-item" style="width:100%;display:flex;border:2px solid black;padding:0px">                                    //Bar inner wrapper
                    <div style="width:20%;background-color:green;align-items:center;display:flex;padding-left:20px">This is some content</div>  //Bar
                </div>
            </div>
        </div>
        */

        for (i = 0; i < me.mySessions.length; i++) {
            //Outter wrapper start.
            htmlCode += "<div class=\"w3-bar\" style=\"width:100%;";
            if (i % 2 == 0) { htmlCode += "background-color:lightgrey;"; }//If its an even row, make it grey.
            htmlCode += "display:flex;border:1px solid darkgray\">";

            //Title wrapper start
            htmlCode += "<div class=\"w3-bar-item\" style=\"width:25%\">";
            htmlCode += me.mySessions[i].Name;

            //Title wrapper close
            htmlCode += "</div>";

            //Bar outter wrapper start
            htmlCode += "<div class=\"w3-bar-item\" style=\"width:75%;padding:3px 10px 3px 10px;display:flex;border-left:3px solid darkgray\">";

            //Bar inner wrapper start
            htmlCode += "<div class=\"w3-bar-item\" style=\"width:100%;display:flex;border:2px solid black;padding:0px\">";

            //Need to calc some stuff.
            dStart = me.mySessions[i].CreatedDate;
            dEnd = me.mySessions[i].ExpirationDate;
            dDiff = Math.ceil((dEnd.getTime() - dStart.getTime()) / dEnd.getTime() * 100);

            

            //Bar start
            htmlCode += "<div style=\"width:" + dDiff;
            htmlCode += "%;background-color:";
            switch (true) {
                case dDiff < 33: htmlCode += "green";
                case dDiff < 66: htmlCode += "orange";
                default: htmlCode += "red";
            }
            htmlCode += ";align-items:center;display:flex;padding-left:20px\">";

            htmlCode +="Status: " + getUserStatusInSession(uName, me.mySessions[i].ID);

            //Bar close
            htmlCode += "</div>"

            //Inner wrapper close
            htmlCode += "</div>"

            //Outter wrapper close
            htmlCode += "</div>"

        }

        Document.getElementById('DashboardDisplayArea').innerHTML = htmlCode;

    } else {
        DisplayError("User <b>" + uName + "</b> not found");
    }
}

function SelectText(id, verbose = false) {
    //This will select the text of the box on click
    log(id, verbose);

    const input = document.getElementById(id);
    input.focus();
    input.select();
}

function KeyPress(id, verbose = false) {
    //This will modify the title of the button when a name is entered in.
    log(document.getElementById(id).value, verbose);

    document.getElementById('btnMain').textContent = "Get Session data for " + document.getElementById(id).value
}

function DisplayError(val) {
    document.getElementById('ErrorMessage').innerHTML = val;
}



