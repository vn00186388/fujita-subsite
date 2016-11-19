<?php
/*
Template Name: Home
*/
get_header();
get_template_part('template-parts/slide', 'show');
if (have_posts() && function_exists('CFS')) :
	$image_url = has_post_thumbnail() ?  wp_get_attachment_url(get_post_thumbnail_id()) : '';
	$home_map_image = CFS()->get('home_map_image');
	$wifi = CFS()->get('home_wifi');
	$values  = CFS()->get('highlight_section');
	$blog_title = get_the_title();
	?>
	<main class="main-page home-page">
		<div class="container">
			<div class="discover clearfix js_discover__wrapper">
				<h3 class="discover__text pull-left"><?php _e('Discover our Hotel', 'fjtss') ?></h3>
				<a class="discover__scroll pull-right js_discover__scroll">
					<?php _e('Scroll down to read text', 'fjtss') ?><i class="fa fa-sort-desc" aria-hidden="true"></i>
				</a>
			</div>
			<div class="welcome__wrapper clearfix">
				<div class="welcome__content col-sm-12 col-md-6">
					<h2 class='welcome__title'>
						<?php echo sprintf(__( 'Welcome to <br/>%s', 'fjtss' ),	$blog_title	); ?>
					</h2>
					<div class="welcome__text">
						<?php the_content(); ?>
						<a class="icon-wifi <?php echo ($wifi != null) ? 'active' : '' ?>">
							<img src="<?php echo get_template_directory_uri() . '/img/wifi.png' ?>"
								 alt="<?php _e('wifi logo', 'fjtss') ?>"/>
							<span class="icon-wifi-text"><?php _e('Free wifi', 'fjtss') ?></span>
						</a>
					</div>
				</div>
				<div class="deals col-sm-12 col-md-6">
					<div class="col-sm-6 col-sm-push-6">
						<div class="card__wrapper promotion">
							<div class="card clearfix">
								<img class="card__photo" src="<?php echo get_template_directory_uri() . '/img/twin-room.jpg' ?>"
									 alt="<?php _e('highlight image', 'fjtss') ?>"/>
								<h3 class="card__title"></h3>
								<p class="card__text"><?php _e('from', 'fjtss') ?> <span class="card__price"></span> <?php _e('per night', 'fjtss') ?></p>
								<div class="col-xs-6 col-md-12">
									<div class="details"></div>
									<div class="row"><a class="card__link"><?php _e('See more details', 'fjtss') ?><br></a></div>
								</div>
								<div class="col-xs-6 col-md-12">
									<div class="row">
										<a class="btn card__button" href="javascript:;"><?php _e('Book Now','fjtss'); ?></a>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="col-sm-6 col-sm-pull-6">
						<div class="card__wrapper highlight js_highlight">
							<?php
							if ( $values != null ) :
								foreach ( $values as $post_id )  :
									$the_post = get_post( $post_id );
									$highlight_image = has_post_thumbnail($post_id) ?  wp_get_attachment_url(get_post_thumbnail_id($post_id)) : '';
									?>
									<div class="card">
										<div class="highlight__title">
											<h4 class="highlight__title__text"><?php _e('highlight section', 'fjtss') ?></h4>
										</div>
										<img class="card__photo" src="<?php echo $highlight_image ?>"
											 alt="<?php _e('highlight image', 'fjtss') ?>"/>
										<h3 class="card__title"><?php echo $the_post->post_title; ?></h3>
										<p class="card__text"><?php echo $the_post->post_content ?></p>
										<a class="card__link" href="<?php echo esc_url(get_permalink($post_id)) ?>">
											<?php _e('See more details', 'fjtss') ?>
										</a>
									</div>
								<?php	endforeach;
							endif; ?>
						</div>
					</div>
				</div>
				<div class="row clearfix">
					<div class="map col-sm-12 col-md-7">
						<?php if ($home_map_image != null) : ?>
							<img class="map__image" src="<?php echo $home_map_image ?>"
								 alt="<?php _e('hotel map', 'fjtss') ?>"/>
						<?php else: ?>
							<div id="map"></div>
						<?php endif; ?>
					</div>
					<div class="feature col-md-5">
						<img src="<?php echo $image_url ?>" alt="<?php _e('hotel feature', 'fjtss') ?>" width="100%" />
					</div>
				</div>
			</div>
			<div class="maker__hotel"><?php echo get_template_directory_uri() . '/img/icon-map-marker-blue.png' ?></div>
		</div>
	</main>
	<?php
	echo fjtss_websdk_home_offer_config();
endif;
get_footer();
