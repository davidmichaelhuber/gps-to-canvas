<?php

if ($handle = opendir(realpath(__DIR__ . '/../userimages'))) {
    
    while (false !== ($file = readdir($handle))) {
        echo "$file//";
    }

    closedir($handle);
}
?>