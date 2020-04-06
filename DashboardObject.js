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

function Main() {

    log("Loading main function");

    //var Sessions = new SessionStruct();

    Sessions[0] = new SessionStruct();

    Sessions[0].ID = "123-456-789";
    Sessions[0].Name = "T123456789";

    //Sessions[0].Users[0] = new SessionStruct().UsersStruct();

    Sessions[0].addUser();
    Sessions[0].Users[0].ID = "123456789";
    Sessions[0].Users[0].Email = "D@d.com";

    log(Sessions[0]);
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