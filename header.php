<?php
/**
 * The header for our theme.
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package fjtss
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
<link rel="profile" href="http://gmpg.org/xfn/11">
<script>var $fjtss_url = "<?php echo trailingslashit( get_bloginfo( 'wpurl' ) ); ?>";</script>
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<div id="page" class="hfeed site js_site">
	<!--<div class="seo-bar js_seo-bar">
		<h1>Yokohama Sakuragicho Washington Hotel</h1><span>Hotel from Yokohama Sakuragi-cho Station 1-minute walk</span>
	</div>-->
	<?php /*if ( class_exists('Fb_Seo_Heading_Widget') ): */?><!--
		<div class="header__fb-seo">
			<?php /*the_widget('Fb_Seo_Heading_Widget'); */?>
		</div>
	--><?php /*endif */?>
	<header class="header js_header">

			<?php get_template_part( 'template-parts/header', 'utility' ) ?>

			<?php get_template_part( 'template-parts/header', 'qs' ) ?>

			<?php get_template_part( 'template-parts/header', 'nav' ) ?>

		
	</header>

	<div id="content" class="site-content">