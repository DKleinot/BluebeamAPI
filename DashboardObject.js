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

const Sessions = [];
var iSessions = 0;
var iUsers = 0;

function Main() {

    log("Loading main function");

    AddSession("123-456-789", "T123456789", "Yesterday", "Tomorrow", "URL", "Active");
    AddSession("123-456-779", "T123456789", "Yesterday", "Tomorrow", "URL", "Active");

    AddUsertoSessionByIndex(0, "123456789", "David.Kleinot", "David.Kleinot@delaware.gov", "Finished");
    AddUsertoSessionByIndex(0, "123456789a", "David.Kleinot", "David.Kleinot@delaware.gov", "Finished");
    AddUsertoSessionByIndex(0, "123456789b", "David.Kleinot", "David.Kleinot@delaware.gov", "Finished");
    AddUsertoSessionByIndex(0, "123456789c", "David.Kleinot", "David.Kleinot@delaware.gov", "Finished");
    AddUsertoSessionByIndex(0, "123456789d", "David.Kleinot", "David.Kleinot@delaware.gov", "Finished");
    AddUsertoSessionByIndex(0, "123456789e", "David.Kleinot", "David.Kleinot@delaware.gov", "Finished");

    log(SessionExists("123-456-779"));
    AddUsertoSessionByID("123-456-779", "qwertyuio", "David.Kleinot", "David.Kleinot@delaware.gov", "Finished")

    log(Sessions[0]);
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
            Sessions[i].Users[iUsers++] = {
                ID: id,
                Name: name,
                Email: email,
                Status:status
            }
        }
    }
}

function AddUsertoSessionByIndex(s, id, name, email, status) {
    Sessions[s].Users[iUsers++] = {
        ID: id,
        Name: name,
        Email: email,
        Status: status
    }
}

function SessionStruct() {
    var ID, Name, CreatedDate, ExpirationDate, URL, Status;

    var Users = [];
    var iUsers = 0;

    this.addUser = function () {
        this.Users[this.iUsers] = function () {
            var ID, Name, Email, MyStatus;
        };
    }

    
}

/*This will house the data structure
     *
     *  Sessions[]
     *      ID
     *      Name
     *      Created date
     *      Expiration date
     *      URL
     *      Status (ie active, or closed)
     *      Users[]
     *          ID
     *          Name
     *          email
     *          MyStatus
     *
     *  Examples:
     *      Sessions[i].ID = "123-456-789"
     *      Sessions[i].Users[i].ID = "123456789"
     *      Sessions[i].Users[i].Name = "David.Kleinot"
     *      Sessions[i].Users[i].MyStatus = "Finished"
     *
     *
     *  Users[]
     *      ID
     *      Name
     *      Email
     *      Sessions[]
     *          ID
     *          MyStatus
     *
     *  Examples:
     *      Users[i].ID = "123456789"
     *      Users[i].Name = "David.Kleinot"
     *      Users[i].Sessions[i].ID = "123-456-789"
     *      Users[i].Sessions[i].MyStatus = "Finished"

    */