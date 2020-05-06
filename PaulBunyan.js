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

function pushToLog(value,args=[]) {
    //This will push data to the log.
    //  Need to figure out how to append data to a file on a server...
    console.log("Inside of pushToLog");



    var xhr = (window.XMLHttpRequest) ? new XMLHttpRequest() : new activeXObject("Microsoft.XMLHTTP");
    xhr.open('post', '/FileWriter.php', true);

    //Just pushing value for now.  Will send all when up and running.
    xhr.send(value);
}