<?php

/**
 * WPML Remove CSS and JS
 *
 * @link http://notboring.org/devblog/2012/08/how-to-remove-the-embedded-sitepress-multilingual-cmsrescsslanguage-selector-css-from-your-own-wordpress-templates-on-wpml-installations/
 */
if ( ! function_exists( 'fjtss_wpml_dont_load' ) ) {
	function fjtss_wpml_dont_load() {
		define('ICL_DONT_LOAD_LANGUAGE_SELECTOR_CSS', true);
		define('ICL_DONT_LOAD_NAVIGATION_CSS', true);
		define('ICL_DONT_LOAD_LANGUAGES_JS', true);
	}
}
add_action( 'init', 'fjtss_wpml_dont_load' );


/**
 * Add wpml inline script in the footer
 */
if ( ! function_exists( 'fjtss_wpml_data' ) ) {
	function fjtss_wpml_data() {
		global $sitepress;
		$vars = array(
			'current_language' => ICL_LANGUAGE_CODE,
			'icl_home'         => $sitepress->language_url(),
			'ajax_url'         => admin_url('admin-ajax.php'),
		);
		$html = json_encode( $vars );
		echo "<script>var icl_vars = $html;</script>\n";
	}
}
add_action('wp_footer', 'fjtss_wpml_data');