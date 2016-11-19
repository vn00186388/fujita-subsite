<?php

if ( ! function_exists( 'fjtss_websdk_get' ) ) {
	function fjtss_websdk_get( $key ) {
		$locales = array(
			'en'    => 'en_GB',
			'fr'    => 'fr_FR',
			'de'    => 'de_DE',
			'it'    => 'it_IT',
			'ru'    => 'ru_RU',
			'es'    => 'es_ES',
			'pt-pt' => 'pt_PT'
		);
		$locale = isset($locales[ICL_LANGUAGE_CODE]) ? $locales[ICL_LANGUAGE_CODE] : 'en_GB';
		$settings = array(
			'locale' => $locale,
			'host'   => 'websdk.fastbooking-cloud.ch',
			'token'  => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZXMiOiJeb2ZmZXJzJCIsInByb3BlcnRpZXMiOiJeanAodXxhfGl8ZnxjfG58dHxrfG98c3xtfGh8eSlbYS16XXsyfVxcZHs0LDV9JCIsImdyb3VwcyI6Il4kIiwiZm9yIjoiRnVqaXRhIiwiaWF0IjoxNDc1ODMyMzU0LCJqdGkiOiIwMGRjZjkzMC1iZmYzLTQyZmItYjVlNC02ZTBjY2I2MmI0ODEifQ.4v-T3oXqyMWf5FAY1ZzaE8RZAQhIQDm1-2eX97WVTac',
		);

		if ( array_key_exists( $key, $settings ) ) {
			return $settings[ $key ];
		}

		return false;
	}
}


if ( ! function_exists( 'fjtss_websdk_home_offer_template' ) ) {
	function fjtss_websdk_home_offer_template() { ?>
		<script id="js_websdk__home-offers_template" type="text/x-mustache-template">
			<ul id="{{prop.connectName}}">
				{{#rates}}
				<li class="promo-wrapper" id="{{rate.name}}">
					<div class="promotion">
						<div class="title">{{{rate.title}}}</div>
						<div class="price">
							<span class="apd"><?php _e('From','fjtss'); ?></span>
							<span class="price">{{quotation.totalPrice}}</span>
							<span class="currency">{{{quotation.currency_html}}}</span>
						</div>
						<div class="button">
							<a href="javascript:;" onclick="{{quotation.jsBookLink}}"><?php _e('Book Now','fjtss'); ?></a>
						</div>
						<div class="more"><a href="#js_websdk__home-offers_{{rate.name}}_detail"><?php _e('More info','fjtss'); ?></a></div>
						<div class="details" id="js_websdk__home-offers_{{rate.name}}_detail" style="display:none">
							<div class="title">{{{rate.title}}}</div>
							<div class="description">{{{rate.html_description}}}</div>
							<div class="button">
								<a href="javascript:;" onclick="{{quotation.jsBookLink}}"><?php _e('Book Now','fjtss'); ?></a>
							</div>
							<div class="price">
								<span class="apd"><?php _e('From','fjtss'); ?></span>
								<span class="price">{{quotation.totalPrice}}</span>
								<span class="currency">{{{quotation.currency_html}}}</span>
							</div>
						</div>
					</div>
				</li>
				{{/rates}}
			</ul>
		</script>
		<?php
	}
}

if ( ! function_exists( 'fjtss_websdk_home_offer_config' ) ) {
	function fjtss_websdk_home_offer_config() {
		$websdk_config = array(
			'baseHost'  => fjtss_websdk_get('host'),
			'_authCode' => fjtss_websdk_get('token'),
			'params'    => array(
				'locale'   => fjtss_websdk_get('locale'),
				'currency' => 'JPY',
				'output'   => 'json',
				'orderBy'  => 'totalPrice',
				// [mon] property is already set in js via ajax call
				// 'property' => 'jpaki24810',
			)
		);
		$websdk_id = 'js_websdk__home-offers'; ?>
		<div id="<?php echo $websdk_id ?>" data-websdk="Offers"></div>
		<script type="text/javascript">
			websdk_config=(typeof websdk_config === 'undefined' ? {} : websdk_config);
			websdk_config['<?php echo $websdk_id ?>'] = <?php echo json_encode($websdk_config); ?>;
		</script>
		<?php
	}
}
