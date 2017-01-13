<?php

/**
 * Plugin Name: GPS To Canvas Develop
 * Plugin URI: -
 * Description: -
 * Version: -
 * Author: -
 * Author URI: -
 * License: -
 */

function gpstocanvas_loadScript() {
    wp_register_script('jquery1110', plugins_url('/js/jquery-1.11.0.min.js', __FILE__));
    wp_register_script('parser', plugins_url('/js/parser.js', __FILE__));
    wp_register_script('shifty', plugins_url('/js/shifty.min.js', __FILE__));
    wp_register_script('drawer', plugins_url('/js/drawer.js', __FILE__));
    wp_register_script('drawer2', plugins_url('/js/drawer2.js', __FILE__));
    wp_register_script('preview', plugins_url('/js/preview.js', __FILE__));
    wp_register_style('uploaderStyle', plugins_url('css/style.css', __FILE__));
    wp_register_script('uploader', plugins_url('/js/uploader.js', __FILE__));
    wp_register_script('imageviewer', plugins_url('/js/imageviewer.js', __FILE__));
    wp_register_script('previewdrawer', plugins_url('/js/previewdrawer.js', __FILE__));

    wp_enqueue_script('jquery1110');
    wp_enqueue_script('parser');
    wp_enqueue_script('shifty');
    wp_enqueue_script('drawer');
    wp_enqueue_script('drawer2');
    wp_enqueue_script('preview');
    wp_enqueue_style('uploaderStyle');
    wp_enqueue_script('uploader');
    wp_enqueue_script('imageviewer');
    wp_enqueue_script('previewdrawer');
    
}

function load_fonts() {
    wp_register_style('googleFonts', 'http://fonts.googleapis.com/css?family=Titillium+Web:600');
    wp_enqueue_style( 'googleFonts');
}

function gpstocanvas_shortcode($atts) {
    
    if (is_user_logged_in()) {
        $loggedIn = 1;
    } else {
        $loggedIn = 0;
    }
    
    extract(shortcode_atts(array(
        'path' => '',
                    ), $atts, 'gpstocanvas'));

    $pathAsArray = explode('/', $path);
    $pathAsArrayCount = count($pathAsArray);
    $fullPathID = $pathAsArray[$pathAsArrayCount - 3] . $pathAsArray[$pathAsArrayCount - 2] . $pathAsArray[$pathAsArrayCount - 1];

    $fullPathIDAsArray = explode('.', $fullPathID);
    $pathID = $fullPathIDAsArray[0];

    $canvas = '                             <div id="gpstocanvasInfo">
                                                <canvas id="trackCanvas' . $pathID . '" width="320" height="200" style="cursor:pointer;"></canvas>
                                            </div>
                                            <div class="gpstocanvasOpenInfo" id="gpstocanvasOpenInfo' . $pathID . '">
                                            </div>
                                            <script>
                                                new Parser("' . $path .'","'. $loggedIn .'");
                                            </script>
	 				';

    return $canvas;
}

function gpstocanvas_startUp() {
    add_action("wp_enqueue_scripts", "gpstocanvas_loadScript");
    add_shortcode('gpstocanvas', 'gpstocanvas_shortcode');
}

function gpx_upload_mimes($existing_mimes = array()) {
    // Add file extension 'extension' with mime type 'mime/type'
    $existing_mimes['gpx'] = 'application/xml';

    // and return the new full result
    return $existing_mimes;
}

function gpstocanvas_button() {
    add_filter("mce_external_plugins", "gpstocanvas_add_button");
    add_filter('mce_buttons', 'gpstocanvas_register_button');
}

function gpstocanvas_add_button($plugin_array) {
    $plugin_array['gpstocanvas'] = plugins_url('gps-to-canvas', dirname(__FILE__)) . '/js/tinyMCEPlugin.js';
    return $plugin_array;
}

function gpstocanvas_register_button($buttons) {
    array_push($buttons, 'gpstocanvas');
    return $buttons;
}

add_filter('upload_mimes', 'gpx_upload_mimes');
add_action('init', 'gpstocanvas_startUp');
add_action('init', 'gpstocanvas_button');
add_action('wp_print_styles', 'load_fonts');
?>