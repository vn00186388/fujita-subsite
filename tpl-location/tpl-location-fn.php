<?php

add_action( 'rojak_tpl_before_core_js',  function() use ( $map_args ) {
    wp_enqueue_script('google-maps', rojak_get_googlemap_url( $map_args ), array(), '', true );
});
