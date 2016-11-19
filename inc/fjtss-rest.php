<?php

if ( ! function_exists( 'fjtss_api_post_menu' ) ) {
	function fjtss_api_post_menu( $url_param ) {
		$fileid     = 'menu';
		$menu       = fjtss_get_json( $fileid );
		$hotel_json = fjtss_get_hotel_json_filepath();
		$menu_json  = fjtss_get_json_filepath( $fileid );

		// $hotel_json will always exist, handled in root site
		// TODO: figure out how to generate $hotel_json from subsite
		// $menu_json will always exist, because of fjtss_get_json()
		// Check if $menu_json is updated
		if ( filemtime( $menu_json ) < filemtime( $hotel_json ) ) {
			fjtss_save_page_generate_json( $fileid );
		}

		if ( ! rojak_empty_array( $menu ) ) {
			return $menu;
		}

		return new WP_Error( 'no_data', "No data was found", array( 'status' => 404 ) );
	}
}

if ( ! function_exists( 'fjtss_api_post_pages' ) ) {
	function fjtss_api_post_pages( $url_param ) {
		$fileid     = 'pages';
		$posts      = fjtss_get_json( $fileid );
		$hotel_json = fjtss_get_hotel_json_filepath();
		$page_json  = fjtss_get_json_filepath( $fileid );

		// $hotel_json will always exist, handled in root site
		// TODO: figure out how to generate $hotel_json from subsite
		// $page_json will always exist, because of fjtss_get_json()
		// Check if $page_json is updated
		if ( filemtime( $page_json ) < filemtime( $hotel_json ) ) {
			fjtss_save_page_generate_json( $fileid );
		}

		if ( empty( $url_param['parentpage'] ) ) {
			if ( ! rojak_empty_array( $posts ) ) {
				return $posts;
			}
		}

		// check parentpage and subpage params
		else if ( ! empty( $url_param['parentpage'] ) ||
		          ! empty( $url_param['subpage'] ) ) {

			// get parentpage
			$parentpage = null;
			foreach ( $posts as $post ) {
				if ( $post['post_name'] == $url_param['parentpage'] ) {
					$parentpage = $post;

					// get subpage
					if ( ! empty( $url_param['subpage'] ) &&
					     ! rojak_empty_array( $parentpage['subpages'] ) ) {
						$subpage = null;
						foreach ( $parentpage['subpages'] as $sp_post ) {
							if ( $sp_post['post_name'] == $url_param['subpage'] ) {
								$subpage = $sp_post;
								break;
							}
						}
						if ( ! rojak_empty_array( $subpage ) ) {
							return $subpage;
						}
					}

					break;
				}
			}
			if ( ! rojak_empty_array( $parentpage ) ) {
				return $parentpage;
			}
		}

		return new WP_Error( 'no_data', "No data was found", array( 'status' => 404 ) );
	}
}

if ( ! function_exists( 'fjtss_api_post_place_types' ) ) {
	function fjtss_api_post_place_types( $url_param ) {
		$fileid     = 'places';
		$places     = fjtss_get_json( $fileid );
		$hotel_json = fjtss_get_hotel_json_filepath();
		$place_json = fjtss_get_json_filepath( $fileid );

		// $hotel_json will always exist, handled in root site
		// TODO: figure out how to generate $hotel_json from subsite
		// $place_json will always exist, because of fjtss_get_json()
		// Check if $place_json is updated
		if ( filemtime( $place_json ) < filemtime( $hotel_json ) ) {
			fjtss_save_place_generate_json( $fileid );
		}

		$place_types = array();
		foreach ( $places as $place ) {
			$place_types[] = $place['post_meta']['place_type'];
		}

		$place_types = array_values( array_unique( $place_types ) );
		$place_types_final = array();
		foreach ( $place_types as $place ) {
			$place_types_final[] = array(
				'name' => $place
			);
		}

		if ( ! rojak_empty_array( $place_types_final ) ) {
			return $place_types_final;
		}

		return new WP_Error( 'no_data', "No data was found", array( 'status' => 404 ) );
	}
}

if ( ! function_exists( 'fjtss_api_post_places' ) ) {
	function fjtss_api_post_places( $url_param ) {
		$fileid     = 'places';
		$places     = fjtss_get_json( $fileid );
		$hotel_json = fjtss_get_hotel_json_filepath();
		$place_json = fjtss_get_json_filepath( $fileid );

		// $hotel_json will always exist, handled in root site
		// TODO: figure out how to generate $hotel_json from subsite
		// $place_json will always exist, because of fjtss_get_json()
		// Check if $place_json is updated
		if ( filemtime( $place_json ) < filemtime( $hotel_json ) ) {
			fjtss_save_place_generate_json( $fileid );
		}

		if ( empty( $url_param['type'] ) ) {
			if ( ! rojak_empty_array( $places ) ) {
				return $places;
			}
		}

		// check type and subpage params
		else if ( ! empty( $url_param['type'] ) ) {
			// get type
			$places_of_type = array();
			foreach ( $places as $place ) {
				if ( $place['post_meta']['place_type'] == $url_param['type'] ) {
					$places_of_type[] = $place;
				}
			}
			if ( ! rojak_empty_array( $places_of_type ) ) {
				return $places_of_type;
			}
		}

		return new WP_Error( 'no_data', "No data was found", array( 'status' => 404 ) );
	}
}

add_action('rest_api_init', function () {


});


add_action('rest_api_init', function () {
	register_rest_route('fujita-subsite/v1', '/menu/', array(
		'methods' => 'GET',
		'callback' => 'fjtss_api_post_menu',
	));

	// return pages
	register_rest_route('fujita-subsite/v1', '/pages/', array(
		'methods' => 'GET',
		'callback' => 'fjtss_api_post_pages',
	));
	register_rest_route('fujita-subsite/v1', '/pages/(?P<parentpage>[a-zA-Z0-9-]+)', array(
		'methods' => 'GET',
		'callback' => 'fjtss_api_post_pages',
	));
	register_rest_route('fujita-subsite/v1', '/pages/(?P<parentpage>[a-zA-Z0-9-]+)/(?P<subpage>[a-zA-Z0-9-]+)', array(
		'methods' => 'GET',
		'callback' => 'fjtss_api_post_pages',
	));

	// return place types
	register_rest_route('fujita-subsite/v1', '/place-types/', array(
		'methods' => 'GET',
		'callback' => 'fjtss_api_post_place_types',
	));

	// return places
	register_rest_route('fujita-subsite/v1', '/places/', array(
		'methods' => 'GET',
		'callback' => 'fjtss_api_post_places',
	));
	register_rest_route('fujita-subsite/v1', '/places/(?P<type>[a-zA-Z0-9-]+)', array(
		'methods' => 'GET',
		'callback' => 'fjtss_api_post_places',
	));
});
