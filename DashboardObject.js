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

/*TODO: A list of features to add to the Dashboard
 *  Sorting / filtering of output
 *      Filter Status (ie only NONE or Reviewing)
 *      Sort by status (NONE>OTHER>Reviewing>Finished)
 *      Sort by percent complete (ie time remaining until session expires)
 *  Add AutoComplete to Name Field
 */

//Variables
const Sessions = [];
const Users = [];

var access_token = sessionStorage.getItem('Access_Token');

//Display Colors
var colLow = 'rgb(0, 180, 0)';   //This is a low priority (ie Finished or plenty of time to review)
var colMed = "orange";  //This is a medium priority (ie Not much time left to review)
var colHigh = 'rgb(255, 0, 0)';    //This is a high priority (ie very little time left to review)

var TempUsers = ["Aaron Bell", "Ahmed Abdelmoteleb", "Alexandra Tarantino", "Ann Gravatt", "Belkis Cuevas", "Bernie Gilbert", "Billy Sweeney", "Bobby Reed", "Bruce Allen", "Catherine Weishaupt", "Chetna Dave", "Chetna Dave", "Christie Bonniwell", "Chuck Ferguson", "Claudy Joinville", "Colton Phillips", "Craig Stevens", "Dan Thompson", "Daniel Sturgeon", "Danna Belshaw", "Darin Dell", "David Wynn", "Deborah Kukulich", "Dennis Rodgers", "Devon Norwood", "Don Finney", "Drew Boyce", "Emory Miller", "Eric Cimo", "George Haldas", "George Spadafino", "Georgea Pierce", "Hayden Compton", "Heather Mantz", "Jacob Kulhanek", "James Osborne", "Jamie Miller", "Jason Arndt", "Jason Mccluskey", "Jason Vogl", "Jeff Armstrong", "Jeffrey Vanhorn", "Jerri Fleetwood", "Jillian Mathews", "John Andrescavage", "John Fiori", "John Weaver", "Jonathan Moore", "Joseph Masten", "Josephus Vanboekhold", "Joshua Schwartz", "Joshua Thomas", "Karl Brown", "Karynn Reed", "Keith Durham", "Ken Rife", "Kevin Hickman", "Latonya Gilliam", "Lei Xu", "Marc Cote", "Mark Galipo", "Mark Harbeson", "Marvin Pedigo", "Matt Buckley", "Max Saintil", "Michael Fleming", "Michael Rivera", "Michael Rivera", "Michaelc Hahn", "Mike Beulah", "Naa-atswei Tetteh", "Naseem Stanford", "Nathan Draper", "Nathan Rahaim", "Omar Simpson", "Pamela Steinebach", "Pao Lin", "Paul Mcnamire", "Ping Jiang", "Raymond Eskaros", "Renford Brevett", "Richard Barchock", "Richard Sinegar", "Rob Williams", "Robby Brown", "Ryan Kendzierski", "Ryan Shaver", "Sara Esposito", "Scott Neidert", "Sean Duphily", "Shehnaz Chaudhri", "Sheila Donovan", "Skip Sanders", "Stephen Wright", "Steve Harr", "Stewart Megee", "Susanne Laws", "Taylor King", "Tim Hackett", "Timothy Stynchula", "Ting Guo", "Tom Brooks", "Vince Davis", "Warren Ziegler", "Will Mobley", "William Williamson", "Youcef Hamroun"];

//AutoComplete(document.getElementById('UserName'), TempUsers);

function AutoLoad(run = true) {
    console.group("AutoLoad");
    var input = document.getElementById("UserName");

    input.addEventListener("keyup", function (event) {
        // Execute a function when the user releases a key on the keyboard
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            document.getElementById("btnMain").click();
        }
    });

    if (!run) {
        DisplayError("Running in Offline Mode");

        console.groupEnd();
        return;
    }

    checkAuthentication().then();

    pullDatafromAPI().then();

    console.debug("Pull users");

    PopulateUsers().then();

    console.debug("Ready");

    AutoComplete(document.getElementById('UserName'));

    console.groupEnd();
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

function AddSessionToUser(uName, sID) {
    console.group("AddSessionToUser");
    //This will check to see if the User exists
    //This will check to see if the Session exists
    //  If so, it will add that session ID to the Users list of Sessions

    var iMySessions;

    console.debug(">Adding " + sID + " to " + uName + "'s sessions list");

    if (UserExists(uName)) {
        if (SessionExists(sID)) {
            //Ok, the user exists and the session exists, lets store this to make things easier to understand
            iMySessions = Users[getUserIndex(uName)].mySessions
            if (iMySessions.length > 0) {
                console.debug(uName + " has " + iMySessions.length + " sessions");
                console.debug(Users[getUserIndex(uName)].mySessions);
                for (i = 0; i < iMySessions.length; i++) {
                    if (iMySessions[i].ID == sID) {
                        console.debug("already has it, do nothing");
                    } else {
                        iMySessions[iMySessions.length++] = Sessions[getSessionIndex(sID)];
                    }
                }
            } else {
                console.debug(uName + "'s Session count is 0");
                iMySessions[iMySessions.length++] = Sessions[getSessionIndex(sID)];
            }
        }
    } else {
        //User does not exist.
        console.debug("Hey, the user does not exist!");
    }

    console.groupEnd();
}

async function PopulateUsers() {
    console.group("PopulateUsers");

    //This will create the Users data structure
    var i = 0, j = 0;

    console.debug("Populating users");

    //I feel like this is going to be very inefficient...
    //Iterate through each session
    for (i = 0; i < Sessions.length; i++) {
        //Iterate throught each user in a session
        for (j = 0; j < Sessions[i].Users.length; j++) {
            AddUser(Sessions[i].Users[j].ID, Sessions[i].Users[j].Name, Sessions[i].Users[j].Email);

            console.debug("Adding " + Sessions[i].ID + " to " + Sessions[i].Users[j].Name + "'s sessions list");

            AddSessionToUser(Sessions[i].Users[j].Name, Sessions[i].ID);
        }

    }

    console.debug("Done, lets check it");
    console.debug(Users);

    console.groupEnd();
}

//API functions

async function checkAuthentication() {
    console.group("checkAuthentication");

    //This will check to see if the Authentication is still valid.
    var Request = new XMLHttpRequest();

    console.debug("Checking Auth.");

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

    console.groupEnd();
}

async function pullDatafromAPI() {
    console.group("pullDatafromAPI");

    //Pull all sessions from the API and store them locally.
    var Request = new XMLHttpRequest();
    var i = 0;

    Request.open('GET', 'https://studioapi.bluebeam.com:443/publicapi/v1/sessions?includeDeleted=false', false);
    Request.setRequestHeader("Authorization", "Bearer " + access_token);

    Request.onload = function () {
        // Begin accessing JSON data here
        var data = JSON.parse(this.response);

        if (Request.status = 200) {

            console.debug("Loading each Session:");
            console.debug(data);

            //To get individual sessions from the all sessions command:
            data.Sessions.forEach(s => {
                //Sessions[i] = Session.Id;
                AddSession(s.Id, s.Name, s.Created, s.ExpirationDate, s.InviteUrl, s.Status);
            });
            pullUsers();
        } else {
            console.debug('error');
        }
    }
    Request.send();

    console.groupEnd();
}

function pullUsers() {
    console.group("pullUsers");

    //This will pull all the users from the sessions stored and store them locally.
    //log("Inside pullUsers.  Session count is " + Sessions.length);
    //log(Sessions);

    var Request = new XMLHttpRequest();
    var i = 0;
    var arg = "";
    var sID = "";

    for (i = 0; i < Sessions.length; i++) {

        console.debug("Prepping to extract user data for Session " + Sessions[i].ID);

        arg = "https://studioapi.bluebeam.com:443/publicapi/v1/sessions/" + Sessions[i].ID + "/users?";
        Request.open('GET', arg, false);
        Request.setRequestHeader("Authorization", "Bearer " + access_token);

        Request.onload = function () {
            // Begin accessing JSON data here
            var data = JSON.parse(this.response);

            if (Request.status = 200) {

                console.debug("Loading user data for Session " + Sessions[i].ID);
                console.debug(data);

                sID = getSessionIndex(Sessions[i].ID);

                //To get individual sessions from the all sessions command:
                data.SessionUsers.forEach(u => {
                    AddUsertoSessionByIndex(sID, u.Id, u.Name, u.Email, u.StatusMessage);
                });
            } else {
                console.debug('error');
            }
        }
        Request.send();
    }
    console.debug(Sessions);

    console.groupEnd();
}

//Dashboard Functions

function AutoComplete(inp) {
    console.group("AutoComplete");

    console.debug(inp);
    console.debug(Users);

    /*the autocomplete function takes two arguments,
      the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;

        var searchUpper = "";
        var valUpper = val.toUpperCase();

        /*close any already open lists of autocompleted values*/

        closeAllLists();

        if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);

        /*for each item in the array...*/
        for (i = 0; i < Users.length; i++) {
            /*find the text field value in the list:*/

            //for simplicity
            searchUpper = Users[i].Name.toUpperCase();

            if (searchUpper.substr(searchUpper.search(valUpper), valUpper.length) == valUpper) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");

                /*make the matching letters bold:*/

                //Need to add the regular letters first, up to the search val.
                b.innerHTML = Users[i].Name.substr(0, searchUpper.search(valUpper));

                //Now for the bold vals
                b.innerHTML += "<strong>" + Users[i].Name.substr(searchUpper.search(valUpper), val.length) + "</strong>";

                //Ok and the rest...
                b.innerHTML += Users[i].Name.substr(searchUpper.search(valUpper) + val.length, Users[i].Name.length);

                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + Users[i].Name + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });


    console.groupEnd();
}

function displaySessionDataByUser(uName) {
    console.group("displaySessionDataByUser");



    //This will pull the user from the database and display data about them.

    var i = 0;

    console.debug(uName);

    if (UserExists(uName)) {

        document.getElementById("DashboardDisplayArea").style.display = "block";
        document.getElementById("TutorialInfoHolder").style.display = "flex";

        var me = Users[getUserIndex(uName)];
        console.debug(me);

        DisplayError("Displaying data for " + uName);

        //Check to see if they have any sessions
        if (me.mySessions.length == 0) { DisplayError("No sessions found for " + uName); return;}

        //Ok, user exists and has sessions, lets do this.
        var htmlCode = "";
        var dStart = new Date();
        var dEnd = new Date();

        var myStatus = "";
        var myColor = colHigh;

        var dDiff = 0;

        /*
        This is the HTML code that I need to emulate.
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

            //Need to calc date complete.
            dStart = parseDate(me.mySessions[i].CreatedDate);
            dEnd = parseDate(me.mySessions[i].ExpirationDate);

            console.debug("Start " + dStart);
            console.debug("End " + dEnd);

            dDiff = calcDateDiffPercent(dStart, dEnd);

            console.debug("Diff " + dDiff);

            //Bar start
            htmlCode += "<div style=\"width:" + dDiff;
            htmlCode += "%;background-color:";

            myStatus = getUserStatusInSession(uName, me.mySessions[i].ID);

            switch (true) {
                case dDiff < 50: myColor = colLow; break;
                case dDiff < 75: myColor = colMed; break;
                default: myColor = colHigh;
            }

            //Override color if status is finished.
            if (myStatus == "Finished") { myColor = colLow; }

            //Override status is empty.
            if (myStatus == "") { myStatus = "[NONE]"; }

            htmlCode += myColor;

            htmlCode += ";align-items:center;display:flex;padding-left:20px\">";

            htmlCode += "\"My Status: " + myStatus + "\"";

            //Bar close
            htmlCode += "</div>"

            //Inner wrapper close
            htmlCode += "</div>"

            //Outter wrapper close
            htmlCode += "</div>"

            htmlCode += "</div>"

        }

        document.getElementById('DashboardDisplayArea').innerHTML = htmlCode;

    } else {
        document.getElementById("DashboardDisplayArea").style.display = "none";
        document.getElementById("TutorialInfoHolder").style.display = "none";
        DisplayError("User <b>" + uName + "</b> not found");
    }

    console.groupEnd();
}

function calcDateDiffPercent(dStart, dEnd) {
    console.group("calcDateDiffPercent");


    //This will get a percent complete between the start and end based on current time.
    //  If Now is after the end date, it will return 100%

    console.debug("Start " + dStart);
    console.debug("End " + dEnd);
    
    if (Date.now() > dEnd) { return 100; }
    if (Date.now() < dStart) { return 0; }

    console.debug(Math.ceil((Date.now() - dStart.getTime()) / (dEnd.getTime() - dStart.getTime()) * 100));

    console.groupEnd();
    return Math.ceil((Date.now() - dStart.getTime()) / (dEnd.getTime() - dStart.getTime()) * 100);
}

function parseDate(sDate) {
    console.group("parseDate");



    //This will parse a date and return a date object
    console.debug("Parsing Date: " + sDate);

    var pocket1 = [];
    var pocket2 = [];

    var y, d, m, h, mm, s;

    pocket1 = sDate.split("T");
    pocket2 = pocket1[0].split("-");
    pocket1 = pocket1[1].split(":");

    console.debug("Second Half: " + pocket1);
    console.debug("First Half: " + pocket2);

    y = pocket2[0];
    m = pocket2[1];
    d = pocket2[2];

    h = pocket1[0];
    mm = pocket1[1];
    s = pocket1[2];

    console.groupEnd();
    return new Date(y, m - 1, d, h, mm, s);
}

function SelectText(id) {
    console.group("SelectText");



    //This will select the text of the box on click
    console.debug(id);

    const input = document.getElementById(id);
    input.focus();
    input.select();

    console.groupEnd();
}

function KeyPress(id) {
    console.group("KeyPress");

    //This will modify the title of the button when a name is entered in.
    console.debug(document.getElementById(id).value);

    document.getElementById('btnMain').textContent = "Get Session data for " + document.getElementById(id).value;

    console.groupEnd();
}

function DisplayError(val) {
    document.getElementById('ErrorMessage').innerHTML = val;
}

function NameAutoComplete(val) {
    //This will search the available users and try to auto complete the text box.

}

