<?php
    $trackID = $_GET["id"];
    // Explode fileName at every ".".
    $fileName = explode(".", $_FILES["file"]["name"]);
    $name = $fileName[0];
    $imgNumber = 1;
    // Rename image.
    $_FILES["file"]["name"] = $trackID . "-" . $name . "-" . $imgNumber . ".jpg";
    
    // Get path of userimages folder.
    $folderUp = realpath(__DIR__ . '/../userimages');
    
    // Check if the MIME Type is allowed.
    if ((($_FILES["file"]["type"] == "image/jpeg"))) {
   
        if ($_FILES["file"]["error"] > 0) {
            echo "error";
        } else {
            while(1){
                // Check if the file name is already in use.
                if(file_exists($folderUp . "/" . $_FILES["file"]["name"])){
                    $_FILES["file"]["name"] = $trackID . "-" . $name . "-" . $imgNumber++ . ".jpg";
                } else {
                    break;
                }
            }
            // When eveything was fine the file gets saved at the server.
            move_uploaded_file($_FILES["file"]["tmp_name"], $folderUp . "/" . $_FILES["file"]["name"]);
        }
    } else {
        echo "error";
    }
?>