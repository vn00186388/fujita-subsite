<?php
/**
 * Class page walker
 */
class Page_Walker extends Walker_Page
{
    /**
     * Ends the element output, if needed.
     *
     * The $args parameter holds additional values that may be used with the child class methods.
     *
     * @since 2.1.0
     * @abstract
     *
     * @param string $output Passed by reference. Used to append additional content.
     * @param object $object The data object.
     * @param int    $depth  Depth of the item.
     * @param array  $args   An array of additional arguments.
     */
    function end_el( &$output, $object, $depth = 0, $args = array() ) {
        //if this is Guest Room page, display all room categories.
        if (get_page_template_slug($object->ID) == 'tpl-accommodation/tpl-accommodation.php') {
            $args = array(
                'numberposts' => -1,
                'post_type'      => 'room',
                'posts_per_page' => -1,
                'suppress_filters' => 0,
            );
            $url = esc_url(get_permalink($object->ID));
            $room_query = new WP_Query( $args );

            $output .= '<ul>';
            while ( $room_query->have_posts() ) {
                $room_query->the_post();
                //To make sure title is clean.
                $title = get_the_title();
                $title = preg_replace("/[^a-zA-Z0-9_\s-]/", "", $title); // Make alphanumeric (removes all other characters)
                $title = preg_replace("/[\s-]+/", " ", $title); // Clean up multiple dashes or whitespaces
                $title = str_replace('_', " ", $title); // Remove underscore duh
                $output .= '<li class="page_item_in_part"><a href="' . $url . '#' . $title . '">' . $title . '</a></li>';
            }
            $output .= '</ul></li>';
        }else{
            $output .= '</li>';
        }

    }
}
