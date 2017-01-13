// Not in use!

var Drawer = function(trkptArray, pathID, loggedIn) {
    
    var trackpointAmount = trkptArray.length - 1;

    var topArray = new Array();
    var sideArray = new Array();
    var shiftArray = new Array();

    for (var i = 0; i < trkptArray.length; i++) {

        topArray[i] = new Array();
        sideArray[i] = new Array();
        shiftArray[i] = new Array();

        topArray[i][0] = trkptArray[i][0];
        topArray[i][1] = trkptArray[i][1];
        topArray[i][2] = trkptArray[i][2];

        sideArray[i][0] = trkptArray[i][0];
        sideArray[i][1] = trkptArray[i][1];
        sideArray[i][2] = trkptArray[i][2];

        shiftArray[i][0] = trkptArray[i][0];
        shiftArray[i][1] = trkptArray[i][1];
        shiftArray[i][2] = trkptArray[i][2];
    }

    var lonMax = 0;
    var latMax = 0;
    var eleMax = 0;

    for (var i = 0; i < trkptArray.length; i++) {
        // Calculating the max-values
        if (lonMax < trkptArray[i][0])
            lonMax = trkptArray[i][0];

        if (latMax < trkptArray[i][1])
            latMax = trkptArray[i][1];

        if (eleMax < trkptArray[i][2])
            eleMax = trkptArray[i][2];
    }

    // Converting all ELE values into values from 0 to 1
    for (var i = 0; i < trkptArray.length; i++)
        trkptArray[i][2] = trkptArray[i][2] / eleMax;

    // Canvas acces via variable
    var canvas = document.getElementById('mainCanvas');
    var ctx = canvas.getContext('2d');

    // Canvas width & height variables
    var cWidth = canvas.width;
    var cHeight = canvas.height;

    // Saving max. X & Y value
    var maxTrackX = lonMax;
    var maxTrackY = latMax;

    // Defines the inner border of the canvas
    // in pixels
    var canvasPaddingTopBottom = 80;
    var canvasPaddingLeftRight = 100;

    // Calculating the scalefactor by deviding the canvas
    // plus a small border by the max. X value
    var trackpointsCount = trackpointAmount;
    var trackpointsCountModulo = Math.round(trackpointAmount * 0.01 + 1);
    var trackpointsCountDrawn = trackpointAmount / trackpointsCountModulo;
    var trackpointScale = Math.round((cWidth * cHeight) * Math.pow(10, -5));

    if (lonMax > latMax) {
        var scaleFactor = (cWidth - canvasPaddingLeftRight) / maxTrackX;
    } else {
        var scaleFactor = (cHeight - canvasPaddingTopBottom) / maxTrackY;
    }

    // Sets the speed of the topToSide or sideToTop swap
    var swapDelay = 350;

    // Gets defined as "1" because the track
    // is in top view when the site got loaded
    var isTop = 1;

    var mousePos;

    // Calculates the two different track
    // views (top and side). Afterwards the
    // track gets drawn from top view

    onLoadDraw();

    function onLoadDraw() {
        calculateTopCoords();
        calculateSideCoords();
        drawTrack();
    }

    // EventListener that listens at a "mousemove" event
    // If the event happens the getPosition functino gets
    // called.
    canvas.addEventListener("mousemove", function(evt) {
        mousePos = getMousePos(canvas, evt);
        for (var i = 0; i < trackpointsCountDrawn; i++) {
            if (i % trackpointsCountModulo == 0) {
                if (Math.pow(mousePos.x - shiftArray[i][0], 2) + Math.pow(mousePos.y - shiftArray[i][1], 2) < Math.pow(trackpointScale, 2)) {
                    var myTweenable = new Tweenable();

                    myTweenable.tween({
                        from: {
                            'progress': 1
                        },
                        to: {
                            'progress': 100
                        },
                        duration: 200,
                        step: function(obj) {
                            ctx.fillStyle = "rgba(0,0,0,1)";
                            ctx.shadowBlur = 0;
                            ctx.shadowColor = "rgba(0, 0, 0, 0)";
                            ctx.beginPath();
                            ctx.arc(shiftArray[i][0], shiftArray[i][1], obj.progress / 20, 0, Math.PI * 2, true);
                            ctx.closePath();
                            ctx.fill();
                            shiftDraw();
                        }
                    });

                    return;
                } else {
                    //shiftDraw();
                }
            }
        }
    }, false);

    canvas.addEventListener("mousedown", function() {
        flipView();
    }, false);
    
    
    jQuery(document).ready(function() {
        jQuery("#uploadImage" + pathID).click(function() {
            if(loggedIn == 1)
                new Uploader(pathID);
            else if(loggedIn == 0)
                alert("Bitte anmelden!");
        });
    });
    
    // Calculates the mouse position and calls the drawBackground
    // and the drawTrack function.
    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    // Gets called when eventListener triggers it
    // Checks which view is currently drawn and
    // calls the right "from to" animation afterwards
    function flipView() {
        if (isTop == 1) {
            topToSideShift();
        } else {
            sideToTopShift();
        }
    }

    // Draws the background
    function drawBackground() {
        ctx.rect(0, 0, canvas.width, canvas.height);
        var grd = ctx.createRadialGradient(cWidth / 2, cHeight / 2, 100, cWidth / 2, cHeight / 2, 800);
        grd.addColorStop(0, '#FFFFFF');
        grd.addColorStop(1, '#D0D0D0');

        ctx.fillStyle = grd;
        ctx.fill();
    }

    // Draws the whole track.
    function drawTrack() {
        drawBackground();

        var spaltenCount = 0;

        for (var i = 0; i < trkptArray.length; i++) {

            if (i % trackpointsCountModulo == 0) {

                var xAxis = trkptArray[i][spaltenCount];
                var yAxis = trkptArray[i][spaltenCount + 1];
                var zAxis = trkptArray[i][spaltenCount + 2];

                ctx.fillStyle = "rgba(0,0,0," + ((trkptArray[i][spaltenCount + 2] / 2) + 0.1) + ")";

                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowBlur = (trkptArray[i][spaltenCount + 2] * 15 + 5);
                ctx.shadowColor = "rgba(0, 0, 0, 1)";

                ctx.beginPath();

                // Scalefactor depends on track width.
                // cHeight-y due to the inverted LAT values
                // zaxis+0.1 makes the movement of every point possible
                xAxis = xAxis * scaleFactor;
                yAxis = yAxis * scaleFactor;

                // yAxis = cHeight - ... is necessary due to the inverted
                // LAT values.
                xAxis = xAxis + ((cWidth / 2) - (maxTrackX * scaleFactor) / 2);
                yAxis = cHeight - (yAxis + ((cHeight / 2) - (maxTrackY * scaleFactor) / 2));

                ctx.arc(xAxis, yAxis, trackpointScale, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.fill();
            }
        }
    }

    // Calculates the coordinates for the
    // top view and saves them into an
    // own array
    function calculateTopCoords() {

        var spaltenCount = 0;

        for (var i = 0; i < trkptArray.length; i++) {

            if (i % trackpointsCountModulo == 0) {

                var xAxis = trkptArray[i][spaltenCount];
                var yAxis = trkptArray[i][spaltenCount + 1];
                var zAxis = trkptArray[i][spaltenCount + 2];

                // Scalefactor depends on track width.
                // cHeight-y due to the inverted LAT values
                // zaxis+0.1 makes the movement of every point possible
                xAxis = xAxis * scaleFactor;
                yAxis = yAxis * scaleFactor;
                zAxis = zAxis * 20 + 10;

                // yAxis = cHeight - ... is necessary due to the inverted
                // LAT values.
                xAxis = xAxis + ((cWidth / 2) - (maxTrackX * scaleFactor) / 2);
                yAxis = cHeight - (yAxis + ((cHeight / 2) - (maxTrackY * scaleFactor) / 2));

                topArray[i][spaltenCount] = xAxis;
                topArray[i][spaltenCount + 1] = yAxis;
                topArray[i][spaltenCount + 2] = zAxis;
            }
        }
    }

    // Calculates the coordinates for the
    // side view and saves them into an
    // own array
    function calculateSideCoords() {

        var spaltenCount = 0;
        var j = 0;
        var maxY = 0;

        for (var i = 0; i < trkptArray.length; i++) {

            if (i % trackpointsCountModulo == 0) {

                var xAxis = trkptArray[i][spaltenCount];
                var yAxis = trkptArray[i][spaltenCount + 1];
                var zAxis = trkptArray[i][spaltenCount + 2];

                // Scalefactor depends on track width.
                xAxis = xAxis * scaleFactor;
                yAxis = yAxis * scaleFactor;

                // Multiplier causes a higher or lower
                // sensitivity of the amplitude
                zAxis = (zAxis * trackpointScale * 10);

                xAxis = j;
                yAxis = zAxis;

                sideArray[i][spaltenCount] = xAxis;
                sideArray[i][spaltenCount + 1] = yAxis;
                sideArray[i][spaltenCount + 2] = trackpointScale;

                j += (cWidth - canvasPaddingLeftRight) / trackpointsCountDrawn;

                if (maxY < yAxis)
                    maxY = yAxis;
            }
        }

        // Centers the side view and flips it
        for (var i = 0; i < trkptArray.length; i++) {

            if (i % trackpointsCountModulo == 0) {

                xAxis = sideArray[i][spaltenCount];
                yAxis = sideArray[i][spaltenCount + 1];
                zAxis = sideArray[i][spaltenCount + 2];

                xAxis = xAxis + (cWidth / 2 - j / 2);
                yAxis = (cHeight - yAxis) - (cHeight / 2 - maxY / 2);

                sideArray[i][spaltenCount] = xAxis;
                sideArray[i][spaltenCount + 1] = yAxis;
                sideArray[i][spaltenCount + 2] = trackpointScale;
            }
        }
    }

    // Gets called by topToSideShift or
    // sideToTopShift. Draws the track
    // over and over until the shiftArray
    // doesn't get manipulated by the
    // tweens anymore
    function shiftDraw() {
        drawBackground();
        var spaltenCount = 0;

        for (var i = 0; i < trkptArray.length; i++) {
            if (i % trackpointsCountModulo == 0) {
                var xAxis = shiftArray[i][spaltenCount];
                var yAxis = shiftArray[i][spaltenCount + 1];
                var zAxis = shiftArray[i][spaltenCount + 2];

                ctx.fillStyle = "rgba(0,0,0," + ((trkptArray[i][spaltenCount + 2] / 2) + 0.1) + ")";

                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowBlur = (trkptArray[i][spaltenCount + 2] * 15 + 5);
                ctx.shadowColor = "rgba(0, 0, 0, 1)";

                ctx.beginPath();

                ctx.arc(xAxis, yAxis, trackpointScale, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.fill();
            }
        }
    }

    // Creates tweens and manipulates the shiftArray
    // and redraws the track after every tweening step
    function topToSideShift() {
        var myTweenable = new Tweenable();

        myTweenable.tween({
            from: {
                'progress': 1
            },
            to: {
                'progress': 100
            },
            duration: swapDelay,
            step: function(obj) {

                for (var i = 0; i < trkptArray.length; i++) {
                    if (i % trackpointsCountModulo == 0) {

                        shiftArray[i][0] = obj.progress * (sideArray[i][0] - topArray[i][0]) / 100 + topArray[i][0];
                        shiftArray[i][1] = obj.progress * (sideArray[i][1] - topArray[i][1]) / 100 + topArray[i][1];
                    }
                }
                shiftDraw();
            }
        });
        isTop = 0;
    }

    // Creates tweens and manipulates the shiftArray
    // and redraws the track after every tweening step
    function sideToTopShift() {
        var myTweenable = new Tweenable();

        myTweenable.tween({
            from: {
                'progress': 1
            },
            to: {
                'progress': 100
            },
            duration: swapDelay,
            step: function(obj) {

                for (var i = 0; i < trkptArray.length; i++) {
                    if (i % trackpointsCountModulo == 0) {

                        shiftArray[i][0] = obj.progress * (topArray[i][0] - sideArray[i][0]) / 100 + sideArray[i][0];
                        shiftArray[i][1] = obj.progress * (topArray[i][1] - sideArray[i][1]) / 100 + sideArray[i][1];
                    }
                }
                shiftDraw();
            }
        });
        isTop = 1;
    }
};