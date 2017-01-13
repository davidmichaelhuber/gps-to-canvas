var Preview = function(trkptArray, pathID) {
    
    // Selection of the canvas of the current track.
    var canvas = document.getElementById("trackCanvas" + pathID);
    var ctx = canvas.getContext("2d");
    
    // Canvas gets styled by PreviewDrawer object.
    new PreviewDrawer(trkptArray, pathID, canvas);
    
    // When preview gets clicked the main canvas opens.
    $(canvas).click(function(){
        var maincanvas = new MainCanvas(trkptArray, pathID, loggedIn);
    });
};

var MainCanvas = function(trkptArray, pathID, loggedIn) {
    
    // Value that defines how much of the available viewport is used for the
    // canvas. Value * 100 = percentage of the actual screen size.
    var canvasWindowPercentage = 0.6;
    
    var html =
                            "<div id='gpstocanvasLogo'>" +
                                 "<img src='wp-content/plugins/gpstocanvas/images/gpstocanvasIcon.png' width='12px' height='12px' id='navigationLogoIcon'>" +
                                 "<div id='logoText'>GPS To Canvas</div>" +
                            "</div>";
                    
    $("body").append(html);
    
    $("#gpstocanvasLogo").animate({opacity: 1}, 350);
    
    var html =
            "<div id='maincanvasOverlay'>" +
                    "<div id='canvasContainer'>" +
                        "<canvas id='mainCanvas' width='"+ $(window).width()*canvasWindowPercentage +"' height='"+ $(window).width()*9/16*canvasWindowPercentage +"' style='margin:-"+($(window).width()*9/16*canvasWindowPercentage)/2+"px 0 0 -"+($(window).width()*canvasWindowPercentage)/2+"px'>" +
                        "</canvas>" +
                    "</div>" +
                    "<div id='navigation'>" +
                            "<div id='buttonWrapper'>" +
                                "<button type='button' class='gpstoCanvasButton' id='gpstocanvasBackBtn'>" +
                                "</button>" +
                                "<button type='button' class='gpstoCanvasButton' id='gpstocanvasShowimagesBtn'>" +
                                "</button>" +
                                "<button type='button' class='gpstoCanvasButton' id='gpstocanvasUploadimageBtn'>" +
                                "</button>" +
                            "</div>" +
                        "</div>" +
                    "</div>" +
            "</div>";
    
    $("body").append(html);
    
    $("#maincanvasOverlay").animate({opacity: 1}, 350);
    
    // Setting the functions of all the buttons.
    
    // Closes the overlay.
    $("#gpstocanvasBackBtn").click(function(){
        $("#maincanvasOverlay").fadeOut(350);
        setTimeout(function() {
            $("#maincanvasOverlay").remove();
        }, 350);
        $("#gpstocanvasLogo").fadeOut(350);
        setTimeout(function() {
            $("#gpstocanvasLogo").remove();
        }, 350);
    });
    
    // Opens the image viewer.
    $("#gpstocanvasShowimagesBtn").click(function(){
        $("#navigation").fadeOut(350);
        setTimeout(function() {
            $("#navigation").remove();
        }, 350);
        new ImageViewer(pathID);
    });
    
    // Opens the uploader after checking if the user is logged in.
    $("#gpstocanvasUploadimageBtn").click(function(){
        if (loggedIn === true)
            new Uploader(pathID);
        else
            alert("Bitte anmelden!");
    });
    
    var canvas = document.getElementById("mainCanvas");
    
    // The main canvas gets styled by this object.
    var drawObject = new Drawer2(trkptArray, pathID, canvas);
};