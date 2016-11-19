<?php

// [mon] enqueue the places scripts
$tpl_name   = 'tpl-city-info';
$tpl_places = '-places';
add_action( 'rojak_tpl_after_page_css', function() use ( $tpl_name, $tpl_places ) {
	$file_uri = ROJAK_PARENT_URI . rojak_tpl_get_path( $tpl_name, $tpl_places . $GLOBALS['rojak_templates_minify'] . '.css' );
	wp_enqueue_style( $tpl_name . $tpl_places, $file_uri );
});
add_action( 'rojak_tpl_after_page_js', function() use ( $tpl_name, $tpl_places  ) {
	$file_uri = ROJAK_PARENT_URI . rojak_tpl_get_path( $tpl_name, $tpl_places . $GLOBALS['rojak_templates_minify'] . '.js' );
	wp_enqueue_script( $tpl_name . $tpl_places, $file_uri, array(), '', true );
});

// [mon] enqueue google
add_action( 'rojak_tpl_after_core_js',  function() use ( $map_args ) {
	wp_enqueue_script('google-maps', rojak_get_googlemap_url( $map_args ), array(), '', true );
});