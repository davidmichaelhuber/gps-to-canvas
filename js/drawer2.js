// New version of the Drawer - WIP Version

var Drawer2 = function(trkptArray, pathID, canvas, loggedIn) {

    var track = new TrackObject(trkptArray, canvas);
    var ctx = canvas.getContext('2d');

    var objGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    objGradient.addColorStop(0, '#c5c9c2');
    objGradient.addColorStop(1, '#e8eded');

    drawBackground();

    var marginSide = canvas.width * 0.3;

    drawPitch();
    drawLevels();
    drawSpeed();

    function drawBackground() {
        ctx.fillStyle = objGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawLevels() {

        ctx.fillStyle = "828f73";

        var current = marginSide / 2;

        var addX = (canvas.width - marginSide) / track.length();

        var minLevel = 0.8;

        var levelHeight = canvas.height * 0.1;

        var levelsLevel = canvas.height * 0.5 + levelHeight * 0.5 + ((minLevel * levelHeight) / 2);

        ctx.beginPath();
        ctx.moveTo(current, levelsLevel);

        for (var i = 0; i < track.length(); i++) {
            ctx.lineTo(current, (levelsLevel - ((track.eleZTO[i] + minLevel) * levelHeight)));
            current += addX;
        }

        ctx.lineTo(canvas.width - marginSide / 2, levelsLevel);

        ctx.closePath();
        ctx.fill();
    }

    function drawSpeed() {

        ctx.fillStyle = "ffffff";

        var current = marginSide / 2;

        var addX = (canvas.width - marginSide) / track.length();

        var minLevel = 0.8;

        var levelHeight = canvas.height * 0.1;

        var levelsLevel = canvas.height * 0.55 + levelHeight * 0.55 + ((minLevel * levelHeight) / 2);

        ctx.beginPath();
        ctx.moveTo(current, levelsLevel);

        for (var i = 0; i < track.length(); i++) {
            ctx.lineTo(current, (levelsLevel - ((track.eleZTO[i] + minLevel) * levelHeight)));
            current += addX;
        }

        ctx.lineTo(canvas.width - marginSide / 2, levelsLevel);

        ctx.closePath();
        ctx.fill();
    }

    function drawPitch() {

        ctx.fillStyle = "000000";

        var current = marginSide / 2;

        var addX = (canvas.width - marginSide) / track.length();

        var minLevel = 0.8;

        var levelHeight = canvas.height * 0.1;

        var levelsLevel = canvas.height * 0.45 + levelHeight * 0.45 + ((minLevel * levelHeight) / 2);

        ctx.beginPath();
        ctx.moveTo(current, levelsLevel);

        for (var i = 0; i < track.length(); i++) {
            ctx.lineTo(current, (levelsLevel - ((track.eleZTO[i] + minLevel) * levelHeight)));
            current += addX;
        }

        ctx.lineTo(canvas.width - marginSide / 2, levelsLevel);

        ctx.closePath();
        ctx.fill();
    }

};


var TrackObject = function(trkptArray, canvas) {

    var track = {
        lon: [],
        lat: [],
        ele: [],
        eleZTO: [],
        length: function() {
            return trkptArray.length;
        },
        minlon: function() {
            return Math.min.apply(null, track.lon);
        },
        minlat: function() {
            return Math.min.apply(null, track.lat);
        },
        minele: function() {
            return Math.min.apply(null, track.ele);
        },
        maxlon: function() {
            return Math.max.apply(null, track.lon);
        },
        maxlat: function() {
            return Math.max.apply(null, track.lat);
        },
        maxele: function() {
            return Math.max.apply(null, track.ele);
        }
    };


    for (var i = 0; i < trkptArray.length; i++) {
        track.lon[i] = trkptArray[i][0];
        track.lat[i] = trkptArray[i][1];
        track.ele[i] = trkptArray[i][2];
    }


    for (var i = 0; i < track.length(); i++) {
        track.eleZTO[i] = track.ele[i] / track.maxele();
    }

    return track;
};