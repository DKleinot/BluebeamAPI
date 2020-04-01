// JavaScript source code
// Title:		Dashboard App
// Created by:	David Kleinot
// Date:		11/13/2019
// Purpose:		To aid users in managing Bluebeam Studio sessions.


//This is the Key that is provided before the Explore button.  Copy and paste here.
//var _APIKEY = 'TaXR6Zg9LpUGw9uQ9ScFi4fOuavge5UP7OXFCMGP5nQk5gTN7YhSer2hD51shEierHs8xp4mdqR43oPkzro85i9ah_9X-3jNm7LGAk06alytMWr9JYTfzhZR5RrfZa7W44j6RYgiDu1Ti9RToL680R2bViaxW2YczpTjT1V9g5VRIcwL0yenfLvgt3JVfoMaGVIF-3n3rlqIJaTR9YCq8ucEPPGobS5v_erVst7fxoEjckab1CMisjqsQp6XrdQTZE-1FaxTW9b_N73MlnEedJlr83CHgniQ-UJQY52q03-p91jkCpauoN2Ri6HHqXgbpu-GVA0R8FpZbJn3m6upT0egugAuGj8cOG9vroTWSQQ_FxmLJrM-lqGR4iNxlc0rGFxD2Q0P5mYQdllIXU6L8amNGkQMDWFg87MrcH6-4PMP7G89n85h6PQeqffZm1mC1EzO8WxN5faYX1xfmenaOsZPv7qMC0Fxs6-P09woZhopJZCvZ8KysNg1yZKpUOnfddTXadSLx9obQs-P4IobrZ2VbcXdxc9EhugxHF-eJTfa3yGCy-65iMh-PTN0xds4mm-5-dsF92E_REP9f2sxjY6t8kDDz40FWSPGwUf-qD140NfE9-xdMbF-RiDBuj1DCX81z27ADZffglR30K0SUYJ_FW8h1hzDLEXwzm90FczAVjmY6kdcbhUvB0i0IyMcV2foLQ'

//This will make it easier to turn off debugging
var bDebug = true;
function log(Val) {
    //Simple function to help log stuff to the console.
    if (bDebug) { console.log(Val); }
}

var access_token = "";

function AutoLoad() {
    log("Ok, lets load that access token.");
    access_token = sessionStorage.getItem('Access_Token');
    log(access_token);

}

var _SessionTest1 = '843-381-486';
var _SessionTest2 = '914-950-052';

//Not sure how this works yet.
var _Secret = '46da9150-1a07-49d0-a33a-1a2728cc6c45';
var _ClientID = '0dc1f1ba-32a5-4a18-aee2-baafe1cc2ea1';

//In an effort to clean up code, the API calls will be built on the fly.  Just concatinate the API key onto the end of the call.
//Example:  API_GetAllSessions + API_KEY
//var API_KEY = 'api_key=' + _APIKEY;

//This will return all sessions.
var API_GET_AllSessions = 'https://studioapi.bluebeam.com:443/publicapi/v1/sessions?includeDeleted=false&';




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
    log("This will get all session Data.");

    //https://studioapi.bluebeam.com:443/publicapi/v1/sessions?includeDeleted=true&api_key=

    var Request = new XMLHttpRequest();

    //Request.open('GET', API_GET_Session + '843-381-486' + '?' + API_KEY , true)
    Request.open('GET', API_GET_AllSessions + access_token, true);

    Request.onload = function () {
        // Begin accessing JSON data here
        var data = JSON.parse(this.response);

        log(data);

        //To get individual sessions from the all sessions command:
        //data.Sessions.forEach(Session =>
        //    console.log(Session.Id)
        //)



        //console.log(data.Sessions[2].Name)

        //The following allows me to 
        //console.log(data.Sessions[2].Name)

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