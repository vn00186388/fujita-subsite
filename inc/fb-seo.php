<?php

if(!class_exists('Fb_Seo_Heading_Widget')):

    class Fb_Seo_Heading_Widget extends WP_Widget {
        /**
         * Register widget with WordPress.
         */
        public function __construct() {
            parent::__construct(
                'fbseo_widget', // Base ID
                'Fastbooking: FB SEO', // Name
                array(
                    'description' => __( 'Fastbooking: FB SEO' )
                )
            );
        }

        public function widget( $args, $instance ) {
            // outputs the content of the widget
            $toret = '<div class="fb-seo js_fb-seo">';

            if(function_exists('fbseo_get_h1')){
                //fbseo_get_h1();
                global $fbseoManager,$post;
                $toret .= '<h1 class="fb-seo__title fb-seo__txt">' . $fbseoManager->getSeo($post, 'h1') . '</h1>';
            }


            if(function_exists('fbseo_get_h1_extra')){
                //fbseo_get_h1_extra();
                global $fbseoManager,$post;
                $toret .= '<span class="fb-seo__extra fb-seo__txt">' . $fbseoManager->getSeo($post, 'h1_extra') . '</span>';
            }
            $toret .= '</div>';
            echo $toret;
        }

    }

endif;


if(!function_exists('fb_seo_register_widget')):

    function fb_seo_register_widget() {
        register_widget( 'Fb_Seo_Heading_Widget' );
    }

endif;

add_action( 'widgets_init', 'fb_seo_register_widget' );