<?php

// enqueue tpl-home-websdk-offers.js
$tpl_name   = 'tpl-home';
$tpl_websdk = '-websdk-offers';
add_action( 'rojak_tpl_after_page_js', function() use ( $tpl_name, $tpl_websdk  ) {
	$file_uri = ROJAK_PARENT_URI . rojak_tpl_get_path( $tpl_name, $tpl_websdk . $GLOBALS['rojak_templates_minify'] . '.js' );
	wp_enqueue_script( $tpl_name . $tpl_websdk, $file_uri, array(), '', true );
});

// [mon] enqueue google
add_action( 'rojak_tpl_after_page_js',  function() use ( $map_args ) {
	wp_enqueue_script('google-maps', rojak_get_googlemap_url( $map_args ), array(), '', true );
});
