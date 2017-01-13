var Uploader = function(pathID) {
    
    // HTML String.
    var html =
            "<div id='uploaderOverOverlay'>" +
                "<div id='dropContainer'>" +
                    "<div id='infoDiv'>" +
                        "<img src='wp-content/plugins/gpstocanvas/images/infoImgJPG.png'></img>" +
                    "</div>" +
                    "<div id='closeUploader'>" +
                    "</div>" +
                "</div>" +
            "</div>";
    
    $("body").append(html);
    
    // Calculates the needed margin values to move a "X" to the top left corner to close the uploader.
    var buttonMarginTop = ($("#dropContainer").height())/2;
    var buttonMarginLeft = ($("#dropContainer").width())/2;
    
    $("#closeUploader").css('margin-top','-'+(buttonMarginTop-($("#closeMaincanvas").height())/2)-15+'px');
    $("#closeUploader").css('margin-left','-'+(buttonMarginLeft-($("#closeMaincanvas").width())/2)-15+'px');
    
    $("#uploaderOverOverlay").animate({opacity: 1}, 350);
    
    divBounce();
    
    // Sets the function when the "X" gets clicked. The uploader gets closed then.
    $("#closeUploader").click(function() {
        $("#uploaderOverOverlay").fadeOut(350);
        setTimeout(function() {
            $("#uploaderOverOverlay").remove();
        }, 350);
    });
    
    // When the window gets resized the uploader changes the size and the margin values
    // to stay in center.
    $(window).resize(function() {
        if ($(window).width() < 550) {
            var widthScaled = ($(window).width()) * 0.9;
            $("#dropContainer").css("width", widthScaled);
            $("#dropContainer").css("margin-left", (widthScaled / 2) * (-1));
        }
    });

    handleUploadEvents();

    var countUp = true;
    
    // Animates the information div.
    function divBounce() {
        setTimeout(function() {

            infoDivMargin = $("#infoDiv").css("margin-top");
            infoDivMargin = infoDivMargin.replace(/\D/g, '');
            if (infoDivMargin == 70) {
                countUp = true;
            }
            else if (infoDivMargin == 80) {
                countUp = false;
            }

            if (countUp == true) {
                infoDivMargin++;
                $("#infoDiv").css("margin-top", infoDivMargin + "px");
            }
            else if (countUp == false) {
                infoDivMargin--;
                $("#infoDiv").css("margin-top", infoDivMargin + "px");
            }
            divBounce();
        }, 50);
    }
    
    // Sets eventlisteneres for the drag and drop events.
    function handleUploadEvents() {
        $(document).ready(function() {
            // Drag 'n' Dropable div
            $("#dropContainer").bind('dragenter', function(e) {
                e.stopPropagation();
                e.preventDefault();
                // Hover Style
            });
            $("#dropContainer").bind('dragover', function(e) {
                e.stopPropagation();
                e.preventDefault();
            });
            $("#dropContainer").bind('drop', function(e) {
                // Dropped Style
                e.preventDefault();
                var file = e.originalEvent.dataTransfer.files;
                handleFileUpload(file);
            });

            // Drag 'n' Drop on overlay.
            $(document).bind('dragenter', function(e)
            {
                e.stopPropagation();
                e.preventDefault();
            });
            $(document).bind('dragover', function(e)
            {
                e.stopPropagation();
                e.preventDefault();
            });
            $(document).bind('drop', function(e)
            {
                e.stopPropagation();
                e.preventDefault();
            });

            // Gets called when a drop event happened.
            function handleFileUpload(file) {
                if (file.length <= 1) {
                    
                    var html = "<div id='uploaderLoadingOverlay'><div id='uploaderLoadingDiv'></div></div>"
                    
                    $("body").append(html);
                    
                    $("#uploaderLoadingOverlay").animate({opacity: 1}, 350);
                    
                    var degrees = 0;
                    loadingDivRotation();
                    
                    // Loading Animation via css rotate transform.
                    function loadingDivRotation() {
                        setTimeout(function(){
                        $("#uploaderLoadingDiv").css({'-webkit-transform': 'rotate(' + degrees + 'deg)',
                            '-moz-transform': 'rotate(' + degrees + 'deg)',
                            '-ms-transform': 'rotate(' + degrees + 'deg)',
                            'transform': 'rotate(' + degrees + 'deg)'});
                        degrees = degrees + 20;
                        loadingDivRotation();
                        },40);
                    }
                    
                    // The dropped image gets appended into the form data array.
                    var formdata = new FormData();
                    formdata.append('file', file[0]);
                    sendFileToServer(formdata, pathID);
                } else {
                    alert("Bitte nur ein Bild auswählen!");
                }
            }
            
            // AJAX request that sends the formdata to the server.
            // Also transmitting the pathID of the current track.
            function sendFileToServer(formdata) {
                var jqXHR = $.ajax({
                    url: "wp-content/plugins/gpstocanvas/php/imageupload.php?id=" + pathID,
                    type: "POST",
                    contentType: false,
                    processData: false,
                    cache: false,
                    data: formdata,
                    success: function(data) {
                        
                        $("#uploaderLoadingOverlay").animate({opacity: 0}, 350);
                        $("#uploaderLoadingOverlay").remove();
                        
                        // Error handling if something went wrong.
                        // Notification if everything was fine.
                        if (data != "error") {
                            var html =
                                    "<div id='imageUploadDone'>" +
                                    "<span>" +
                                    "Bild wurde hochgeladen!"
                            "</span>" +
                                    "</div>";
                        } else {
                            var html =
                                    "<div id='imageUploadDone'>" +
                                    "<span>" +
                                    "Fehler beim Hochladen!"
                            "</span>" +
                                    "</div>";
                        }
                        
                        // Fades out the whole overlay.
                        
                        $("#uploaderOverOverlay").fadeOut(350);

                        setTimeout(function() {
                            $("#uploaderOverOverlay").remove();
                        }, 350);

                        $("#maincanvasOverlay").fadeOut(350);
                        setTimeout(function() {
                            $("#maincanvasOverlay").remove();
                        }, 350);

                        $("#gpstocanvasLogo").fadeOut(350);
                        setTimeout(function() {
                            $("#gpstocanvasLogo").remove();
                        }, 350);

                        $("#imagesOverOverlay").fadeOut(350);
                        setTimeout(function() {
                            $("#imagesOverOverlay").remove();
                        }, 350);

                        $("body").append(html);

                        $("#imageUploadDone").animate({opacity: 1}, 350);

                        setTimeout(function() {
                            $("#imageUploadDone").animate({opacity: 0}, 350);
                            setTimeout(function() {
                                $("#imageUploadDone").remove();
                            }, 350);
                        }, 2000);
                    }
                });
            }
        });
    }
};