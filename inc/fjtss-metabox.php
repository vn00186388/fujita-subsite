<?php
/**
 * Registering meta boxes
 *
 */


add_filter( 'rwmb_meta_boxes', 'fjtss_register_meta_boxes' );

/**
 * Register meta boxes
 *
 * @param array $meta_boxes List of meta boxes
 * @return array
 */
function fjtss_register_meta_boxes( $meta_boxes ) {

	$prefix = 'fjtss_';

	$post_id = $_GET['post'] ? $_GET['post'] : $_POST['post_ID'] ;
	if ( ! empty( $post_id ) ){
		// $page_template = get_post_meta( $post_id, '_wp_page_template', true );
		// if ( $page_template == 'tpl-global-offer/tpl-global-offer.php' ) {
	}


	$attachment_fields = array();
	$languages = apply_filters( 'wpml_active_languages', NULL, 'skip_missing=0&orderby=id&order=desc' );
	if ( !empty( $languages ) ) {

		// Set photo title metaboxes
		$attachment_fields[] = array(
			'type' => 'heading',
			'name' => 'Photo Title',
		);
		foreach( $languages as $lang ) {
			$code = str_replace( '-', '_', $lang['code'] );
			$name = $lang['translated_name'];
			$attachment_fields[] = array(
				'name'    => "Title - {$name}",
				'id'      => "{$prefix}title_{$code}",
				'type'    => 'text',
				'attributes' => array(
					'size'  => 60,
				),
			);
		}

		// Set photo description metaboxes
		$attachment_fields[] = array(
			'type' => 'heading',
			'name' => 'Photo Description',
		);
		foreach( $languages as $lang ) {
			$code = str_replace( '-', '_', $lang['code'] );
			$name = $lang['translated_name'];
			$attachment_fields[] = array(
				'name' => "Description - {$name}",
				'id'   => "{$prefix}description_{$code}",
				'type' => 'textarea',
				'cols' => 20,
				'rows' => 3,
			);
		}
	}

	// Attach photos metaboxes
	$meta_boxes[] = array(
		'title'      => 'Attachment\'s multi-language fields',
		'post_types' => array( 'attachment' ),
		'fields'     => $attachment_fields,
	);


	return $meta_boxes;

}