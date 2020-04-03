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

    function initialize() {
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
                }
            )

            log(Sessions);

            if (Request.status = 200) {
                //data.$id
                //data.forEach(sesh => {
                //    console.log(sesh.Id)
                //})

            } else {
                console.log('error');
            }
        }

        Request.send();
    }
    
}