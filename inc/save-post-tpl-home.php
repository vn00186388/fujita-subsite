<?php

add_action( 'save_post', 'fjtss_tplHome_OnSave', 10, 2 );

/**
 * Action when homepage is saved
 */
function fjtss_tplHome_OnSave( $post_id, $post) {

	// If this is just a revision, don't send the email.
	if ( wp_is_post_revision( $post_id ) )
		return;

	$home_id = get_option( 'page_on_front' );
	if ( $home_id == $post_id ) {
		fjtss_json_generate_tpl_home();
	}

}

/**
 * JSON generator for all the data needed in Homepage
 */
function fjtss_json_generate_tpl_home() {

	$home_all_data  =  array(
		'slideshow'     => fjtss_tplHome_slideshowData(),
	);

	$file_path = rojak_get_json_site_dir() . fjtss_get_site_json_filenames( 'tpl-home' );
	rojak_write_to_file( $file_path, json_encode( $home_all_data ) );

}


function fjtss_tplHome_slideshowData() {
	
	$fg_attachments = rojak_fg_multilang_get_slideshow();

	if ( $fg_attachments ) {
		$count = 0;
		$slider_data = array();
		foreach ( $fg_attachments as $attachment ) {
			
			// Removed the check for media tag slideshow
			$image_info   = wp_prepare_attachment_for_js( $attachment->ID );
			$image_large  = wp_get_attachment_image_src( $image_info["id"], 'slider' );
			$image_url    = $image_large[0];
			$image_width  = $image_large[1];
			$image_height = $image_large[2];
			$image_title  = $image_info[ "title" ];

			$image_alt        = $image_info["alt"];
			if ( empty( $image_alt ) ) {
				$image_alt = $image_title;
			}

			$lang_code = str_replace( '-', '_', ICL_LANGUAGE_CODE );
			$attachment_caption = rwmb_meta( "fjtss_title_{$lang_code}", array(), $attachment->ID );
			if ( empty( $attachment_caption ) ) {
				$attachment_caption     = $image_info["caption"];
			}
			$attachment_description = rwmb_meta( "fjtss_description_{$lang_code}", array(), $attachment->ID );
			if ( empty( $attachment_description ) ) {
				$attachment_description = $image_info["description"];
			}

			// Make sure the large image size is 1920 x 1080
			if ( $image_width == 1920 && $image_height == 1080 ) {
				$slider_data[$count]['ID']           = $attachment->ID;
				$slider_data[$count]['post_title']   = $attachment->post_title;
				$slider_data[$count]['post_name']    = $attachment->post_name;
				$slider_data[$count]['css']          = "slider-home__item-{$attachment->ID} slider-home__item js_slider-home__item";
				$slider_data[$count]['img']['large'] = fjtss_get_img_url( 'slider', $attachment->ID );
				$slider_data[$count]['img']['thumb'] = fjtss_get_img_url( 'slider-thumb', $attachment->ID );
				if ( empty( $slider_data[$count]['img']['thumb'] ) ) {
					$slider_data[$count]['img']['thumb'] = fjtss_get_img_url( 'slider', $attachment->ID );
				}
				$slider_data[$count]['description'] = $attachment_description;
				$slider_data[$count]['caption'] = $attachment_caption;

				$count++;
			}
		}
		return $slider_data;
	}
	return false;
}
