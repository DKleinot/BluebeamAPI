// JavaScript source code
// Title:		Paul Bunyan
// Created by:	David Kleinot
// Date:		3/31/2020
// Purpose:		This will break out the Logging portion of the code.

//Logging requirements from Bluebeam:
//
//Record of every Studio API Endpoint that is called
//For every Studio API request:
//  Timestamp
//  Method
//  Endpoint
//  Header
//  Body(be selective with the body for successful calls, as the body sometimes includes entire PDFs)
//For every response from the Studio API:
//  Timestamp
//  Header
//  Body
//Errors or pop - ups sent to the user
//API request or response that triggered an error or pop - up sent to the user
//Authentication errors that include the Studio API response body



function test() {
    //This is just intended to test this system.

    console.log("Testing12");

    pushToLog();
    pushToLog("GET", "website?", "This is the header", "This is the body of the message", true);

}

function pushToLog(Method = "", Endpoint = "", Header = "", Body = "", verbose = false) {
    //This will push data to the console for now...
    //  Need to get a server that supports PHP.
    var pocket = "";

    if (verbose) { console.log("Inside of pushToLog"); }

    /* Format for log will be as follows:
     *  [TIMESTAMP];[METHOD];[ENDPOINT];[HEADER];[BODY]
     *  These will always be here, even if empty.
     */

    pocket = Date.now();
    pocket += Method + ";" + Endpoint + ";" + Header + ";" + Body;
    console.log(pocket);
}
