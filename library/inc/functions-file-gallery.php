<?php
/**
 * Functions for handling File Gallery attachments
 *
 * @package    Rojak
 * @subpackage Includes
 * @author     Fastbooking <studioweb-fb@fastbooking.net>
 * @copyright  Copyright (c) 2016, Fastbooking
 * @link
 * @license    http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 */

/**
 * Set the default options
 *
 * @since  0.9.0
 * @access public
 * @return array
 */
function rojak_fg_get_options() {
	global $post;
	//Removed slide show tag. 
	return array(
		'post_type' => 'page',
		'post_id'   => $post->ID,
	);
}

/**
 * Get attachments that have 'slideshow' as media tag
 * If there is no attachments with 'slideshow' media tag
 * It will look to its primary language. See below conditions in order:
 * 		1. Current post of current language
 * 		2. Alternate post of primary language
 * 		3. Homapage of primary language
 *
 * @since  0.9.0
 * @access public
 * @param  array $options
 * @return bool
 */
function rojak_fg_multilang_get_slideshow( $options = array() ) {
	$default_options = rojak_fg_get_options();
	$options = wp_parse_args( $options, $default_options );

	$attachments = rojak_fg_multilang_get_post_attachments( $options );
	if ( false == $attachments ) {
		$attachments = rojak_fg_multilang_get_home_attachments( $options );
	}

	if ( rojak_empty_array( $attachments ) ) {
		return false;
	}

	return $attachments;
}

/**
 * Get attachments of a post in either current post
 * or from the primary language of post
 * See below conditions in order:
 * 		1. Current post of current language
 * 		2. Alternate post of primary language
 *
 * @since  0.9.0
 * @access public
 * @param  array $options
 * @return bool
 */
function rojak_fg_multilang_get_post_attachments( $options = array() ) {
	$default_options = rojak_fg_get_options();
	$options = wp_parse_args( $options, $default_options );

	// get from page of current language
	if ( rojak_fg_has_attachments( $options ) ) {
		$attachments = rojak_fg_get_attachments( $options );
	} else {
		$options['post_id'] = rojak_get_primary_lang_post_id(
			$options['post_id'],
			$options['post_type']
		);
		// get from page of primary language
		if ( rojak_fg_has_attachments( $options ) ) {
			$attachments = rojak_fg_get_attachments( $options );
		}
	}

	if ( rojak_empty_array( $attachments ) ) {
		return false;
	}

	return $attachments;
}

/**
 * Get attachments of homepage or from the primary language homepage
 *
 * @since  0.9.0
 * @access public
 * @param  array $options
 * @return bool
 */
function rojak_fg_multilang_get_home_attachments( $options = array() ) {
	$default_options = rojak_fg_get_options();
	$options = wp_parse_args( $options, $default_options );

	// get from homepage of primary language
	$options['post_id'] = rojak_get_primary_lang_post_id(
		get_option('page_on_front'),
		$options['post_type']
	);
	if ( rojak_fg_has_attachments( $options ) ) {
		$attachments = rojak_fg_get_attachments( $options );
	}

	if ( rojak_empty_array( $attachments ) ) {
		return false;
	}

	return $attachments;
}

/*
 * Returns the post attachments
 *
 * @since  0.9.0
 * @access public
 * @param  array $options
 * @return object
 */
function rojak_fg_get_attachments( $options = array() ) {
	$default_options = rojak_fg_get_options();
	$options = wp_parse_args( $options, $default_options );

	$args = array(
		'posts_per_page' => -1,
		'order'          => 'ASC',
		'orderby'        => 'menu_order',
		'post_type'      => 'attachment',
		'post_parent'    => $options['post_id'],
		'post_mime_type' => 'image',
		'post_status'    => null
	);
	$attachments = get_posts( $args );

	return $attachments;
}

/**
 * Whether post has attachments with the specified media tag
 *
 * @since  0.9.0
 * @access public
 * @param  array $options
 * @return bool
 */
function rojak_fg_has_attachments( $options = array() ) {
	$default_options = rojak_fg_get_options();
	$options = wp_parse_args( $options, $default_options );

	$args = array(
		'posts_per_page' => -1,
		'order'          => 'ASC',
		'orderby'        => 'menu_order',
		'post_type'      => 'attachment',
		'post_parent'    => $options['post_id'],
		'post_mime_type' => 'image',
		'post_status'    => null
	);
	$attachments = get_posts( $args );

	if ( ! empty( $options['media_tag'] ) && ! rojak_empty_array( $attachments ) ) {
		foreach ( $attachments as $attachment ) {
			$attachment_id = $attachment->ID;
			$term_list     = wp_get_post_terms( $attachment_id, 'media_tag', array( 'fields' => 'all' ) );
			$terms         = array();
			foreach ( $term_list as $term ) {
				array_push( $terms, $term->slug );
			}
			if ( in_array( $options['media_tag'], $terms ) ) {
				return true;
				break;
			}
		}
	} else if ( ! rojak_empty_array( $attachments ) ) {
		return true;
	}

	return false;
}