<?php

if ( ! function_exists( 'fjtss_data' ) ) {
	function fjtss_data() {
		$vars = array(
			'site_slug'             => fjtss_get_site_slug(),
			// 'str_booknow'        => __( 'Check Availability', 'okuranikko' ),
			// 'str_booknow_isopen' => __( 'Hide', 'okuranikko' ),
			// 'str_menu'           => __( 'Menu', 'okuranikko' ),
			// 'str_view_website'   => __( 'View Website', 'okuranikko' ),
		);

		$env_url = get_bloginfo( 'wpurl' );
		if ( rojak_str_contains( $env_url, '//fujita.dev' ) ) {
			$vars['group_rest_url'] = '//fujita.dev/fujita-group/wp-json/fujita-group/v1/';
		} else if ( rojak_str_contains( $env_url, '.wsdasia-sg-1.wp-ha.fastbooking.com' ) ) {
			$vars['group_rest_url'] = '//fujita-group.wsdasia-sg-1.wp-ha.fastbooking.com/wp-json/fujita-group/v1/';
		}

		$html = json_encode( $vars );
		echo "<script>var fjtss_data = $html;</script>\n";
	}
}
add_action('wp_footer', 'fjtss_data');

/**
 * Add async fonts
 */
function fjtss_fonts() {
/*/
?>
<script>
  (function(d) {
    var config = {
      kitId: 'vvl4ywy',
      scriptTimeout: 3000,
      async: true
    },
    h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
  })(document);
</script>
<?php
/*/
}
add_action('wp_footer', 'fjtss_fonts', 110);


/**
 * Google Tag Manager
 */
if ( ! function_exists( 'fjtss_google_tag_manager' ) ) {
	function fjtss_google_tag_manager() {
/*/
		$site_url = get_site_url();
		if( rojak_str_contains( $site_url, '//www.holidayvilla.com' ) ) {
			echo <<<HTML
<!-- Google Tag Manager -->
<noscript><iframe src="//www.googletagmanager.com/ns.html?id=GTM-"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-');</script>
<!-- End Google Tag Manager -->
HTML;
		}
/*/
	}
}
add_action('wp_footer', 'fjtss_google_tag_manager', 120);


/**
 * Add respond.js for IE
 */
if ( ! function_exists( 'fjtss_ie_support' ) ) {
	function fjtss_ie_support() {
		echo <<<HTML
<!--[if lte IE 8]>
	<script src="//cdnjs.cloudflare.com/ajax/libs/respond.js/1.4.2/respond.min.js" defer='defer'></script>
<![endif]-->
HTML;
	}
}
add_action('wp_footer', 'fjtss_ie_support', 130);