var ImageViewer = function(pathID) {

    // Initialisation of an array which contains the URLs of all images available
    // after an AJAX request.
    var imageUrlsArray = new Array();

    var jqXHR = $.ajax({
        url: "wp-content/plugins/gpstocanvas/php/getimageurls.php",
        type: "POST",
        contentType: false,
        processData: false,
        cache: false,
        success: function(data) {
            var tempArray = data.split("//");

            for (var i = 0; i < tempArray.length; i++) {
                if (tempArray[i].split("-")[0] === pathID) {
                    imageUrlsArray.push(tempArray[i]);
                }
            }

            showImageViewer(imageUrlsArray);
        }
    });

    // Gets called when the AJAX request that loads the image URLs was successfull.
    function showImageViewer(imageUrlsArray) {
        var canvasWindowPercentage = 0.6;
        
        // HTML String
        var html =
                "<div id='imagesOverOverlay'>" +
                    "<div id='loading'>" +
                    "</div>" +
                    "<div id='container'>" +
                    "</div>" +
                    "<div id='noImagesInfo'>" +
                        "<span>Noch keine Bilder vorhanden.<br>" +
                        "<span id='noImagesSmiley'>:(</span><br>" +
                        "<span id='noImagesUploadNow'>Jetzt Bilder hochladen</span>" +
                        "</span>" +
                    "</div>" +
                    "<button type='button' class='gpstoCanvasButton' id='gpstocanvasImgBack'>" +
                    "</button>" +
                    "<button type='button' class='gpstoCanvasButton' id='gpstocanvasImgNext'>" +
                    "</button>" +
                "</div>";
        
        // HTML Strings get appended and faded in.
        $("body").append(html);

        html =
                "<div id='navigation'>" +
                    "<div id='buttonWrapper'>" +
                        "<button type='button' class='gpstoCanvasButton' id='gpstocanvasBackBtnOver'>" +
                        "</button>" +
                        "<button type='button' class='gpstoCanvasButton' id='gpstocanvasShowimagesBtnGrey'>" +
                        "</button>" +
                        "<button type='button' class='gpstoCanvasButton' id='gpstocanvasUploadimageBtnGrey'>" +
                        "</button>" +
                    "</div>" +
                "</div>";

        $("#imagesOverOverlay").append(html);

        $("#imagesOverOverlay").animate({opacity: 1}, 350);

        html = "";
        
        // Loop adds all image URLs that fit to the current track into a HTML string.
        for (var i = 0; i < imageUrlsArray.length; i++) {
            html = html + "<img class='gpstocanvasUserimage' id='userimage" + pathID + i + "' src='wp-content/plugins/gpstocanvas/userimages/" + imageUrlsArray[i] + "'>";
        }
        
        $("#container").append(html);
        
        // Checked if user is logged in, if not the uploader is not available.
        $("#noImagesUploadNow").click(function() {
            if (loggedIn === true)
                new Uploader(pathID);
            else
                alert("Bitte anmelden!");
        });
        
        // Check if images are available for the current track.
        // Shows "noImagesInfo" div if not.
        // Loads images if they are available.
        if (imageUrlsArray[0] == null) {
            $("#noImagesInfo").animate({opacity: 1}, 350);
        } else {

            var loadingDone = 0;

            var imagesCount = 0;

            var html = "<div id='uploaderLoadingOverlay'><div id='uploaderLoadingDiv'></div></div>"

            $("body").append(html);

            $("#uploaderLoadingOverlay").animate({opacity: 1}, 350);

            // Starts the loading animation.
            loadingDivRotation();
            
            // The margin of every single image gets calculated for an absolute centering.
            // Gets always done if an image has been finished loading.
            // The first of all image gets faded in automatically.
            for (var i = 0; i < imageUrlsArray.length; i++) {
                var img = "userimage" + pathID + i;
                $("#" + img).one('load', function() {
                    $(this).css('margin', '-' + $(this).height() / 2 + 'px 0 0 -' + $(this).width() / 2 + 'px');
                    if (imagesCount == imageUrlsArray.length - 1) {
                        $("#uploaderLoadingOverlay").animate({opacity: 0}, 350);
                        $("#uploaderLoadingOverlay").remove();
                        $("#userimage" + pathID + 0).animate({opacity: 1}, 350);
                    }
                    imagesCount++;
                });
                loadingDone = 1;
            }

            var degrees = 0;
            
            // Loading Animation via css rotate transform.
            function loadingDivRotation() {
                setTimeout(function() {
                    $("#uploaderLoadingDiv").css({'-webkit-transform': 'rotate(' + degrees + 'deg)',
                        '-moz-transform': 'rotate(' + degrees + 'deg)',
                        '-ms-transform': 'rotate(' + degrees + 'deg)',
                        'transform': 'rotate(' + degrees + 'deg)'});
                    degrees = degrees + 20;
                    loadingDivRotation();
                }, 40);
            }

            var imageNumberSelect = 0;
            var actualImg = $("#userimage" + pathID + imageNumberSelect);
            
            // Setting the functions of all the buttons.
            
            // Fade in next image.
            $("#gpstocanvasImgNext").click(function() {
                if (loadingDone == 1) {
                    actualImg.animate({opacity: 0}, 350);
                    if (imageNumberSelect == imageUrlsArray.length - 1)
                        imageNumberSelect = 0;
                    else
                        imageNumberSelect++;
                    actualImg = $("#userimage" + pathID + imageNumberSelect);
                    actualImg.animate({opacity: 1}, 350);
                }
            });
            
            // Fade in last image.
            $("#gpstocanvasImgBack").click(function() {
                if (loadingDone == 1) {
                    actualImg.animate({opacity: 0}, 350);
                    if (imageNumberSelect == 0)
                        imageNumberSelect = imageUrlsArray.length - 1;
                    else
                        imageNumberSelect--;
                    actualImg = $("#userimage" + pathID + imageNumberSelect);
                    actualImg.animate({opacity: 1}, 350);
                }
            });
        }
        
        // Adds an "X" in the top left corner of the canvas to close the imageviewer.
        // The functions of the buttons from the bottom level get set.
//        $("#closeImageviewer").click(function() {
//            $("#imagesOverOverlay").fadeOut(350);
//            setTimeout(function() {
//                $("#imagesOverOverlay").remove();
//            }, 350);
//
//            html =
//                    "<div id='navigation'>" +
//                        "<div id='buttonWrapper'>" +
//                            "<button type='button' class='gpstoCanvasButton' id='gpstocanvasBackBtn'>" +
//                            "</button>" +
//                            "<button type='button' class='gpstoCanvasButton' id='gpstocanvasShowimagesBtn'>" +
//                            "</button>" +
//                            "<button type='button' class='gpstoCanvasButton' id='gpstocanvasUploadimageBtn'>" +
//                            "</button>" +
//                        "</div>" +
//                    "</div>";
//
//            $("#maincanvasOverlay").append(html);
//
//            $("#maincanvasOverlay").animate({opacity: 1}, 350);
//            
//            $("#gpstocanvasBackBtn").click(function() {
//                $("#maincanvasOverlay").fadeOut(350);
//                setTimeout(function() {
//                    $("#maincanvasOverlay").remove();
//                }, 350);
//            });
//
//            $("#gpstocanvasShowimagesBtn").click(function() {
//                $("#navigation").fadeOut(350);
//                setTimeout(function() {
//                    $("#navigation").remove();
//                }, 350);
//                new ImageViewer(pathID);
//            });
//
//            $("#gpstocanvasUploadimageBtn").click(function() {
//                new Uploader(pathID);
//            });
//
//        });
        
        // Back function to close the imageviewer.
        // The functions of the buttons from the bottom level get set.
        $("#gpstocanvasBackBtnOver").click(function() {
            $("#imagesOverOverlay").fadeOut(350);
            setTimeout(function() {
                $("#imagesOverOverlay").remove();
            }, 350);

            html =
                    "<div id='navigation'>" +
                    "<div id='buttonWrapper'>" +
                    "<button type='button' class='gpstoCanvasButton' id='gpstocanvasBackBtn'>" +
                    "</button>" +
                    "<button type='button' class='gpstoCanvasButton' id='gpstocanvasShowimagesBtn'>" +
                    "</button>" +
                    "<button type='button' class='gpstoCanvasButton' id='gpstocanvasUploadimageBtn'>" +
                    "</button>" +
                    "</div>" +
                    "</div>";

            $("#maincanvasOverlay").append(html);

            $("#gpstocanvasBackBtn").click(function() {
                $("#maincanvasOverlay").fadeOut(350);
                setTimeout(function() {
                    $("#maincanvasOverlay").remove();
                }, 350);
                $("#gpstocanvasLogo").fadeOut(350);
                setTimeout(function() {
                    $("#gpstocanvasLogo").remove();
                }, 350);
            });

            $("#gpstocanvasShowimagesBtn").click(function() {
                $("#navigation").fadeOut(350);
                setTimeout(function() {
                    $("#navigation").remove();
                }, 350);
                new ImageViewer(pathID);
            });

            $("#gpstocanvasUploadimageBtn").click(function() {
                if (loggedIn === true)
                    new Uploader(pathID);
                else
                    alert("Bitte anmelden!");
            });

        });

        $("#gpstocanvasUploadimageBtnOver").click(function() {
            if (loggedIn === true)
                new Uploader(pathID);
            else
                alert("Bitte anmelden!");
        });
    }
};