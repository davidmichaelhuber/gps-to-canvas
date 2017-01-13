var loggedIn;

var Parser = function(path, loginStatus) {
    
    // Check if user is logged in.
    if (loginStatus == 1)
        loggedIn = true;

    else
        loggedIn = false;
    
    // Calculates the pathID.
    var pathAsArray = path.split("/");
    var fullPathID = pathAsArray[pathAsArray.length - 3] + pathAsArray[pathAsArray.length - 2] + pathAsArray[pathAsArray.length - 1];
    var fullPathIDAsArray = fullPathID.split(".");
    var pathID = fullPathIDAsArray[0];

    // Global variables
    var path = path;

    var xmlDoc;

    var trkptArray = new Array();

    var trkpt, lon, lat, ele, lonMin, latMin, eleMin, trackpointAmount;

    ajaxRequestGPX(path);

    // Gets called by shortcode, opens the .gpx file
    function ajaxRequestGPX(path) {

        this.path = path;

        var xmlhttp = new XMLHttpRequest();

        xmlhttp.open("GET", path, false);
        xmlhttp.onload = responseData;
        xmlhttp.send(null);

        function responseData() {

            if (xmlhttp.status === 200) {
                xmlDoc = xmlhttp.responseXML;
                xmlToArray();
            } else {
                alert("There was a problem with the request.");
            }
        }
    }

    function xmlToArray() {

        // Min and max values get calculated.
        trkpt = xmlDoc.getElementsByTagName("trkpt")[0];

        lonMin = parseFloat(trkpt.getAttribute("lon"));
        latMin = parseFloat(trkpt.getAttribute("lat"));
        eleMin = parseFloat(trkpt.getElementsByTagName("ele")[0].firstChild.nodeValue);

        lonMax = parseFloat(trkpt.getAttribute("lon"));
        latMax = parseFloat(trkpt.getAttribute("lat"));
        eleMax = parseFloat(trkpt.getElementsByTagName("ele")[0].firstChild.nodeValue);

        for (var i = 0; xmlDoc.getElementsByTagName("trkpt")[i]; i++) {

            trkpt = xmlDoc.getElementsByTagName("trkpt")[i];

            lon = parseFloat(trkpt.getAttribute("lon"));

            lat = parseFloat(trkpt.getAttribute("lat"));

            ele = parseFloat(trkpt.getElementsByTagName("ele")[0].firstChild.nodeValue);

            if (lon < lonMin) {
                lonMin = lon;
            }
            if (lat < latMin) {
                latMin = lat;
            }
            if (ele < eleMin) {
                eleMin = ele;
            }
        }

        trackpointAmount = 0;
        
        // The offset values get saved into an array.
        for (var i = 0; xmlDoc.getElementsByTagName("trkpt")[i]; i++) {

            trkpt = xmlDoc.getElementsByTagName("trkpt")[i];

            lon = parseFloat(trkpt.getAttribute("lon"));
            lat = parseFloat(trkpt.getAttribute("lat"));
            ele = parseFloat(trkpt.getElementsByTagName("ele")[0].firstChild.nodeValue);

            trkptArray[i] = new Array();

            trkptArray[i][0] = parseFloat(((lon - lonMin) * 100000).toFixed(6));
            trkptArray[i][1] = parseFloat(((lat - latMin) * 100000).toFixed(6));
            trkptArray[i][2] = parseFloat(((ele - eleMin) * 100).toFixed(3));
            trackpointAmount++;
        }
        
        // A new Preview object gets created.
        new Preview(trkptArray, pathID);
    }
};