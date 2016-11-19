<?php
/**
 * The template for displaying 404 pages (not found).
 *
 * @link https://codex.wordpress.org/Creating_an_Error_404_Page
 *
 * @package fjtss
 */

get_header();
get_template_part('template-parts/slide', 'show');
?>

<main class="main-page main-404">
	<div class="container">
		<h3 class="main__title"></h3>
		<div class="main__content-row page__404">
			<div class="title">404
				<div class="error"><?php _e( 'The page you are looking for does not exist.', 'fjtss' ) ?></div>
			</div>
			<a href="<?php echo get_site_url() ?>">
				<div class="btn__home__page"><?php _e('go to homepage', 'fjtss') ?></div>
			</a>
		</div>
	</div>
</main>

<?php get_footer();
