<?php

// [mon] since metabox is not used for now, lets do save post directly
// if ( function_exists( 'rwmb_meta' ) ) {
// 	add_action( 'rwmb_after_save_post', 'fjtss_save_place', 10, 1 );
// } else {
	// add_action( 'save_post_place', 'fjtss_save_place', 10, 1 );
// }

if ( function_exists( 'pods' ) ) {
	add_action( 'pods_meta_save_post_place', 'fjtss_save_place', 10, 5 );
} else {
	add_action( 'save_post_place', 'fjtss_save_place', 10, 1 );
}

/**
 * Action when a page post is saved
 */
function fjtss_save_place( $data, $pod, $post_id, $groups, $post ) {
// function fjtss_save_place( $post_id ) {
	// $post = get_post( $post_id );
	if ( 'place' == $post->post_type ) {
		fjtss_save_place_generate_json( 'places' );
	}
}

/**
 * JSON generator
 */
function fjtss_save_place_generate_json( $fileid = null ) {
	if ( ! empty( $fileid ) ) {
		$data = fjtss_save_place_places();

		if ( ! empty( $data ) && ! rojak_empty_array( $data ) ) {
			$path = rojak_get_json_site_dir() . fjtss_get_site_json_filenames( $fileid );
			rojak_write_to_file( $path, json_encode( $data ) );
		}
	}
}

function fjtss_save_place_places() {
	$count = 0;
	$page_data = array();

	$post_type = 'place';
	$args = array(
		'post_type'        => $post_type,
		'post_status'      => 'publish',
		'posts_per_page'   => -1,
		'suppress_filters' => 0,
		'orderby'          => 'menu_order',
		'order'            => 'ASC',
	);
	$page_query = new WP_Query($args);
	if ( $page_query->have_posts() ) {
		$data_json = array();
		while ( $page_query->have_posts() ) { $page_query->the_post();
			$id  = $page_query->post->ID;

			// set base data
			$page_data[$count] = fjtss_save_place_base_data( $page_query->post );

			// set featured image data
			$page_data[$count]['featured_image'] = fjtss_save_place_thumbnail( $page_query->post->ID );

			// default handling of other post_meta's
			$post_meta = fjtss_save_place_get_metabox( $id );
			if ( ! empty( $post_meta ) ) {
				$page_data[$count]['post_meta'] = $post_meta;
			}
			if(!array_key_exists($post_meta['place_type'], $data_json)){
				$data_json[$post_meta['place_type']] = [];
			}
			array_push($data_json[$post_meta['place_type']], array(
				'post_title'		=> $page_data[$count]['post_title'],
				'post_name'			=> $page_data[$count]['post_name'],
				'post_content'		=> $page_data[$count]['post_content'],
				'url'				=> $page_data[$count]['url'],
				'featured_image'	=> $page_data[$count]['featured_image'],
				'place_address'		=> $post_meta['place_address'],
				'place_latlng'		=> $post_meta['place_latlng'],
				'place_website'		=> $post_meta['place_website'],
			));

			$count++;
		}
	}
	wp_reset_query();

	if ( ! rojak_empty_array( $data_json ) ) {
		return $data_json;
	}

	return false;
}


function fjtss_save_place_base_data( $post ) {
	$page_data = array();
	$page_data = fjtss_get_base_info( $post );
	$page_data['post_title'] = do_shortcode( $post->post_title );

	// set content
	if ( ! empty( $post->post_content ) ) {
		$page_data['post_content'] =
			do_shortcode(
				apply_filters( 'the_content',
					$post->post_content ) );
		$page_data['post_excerpt'] =
			rojak_get_excerpt( $post->post_excerpt, $post->post_content );
	}

	return $page_data;
}

function fjtss_save_place_has_subpages( $id ) {
	$subpages = fjtss_save_place_get_subpages( $id  );
	return $subpages->have_posts();
}

function fjtss_save_place_get_subpages( $id ) {
	$subpage_args = array(
		'post_type'        => 'page',
		'post_status'      => 'publish',
		'posts_per_page'   => -1,
		'post_parent'      => $id,
		'suppress_filters' => 0,
		'orderby'          => 'menu_order',
		'order'            => 'ASC',
	);
	$subpages = new WP_Query( $subpage_args );
	return $subpages;
}


function fjtss_save_place_get_metabox( $id ) {
	// default handling of other post_meta's
	$meta_pfx    = 'place_';
	$meta_fields = array();
	$page_meta   = get_post_meta( $id );
	foreach( $page_meta AS $meta => $value ) {
		$meta_value = null;
		if ( rojak_str_starts_with( $meta, $meta_pfx ) ) {
			if ( count( $value ) == 1 ) {
				$meta_value = $value[0];
			} else {
				$meta_value = $value;
			}

			if ( ! empty( $meta_value ) || ! rojak_empty_array( $meta_value )	) {
				$meta_fields[$meta] = $meta_value;
			}
		}
	}

	if ( ! rojak_empty_array( $meta_fields ) ) {
		return $meta_fields;
	}

	return false;
}

function fjtss_save_place_thumbnail( $id ) {
	$thumb_id    = get_post_thumbnail_id( $id );
	$img_thumb 	 = fjtss_get_img_url('slider-thumb', $thumb_id);


	return $img_thumb != false ? $img_thumb : '#';

}

function fjtss_save_place_gallery( $id ) {

	$attachments = rojak_get_post_attachments( $id );

	if ( ! rojak_empty_array( $attachments ) ) {
		$count = 0;
		$slider_data = array();
		foreach ( $attachments as $attachment ) {
			$image_info   = wp_prepare_attachment_for_js( $attachment->ID );
			$image_large  = wp_get_attachment_image_src( $image_info["id"], 'gallery' );
			$image_url    = $image_large[0];
			$image_width  = $image_large[1];
			$image_height = $image_large[2];
			$image_title  = $image_info[ "title" ];

			$image_alt        = $image_info["alt"];
			if ( empty( $image_alt ) ) {
				$image_alt = $image_title;
			}

			$lang_code = str_replace( '-', '_', ICL_LANGUAGE_CODE );
			$attachment_caption = rwmb_meta( "santika_title_{$lang_code}", array(), $attachment->ID );
			if ( empty( $attachment_caption ) ) {
				$attachment_caption     = do_shortcode( $image_info["caption"] );
			}
			$attachment_description = rwmb_meta( "santika_description_{$lang_code}", array(), $attachment->ID );
			if ( empty( $attachment_description ) ) {
				$attachment_description = do_shortcode( $image_info["description"] );
			}

			// Make sure the large image size is 1600 x 800
			$slider_data[$count]['ID']           = $attachment->ID;
			$slider_data[$count]['post_title']   = $attachment->post_title;
			$slider_data[$count]['post_name']    = $attachment->post_name;
			if ( ! empty( $attachment_description ) ) {
				$slider_data[$count]['description']= $attachment_description;
			}
			if ( ! empty( $attachment_caption ) ) {
				$slider_data[$count]['caption']    = $attachment_caption;
			}

			// Make sure the large image size is 1600 x 800
			$slider_data[$count]['is_valid'] = false;
			if ( $image_width == 1200 && $image_height == 750 ) {
				$slider_data[$count]['is_valid'] = true;
			}

			$slider_data[$count]['img']['large'] = fjtss_get_img_url( $attachment->ID, 'gallery' );
			$slider_data[$count]['img']['thumb'] = fjtss_get_img_url( $attachment->ID, 'gallery-thumb' );
			$slider_data[$count]['img']['medium'] = fjtss_get_img_url( $attachment->ID, 'gallery-medium' );

			$count++;
		}
		return $slider_data;
	}
	return false;
}
