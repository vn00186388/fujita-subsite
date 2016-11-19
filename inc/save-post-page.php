<?php

// [mon] since metabox is not used for now, lets do save post directly
// if ( function_exists( 'rwmb_meta' ) ) {
// 	add_action( 'rwmb_after_save_post', 'fjtss_save_page', 10, 1 );
// } else {
	add_action( 'save_post_page', 'fjtss_save_page', 10, 1 );
// }

/**
 * Action when a page post is saved
 */
function fjtss_save_page( $post_id ) {

	fjtss_save_page_generate_json( 'menu' );

	fjtss_save_page_generate_json( 'pages' );

}

/**
 * JSON generator
 */
function fjtss_save_page_generate_json( $fileid = null ) {
	if ( ! empty( $fileid ) ) {
		$data = null;
		if ( 'menu' == $fileid ) {
			$data  = fjtss_save_page_menu();
		} else if ( 'pages' == $fileid ) {
			$data  = fjtss_save_page_pages();
		}

		if ( ! empty( $data ) && ! rojak_empty_array( $data ) ) {
			$path = rojak_get_json_site_dir() . fjtss_get_site_json_filenames( $fileid );
			rojak_write_to_file( $path, json_encode( $data ) );
		}
	}
}

function fjtss_save_page_menu() {
	$count = 0;
	$page_data = array();

	$post_type = 'page';
	$args = array(
		'post_type'        => $post_type,
		'post_status'      => 'publish',
		'posts_per_page'   => -1,
		'post_parent'      => 0,
		'suppress_filters' => 0,
		'orderby'          => 'menu_order',
		'order'            => 'ASC',
	);
	$page_query = new WP_Query($args);
	if ( $page_query->have_posts() ) {
		while ( $page_query->have_posts() ) { $page_query->the_post();
			$id  = $page_query->post->ID;

			// remove offers if there is No rates
			// $hotel = fjtss_get_hotel_json();
			// if ( 'offers' == $page_query->post->post_name &&
			// 		 rojak_empty_array( $hotel['rates'] ) ) {
			// 	continue;
			// }

			// remove gallery if there are No attachments
			// if ( 'gallery' == $page_query->post->post_name ) {
			// 	$gallery_has_attachments = rojak_has_page_attachments( $id );
			// 	if ( false == $gallery_has_attachments ) {
			// 		continue;
			// 	}
			// }

			// // [mon] remove destinations, client has no content
			// if ( 'destinations' == $page_query->post->post_name ) {
			// 	continue;
			// }

			// // check if page has subpages, remove if none
			// if ( 'home'         != $page_query->post->post_name &&
			//      'destinations' != $page_query->post->post_name &&
			//      'gallery'      != $page_query->post->post_name ) {
			// 	$has_subpages = fjtss_save_page_has_subpages( $id );
			// 	if ( false == $has_subpages &&
			// 	     empty( $page_query->post->post_content ) ) {
			// 		continue;
			// 	}
			// }

			// set base data
			$page_data[$count] = fjtss_save_page_base_data( $page_query->post );

			// no need of the following base content
			unset(
				$page_data[$count]['post_content'],
				$page_data[$count]['post_excerpt'] );

			$count++;
		}
	}
	wp_reset_query();

	if ( ! rojak_empty_array( $page_data ) ) {
		return $page_data;
	}

	return false;
}


function fjtss_save_page_pages() {
	$count = 0;
	$page_data = array();

	$post_type = 'page';
	$args = array(
		'post_type'        => $post_type,
		'post_status'      => 'publish',
		'posts_per_page'   => -1,
		'post_parent'      => 0,
		'suppress_filters' => 0,
		'orderby'          => 'menu_order',
		'order'            => 'ASC',
	);
	$page_query = new WP_Query($args);
	if ( $page_query->have_posts() ) {
		while ( $page_query->have_posts() ) { $page_query->the_post();
			$id  = $page_query->post->ID;

			// if ( 'gallery' == $page_query->post->post_name ) {
			// 	$gallery_has_attachments = rojak_has_page_attachments( $id );
			// 	if ( false == $gallery_has_attachments ) {
			// 		continue;
			// 	}
			// }

			// // check if page has subpages, remove if none
			// $has_subpages = fjtss_save_page_has_subpages( $id );
			// if ( 'home'         != $page_query->post->post_name &&
			//      'destinations' != $page_query->post->post_name &&
			//      'gallery'      != $page_query->post->post_name ) {
			// 	if ( false == $has_subpages &&
			// 	     empty( $page_query->post->post_content ) ) {
			// 		continue;
			// 	}
			// }

			// set base data
			$page_data[$count] = fjtss_save_page_base_data( $page_query->post );

			// set featured image data
			$page_thumbnail = fjtss_save_page_thumbnail( $page_query->post->ID );
			if ( ! rojak_empty_array( $page_thumbnail) ) {
				$page_data[$count]['featured_image'] = $page_thumbnail;
			}

			// default handling of other post_meta's
			$post_meta = fjtss_save_page_get_metabox( $id );
			if ( ! empty( $post_meta ) ) {
				$page_data[$count]['post_meta'] = $post_meta;
			}

			// did a check above, now do query the attachments
			// if ( 'gallery' == $page_query->post->post_name ) {
			// 	$slider_data = fjtss_save_page_gallery( $id );
			// 	if ( ! rojak_empty_array( $slider_data ) ) {
			// 		$page_data[$count]['attachments'] = $slider_data;
			// 	}
			// }

			// query subpages
			if ( $has_subpages ) {
				$subpages = fjtss_save_page_get_subpages( $id );
				$subpages_count = 0;
				$subpages_data = array();
				while ( $subpages->have_posts() ) { $subpages->the_post();
					$subpages_data[$subpages_count] = fjtss_save_page_base_data( $subpages->post );
					$post_meta = fjtss_save_page_get_metabox( $subpages->post->ID );
					if ( ! empty( $post_meta ) ) {
						$subpages_data[$subpages_count]['post_meta'] = $post_meta;
					}
					// add featured iamge.
					$subpage_thumbnail = fjtss_save_page_thumbnail( $subpages->post->ID );
					if ( ! rojak_empty_array( $subpage_thumbnail) ) {
						$subpages_data[$subpages_count]['featured_image'] = $subpage_thumbnail;
					}

					// add file gallery.
					$slider_data = fjtss_save_page_gallery( $subpages->post->ID );
					if ( ! rojak_empty_array( $slider_data ) ) {
						$subpages_data[$subpages_count]['attachments'] = $slider_data;
					}

					// add exverpt.
					$subpages_data[$subpages_count]['post_excerpt'] = $subpages->post->post_excerpt;

					$subpages_count++;
				}
				$page_data[$count]['subpages'] = $subpages_data;
			}

			$count++;
		}
	}
	wp_reset_query();

	if ( ! rojak_empty_array( $page_data ) ) {
		return $page_data;
	}

	return false;
}


function fjtss_save_page_base_data( $post ) {
	$page_data = array();
	$page_data = fjtss_get_base_info( $post );
	$page_data['post_title'] = do_shortcode( $post->post_title );

	// set page_template
	$page_template = get_post_meta( $post->ID, '_wp_page_template', true );
	if ( 'default' != $page_template &&
	      ! empty( $page_template ) ) {
		$page_data['page_template'] = $page_template;
	}

	// set content
	if ( ! empty( $post->post_content ) ) {
		$page_data['post_content'] =
			do_shortcode(
				apply_filters( 'the_content',
					$post->post_content ) );
		$page_data['post_excerpt'] =
			rojak_get_excerpt( $post->post_excerpt, $post->post_content );
	}

	// get hotel's json based satikass_get_site_slug()
	// $hotel = fjtss_get_hotel_json();

	// set hotel url based from $hotel json
	// $page_data['hotel_url'] = trailingslashit( $hotel['hotel_url'] );
	// if ( 'home' != $post->post_name ) {
	// 	if ( empty( $post->post_parent ) ) {
	// 		$page_data['hotel_url'] .= $post->post_name;
	// 	} else {
	// 		$parentpage = get_post( $post->post_parent );
	// 		$page_data['hotel_url'] .= trailingslashit( $parentpage->post_name );
	// 		$page_data['hotel_url'] .= trailingslashit( $post->post_name );
	// 	}
	// }

	return $page_data;
}

function fjtss_save_page_has_subpages( $id ) {
	$subpages = fjtss_save_page_get_subpages( $id  );
	return $subpages->have_posts();
}

function fjtss_save_page_get_subpages( $id ) {
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


function fjtss_save_page_get_metabox( $id ) {
	// default handling of other post_meta's
	$meta_pfx    = 'santika_';
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

			if ( rojak_str_contains( $meta, '_room_' ) ||
			     rojak_str_contains( $meta, '_meeting_' ) ) {
				$items_arr = preg_split('~\n~', $meta_value);
				$meta_value = $items_arr;
			}

			if ( rojak_str_contains( $meta, '_dining_' ) ) {
				if ( rojak_str_contains( $meta, 'title') ) {
					$meta_value = do_shortcode( $meta_value );
				} elseif (rojak_str_contains( $meta, 'img' ) ) {
					$thumb_size = array( 'hotel_room_thumb', 'facility_thumb', 'hero' , 'dining_update' );
					$thumb_array = array();

					foreach ($thumb_size as $size_name => $value) {
						$image_src = wp_get_attachment_image_src( $meta_value, $value, false );
						if ( !empty($image_src) ) {
							$thumb_array[$value] = $image_src[0];
						}
					}

					if ( !empty($thumb_array) ) {
						$meta_value = $thumb_array;
					}
				}
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

function fjtss_save_page_thumbnail( $id ) {
	$thumb_id = get_post_thumbnail_id( $id );
	$thumb_size = array( 'hotel_room_thumb', 'facility_thumb', 'hero' , 'dining_update' );
	$thumb_array = array();

	foreach ($thumb_size as $size_name => $value) {
		$image_src = wp_get_attachment_image_src( $thumb_id, $value, false );
		if ( !empty($image_src) ) {
			$thumb_array[$value] = $image_src[0];
		}
	}

	if ( !empty($thumb_array) ) {
		return $thumb_array;
	}

	return false;
}

function fjtss_save_page_gallery( $id ) {

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
