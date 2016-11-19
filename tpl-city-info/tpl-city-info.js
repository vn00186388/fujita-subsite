(function( $ ){

	var defaults = {
		'hotels' : [],
		'lat' : false,
		'lng' : false,
		'zoom': 14,
		'scrollwheel': false,
		'mapTypeControl': {
			'display': false,
			'position': 'RIGHT_BOTTOM'
		},
		'panControl': {
			'display': false,
			'position': 'RIGHT_CENTER'
		},
		'zoomControl': {
			'display': true,
			'style': 'LARGE',
			'position': 'LEFT_CENTER'
		},
		'scaleControl': {
			'display': true,
			'position': 'RIGHT_BOTTOM'
		},
		'streetViewControl': {
			'display': false,
			'position': 'RIGHT_CENTER'
		},
		'mapStyle' : [
			{
				featureType: "poi.business",
				elementType: "labels",
				stylers: [
				  { visibility: "off" }
				]
			}
		], // more styles for Google Maps on http://snazzymaps.com/
		'infobox_content' : '',
		'infobox_display' : false,
		'infobox_options' : {
			'pixelOffsetX' : -150.5,
			'pixelOffsetY' : 0,
			'boxStyle': {
				'background': "transparent url(css/map_info.png) no-repeat left top",
				'opacity': 1,
				'width': "280px",
				'height':"130px",
				'padding': "20px 10px 10px 10px",
				'color': "#000",
				'fontSize' : "12px"
			},
			'closeBoxMargin': "0 0 0 0",
			'closeBoxURL': "css/map_close.png",
			'disableAutoPan': false,
			'maxWidth': 0
		},
		'itineraryForm' : '#itineraryForm',
		'itineraryInput' : '#itineraryFrom',
		'itinerarySubmit' : '#itinerarySubmit',
		'itineraryPanel' : '#itineraryPanel',
		'itineraryPanelContent' : '.itinerary_directions',
		'itineraryTo' : '.labelto',
		'monuments' : '#monuments',
		'selectors' : 'input[type="radio"]',
		'active' : 'checked',
		'places' : '#places_list',
		'streetview' : '#streetview',
		'satellite' : '#satellite',
		'map' : '#map',
		'itinerary' : '#print_itinerary',
		'print' : '.print_it',
		'close' : '.close_it',
		'reverse' : '.reverse_it',
		'travelmode' : '#traveling_mode',
		'driving' : '.driving',
		'bicycling' : '.bicycling',
		'transit' : '.transit',
		'walking' : '.walking',
		'marker' : 'css/marker.png',
		'bus_station' : 'css/marker_bus_station.png',
		'train_station' : 'css/marker_train_station.png',
		'airport' : 'css/marker_airport.png',
		'subway_station' : 'css/marker_subway_station.png',
		'taxi_stand' : 'css/marker_taxi_stand.png',
		'cafe' : 'css/marker_cafe.png',
		'restaurant' : 'css/marker_restaurant.png',
		'museum' : 'css/marker_museum.png',
		'art_gallery' : 'css/marker_art_gallery.png',
		'print_path' : 'print_itinerary.php',
		'minRadius' : 1000,
		'maxRadius' : 10000,
		'link_text' : 'directions to the hotel',
		'error' : 'ERROR',
		'noplaces_text' : 'No places were found!',
		'onLoad' : function() {},
		'visualRefresh' : false,
		'directionsDisplay' : false,
		'directionsService' : false,
		'is_checked' : false,
		'panorama' : false,
		'streetview_options' : {
			'heading' : 0,
			'pitch' : 0
		},
		'panBy' : {
			'x' : null,
			'y' : null
		},
		'group' : false,
		'group_fit_bounds' : true,
		'pois' : null,
		'display_pois' : false,
		'blank' : 'css/blank.gif',
		'travel' : 'DRIVING',
		'hostname' : ''
	}

	var methods = {

		init : function( options ) {

			if($(this).length == 0) { return; }

			if(window[plugin] === undefined) {
				window[plugin] = new Array();
			}

			//pi = window[plugin].length;
			pi = 0;

			window[plugin].push(pi);

			window[plugin][pi] = $.extend({}, defaults, options);
			window[plugin][pi].element = $(this);

			var jsscript = document.getElementsByTagName("script");
			for (var i = 0; i < jsscript.length; i++) {
				var pattern = eval('/'+plugin+'/i');
				if ( pattern.test( jsscript[i].getAttribute("src") ) ) {
					window[plugin][pi].hostname = jsscript[i].getAttribute("src").split("/");
					window[plugin][pi].hostname.pop();
					window[plugin][pi].hostname = window[plugin][pi].hostname.join('/') + '/';
				}
			}

			var pattern = eval('/http:\/\//i');
			if ( !pattern.test(window[plugin][pi].marker) ) { window[plugin][pi].marker = window[plugin][pi].hostname + window[plugin][pi].marker; }
			if ( !pattern.test(window[plugin][pi].bus_station) ) { window[plugin][pi].bus_station = window[plugin][pi].hostname + window[plugin][pi].bus_station; }
			if ( !pattern.test(window[plugin][pi].train_station) ) { window[plugin][pi].train_station = window[plugin][pi].hostname + window[plugin][pi].train_station; }
			if ( !pattern.test(window[plugin][pi].airport) ) { window[plugin][pi].airport = window[plugin][pi].hostname + window[plugin][pi].airport; }
			if ( !pattern.test(window[plugin][pi].subway_station) ) { window[plugin][pi].subway_station = window[plugin][pi].hostname + window[plugin][pi].subway_station; }
			if ( !pattern.test(window[plugin][pi].taxi_stand) ) { window[plugin][pi].taxi_stand = window[plugin][pi].hostname + window[plugin][pi].taxi_stand; }
			if ( !pattern.test(window[plugin][pi].cafe) ) { window[plugin][pi].cafe = window[plugin][pi].hostname + window[plugin][pi].cafe; }
			if ( !pattern.test(window[plugin][pi].restaurant) ) { window[plugin][pi].restaurant = window[plugin][pi].hostname + window[plugin][pi].restaurant; }
			if ( !pattern.test(window[plugin][pi].museum) ) { window[plugin][pi].museum = window[plugin][pi].hostname + window[plugin][pi].museum; }
			if ( !pattern.test(window[plugin][pi].art_gallery) ) { window[plugin][pi].art_gallery = window[plugin][pi].hostname + window[plugin][pi].art_gallery; }

			if( window[plugin][pi].hotels.length > 0 ) {
				window[plugin][pi].group = true;
				$(window[plugin][pi].monuments).hide();
				$(window[plugin][pi].itineraryForm).hide();
			}

			methods.construct(pi);

		},
		construct : function(pi) {

			if(window[plugin][pi].lat !== false && window[plugin][pi].lng !== false || window[plugin][pi].group == true) {
				window[plugin][pi].directionsService = new google.maps.DirectionsService();
				google.maps.visualRefresh = window[plugin][pi].visualRefresh;
				if(window[plugin][pi].group == true) {
					for(var h in window[plugin][pi].hotels) {
						window[plugin][pi].hotels[h].hotel = new google.maps.LatLng(window[plugin][pi].hotels[h].lat,window[plugin][pi].hotels[h].lng);
					}
				} else {
					window[plugin][pi].hotel = new google.maps.LatLng(window[plugin][pi].lat,window[plugin][pi].lng);
				}
				window[plugin][pi].directionsDisplay = new google.maps.DirectionsRenderer();
				window[plugin][pi].mapOptions = {
					zoom: window[plugin][pi].zoom,
					center: ((window[plugin][pi].group == true) ? window[plugin][pi].hotels[0].hotel : window[plugin][pi].hotel),
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					scrollwheel: window[plugin][pi].scrollwheel,
					mapTypeControl: window[plugin][pi].mapTypeControl.display,
					mapTypeControlOptions: {
						position: eval('google.maps.ControlPosition.'+ window[plugin][pi].mapTypeControl.position)
					},
					panControl: window[plugin][pi].panControl.display,
					panControlOptions: {
						position: eval('google.maps.ControlPosition.'+ window[plugin][pi].panControl.position)
					},
					zoomControl: window[plugin][pi].zoomControl.display,
					zoomControlOptions: {
						style: eval('google.maps.ZoomControlStyle.'+ window[plugin][pi].zoomControl.style),
						position: eval('google.maps.ControlPosition.'+ window[plugin][pi].zoomControl.position)
					},
					scaleControl: window[plugin][pi].scaleControl.display,
					scaleControlOptions: {
						position: eval('google.maps.ControlPosition.'+ window[plugin][pi].scaleControl.position)
					},
					streetViewControl: window[plugin][pi].streetViewControl.display,
					streetViewControlOptions: {
						position: eval('google.maps.ControlPosition.'+ window[plugin][pi].streetViewControl.position)
					}
				};
				window[plugin][pi].mapCanvas = new google.maps.Map(window[plugin][pi].element.get(0), window[plugin][pi].mapOptions);
				if(window[plugin][pi].mapStyle.length > 0) { window[plugin][pi].mapCanvas.setOptions({styles: window[plugin][pi].mapStyle}); }
				window[plugin][pi].bounds = new google.maps.LatLngBounds();

				if(window[plugin][pi].group == true) {
					window[plugin][pi].markers = new Array(window[plugin][pi].hotels.length);
					for(var h in window[plugin][pi].hotels) {
						window[plugin][pi].markers[h] = new google.maps.Marker({
							position: window[plugin][pi].hotels[h].hotel,
							map: window[plugin][pi].mapCanvas,
							icon : window[plugin][pi].marker
						});
						window[plugin][pi].bounds.extend(window[plugin][pi].markers[h].position);
						window[plugin][pi].hotels[h].infobox = {
							content: window[plugin][pi].hotels[h].infobox_content,
							disableAutoPan: window[plugin][pi].infobox_options.disableAutoPan,
							maxWidth: window[plugin][pi].infobox_options.maxWidth,
							pixelOffset: new google.maps.Size(window[plugin][pi].infobox_options.pixelOffsetX, window[plugin][pi].infobox_options.pixelOffsetY),
							zIndex: null,
							boxStyle: window[plugin][pi].infobox_options.boxStyle,
							closeBoxMargin: window[plugin][pi].infobox_options.closeBoxMargin,
							closeBoxURL: window[plugin][pi].infobox_options.closeBoxURL,
							infoBoxClearance: new google.maps.Size(1, 1),
							isHidden: false,
							pane: "floatPane",
							enableEventPropagation: false
						};
						window[plugin][pi].hotels[h].infowindow = new InfoBox(window[plugin][pi].hotels[h].infobox);
						google.maps.event.addListener(window[plugin][pi].hotels[h].infowindow, 'closeclick', function() {
							$(window[plugin][pi].itineraryForm).hide();
							$(window[plugin][pi].monuments).hide();
							$(window[plugin][pi].places).hide();
							if( window[plugin][pi].markerPlace !== undefined ) {
								for (var n in window[plugin][pi].markerPlace ) {
									for (var i = 0, _lpn = window[plugin][pi].markerPlace[n].length; i < _lpn; i++) {
										window[plugin][pi].markerPlace[n][i].setMap(null);
									}
								}
							}
							window[plugin][pi].mapCanvas.fitBounds(window[plugin][pi].bounds);
						});
					}
				} else {
					window[plugin][pi].marker = new google.maps.Marker({
						position: window[plugin][pi].hotel,
						map: window[plugin][pi].mapCanvas,
						icon : window[plugin][pi].marker
					});
					window[plugin][pi].bounds.extend(window[plugin][pi].marker.position);
					window[plugin][pi].infobox = {
						content: window[plugin][pi].infobox_content,
						disableAutoPan: window[plugin][pi].infobox_options.disableAutoPan,
						maxWidth: window[plugin][pi].infobox_options.maxWidth,
						pixelOffset: new google.maps.Size(window[plugin][pi].infobox_options.pixelOffsetX, window[plugin][pi].infobox_options.pixelOffsetY),
						zIndex: null,
						boxStyle: window[plugin][pi].infobox_options.boxStyle,
						closeBoxMargin: window[plugin][pi].infobox_options.closeBoxMargin,
						closeBoxURL: window[plugin][pi].infobox_options.closeBoxURL,
						infoBoxClearance: new google.maps.Size(1, 1),
						isHidden: false,
						pane: "floatPane",
						enableEventPropagation: false
					};
					window[plugin][pi].infowindow = new InfoBox(window[plugin][pi].infobox);
					if(window[plugin][pi].infobox_display == true) { window[plugin][pi].infowindow.open(window[plugin][pi].mapCanvas, window[plugin][pi].marker); }

					if(window[plugin][pi].pois != null) {
						var _elem = $(window[plugin][pi].monuments).children().first().clone();
						$(window[plugin][pi].monuments).children().remove();
						var _categories = new Array();
						window[plugin][pi].poiInfowindow = new google.maps.InfoWindow();
						if(window[plugin][pi].display_pois == true) {
							window[plugin][pi].markerPOI = new Array();
						}
						$.map($.makeArray(window[plugin][pi].pois), function(value, n) {

							if(window.console && console.log && value.category === undefined) {
								console.log('FBMap : The place '+ value.name +' has no specified category');
								return false;
							}

							var _poi = $('<'+ _elem.get(0).tagName +' class="'+ value.category.toLowerCase() +'"><input type="radio" name="place_poi_'+ pi +'" id="place_poi_'+ pi +'_'+ n +'"><label for="place_poi_'+ pi +'_'+ n +'">'+ value.name +'</label></'+ _elem.get(0).tagName +'>');

							if(value.category !== undefined) {
								if($.inArray(value.category,_categories) == -1) {
									_categories.push(value.category);
									_categories[value.category] = new Array();
									window[plugin][pi].markerPOI[value.category] = new Array();
								}
								_categories[value.category].push(_poi);
							} else {
								_poi.appendTo($(window[plugin][pi].monuments));
							}

							if(window[plugin][pi].display_pois == false) {
								$('input', _poi).on('change', function() {
									if( window[plugin][pi].markerPOI !== undefined ) { window[plugin][pi].markerPOI.setMap(null); }
									window[plugin][pi].markerPOI = new google.maps.Marker({
										map: window[plugin][pi].mapCanvas,
										position: new google.maps.LatLng(value.lat,value.lng),
										icon : window[plugin][pi].blank
									});
									google.maps.event.addListener(window[plugin][pi].markerPOI, 'click', (function(plugin, value) {
										return function() {
											plugin.poiInfowindow.setContent('<div class="map_infobox">'+value.content+'<a href="javascript:;" onclick="jQuery.fn.FBMap(\'poi\',\''+ pi +'\',\''+value.lat+','+value.lng+'\')" class="place_itinerary">'+plugin.link_text+'</a></div>');
											plugin.poiInfowindow.open(plugin.mapCanvas, this);
										}
									})(window[plugin][pi], value));
									google.maps.event.trigger(window[plugin][pi].markerPOI, 'click');
								});
							} else {

								window[plugin][pi].markerPOI[value.category][n] = new google.maps.Marker({
									map: window[plugin][pi].mapCanvas,
									position: new google.maps.LatLng(value.lat,value.lng),
									icon : window[plugin][pi].blank
								});
								window[plugin][pi].markerPOI[value.category][n].setVisible(false);
								google.maps.event.addListener(window[plugin][pi].markerPOI[value.category][n], 'click', (function(plugin, value) {
									return function() {
										plugin.poiInfowindow.setContent('<div class="map_infobox">'+value.content+'<a href="javascript:;" onclick="jQuery.fn.FBMap(\'poi\',\''+ pi +'\',\''+value.lat+','+value.lng+'\')" class="place_itinerary">'+ plugin.link_text +'</a></div>');
										plugin.poiInfowindow.open(plugin.mapCanvas, this);
									}
								})(window[plugin][pi], value));
								$('input', _poi).on('change', function() {
									google.maps.event.trigger(window[plugin][pi].markerPOI[value.category][n], 'click');
								});

							}

						});

						if(_categories.length > 0) {
							_categories.map(function(val, cat) {
								var _category = $('<'+ _elem.get(0).tagName +'><strong data-item="'+val+'">'+ val +'</strong><'+ $(window[plugin][pi].monuments).get(0).tagName +'></'+ $(window[plugin][pi].monuments).get(0).tagName +'></'+ _elem.get(0).tagName +'>');
								_category.appendTo($(window[plugin][pi].monuments));
								$(_categories[val]).appendTo($(''+ $(window[plugin][pi].monuments).get(0).tagName +'', _category));
								$('strong', _category).on('click', function() {
									if(window[plugin][pi].poiInfowindow) { window[plugin][pi].poiInfowindow.close(); }
									for(var p in window[plugin][pi].markerPOI) {
										if( p !== $(this).attr('data-item') ) {
											$.map(window[plugin][pi].markerPOI[p], function(el) {
												if(el !== undefined) { el.setVisible(false); el.setMap(null); }
											});
										}
									}
									$.map(window[plugin][pi].markerPOI[$(this).attr('data-item')], function(el) {
										if(el !== undefined) { el.setVisible(true); el.setMap(window[plugin][pi].mapCanvas); window[plugin][pi].bounds.extend(el.position); }
									});
									window[plugin][pi].mapCanvas.fitBounds(window[plugin][pi].bounds);
								});
							});
						}
					}
				}

				if($(window[plugin][pi].itineraryInput).length > 0) {
					window[plugin][pi].input = $(window[plugin][pi].itineraryInput).get(0);
					window[plugin][pi].autocomplete = new google.maps.places.Autocomplete(window[plugin][pi].input);
					window[plugin][pi].autocomplete.bindTo('bounds', window[plugin][pi].mapCanvas);
				}

				google.maps.event.addListenerOnce(window[plugin][pi].mapCanvas, 'idle', function(){
					google.maps.event.trigger(window[plugin][pi].mapCanvas, 'resize');
					if(typeof(window[plugin][pi].panBy) == 'object' && $.isNumeric(window[plugin][pi].panBy.x) == true && $.isNumeric(window[plugin][pi].panBy.y) == true) {
						window[plugin][pi].mapCanvas.panBy(window[plugin][pi].panBy.x, window[plugin][pi].panBy.y);
					} else {
						if(window[plugin][pi].group == true && window[plugin][pi].group_fit_bounds == true) {
							window[plugin][pi].mapCanvas.fitBounds(window[plugin][pi].bounds);
						} else {
							window[plugin][pi].mapCanvas.panTo(window[plugin][pi].marker.getPosition());
						}
					}
					if(window[plugin][pi].pois == null) {
						$(window[plugin][pi].monuments).find(window[plugin][pi].selectors).on('click', function() {
							var _item = $(this).attr('data-item');
							if(window[plugin][pi].is_checked == _item) { $(this).prop('checked',false); window[plugin][pi].is_checked = false; } else { window[plugin][pi].is_checked = _item; }
							methods.places(pi);
						});
					}
					if(window[plugin][pi].display_pois == true && window[plugin][pi].group_fit_bounds == true) {
						window[plugin][pi].mapCanvas.fitBounds(window[plugin][pi].bounds);
					}
					window[plugin][pi].onLoad();
				});

				if(window[plugin][pi].group == true) {
					for(var h in window[plugin][pi].hotels) {
						google.maps.event.addListener(window[plugin][pi].markers[h], 'click', (function(marker, map, plugin, infowindow, hotels, name) {
							return function() {
								plugin.current_infowindow = infowindow;
								plugin.current_marker = marker;
								plugin.hotel = marker.getPosition();
								plugin.lat = plugin.hotel.lat();
								plugin.lng = plugin.hotel.lng();
								$(plugin.monuments).show();
								$(plugin.itineraryTo).text(name);
								$(plugin.itineraryForm).show();
								for(var n in hotels) { if(hotels[n].infowindow) { hotels[n].infowindow.close(); } }
								if(plugin.infobox_display == true) {
									infowindow.open(map,marker);
									map.setCenter(marker.getPosition());
								}
							}
						})(window[plugin][pi].markers[h], window[plugin][pi].mapCanvas, window[plugin][pi], window[plugin][pi].hotels[h].infowindow, window[plugin][pi].hotels, window[plugin][pi].hotels[h].name));
					}
				} else {
					google.maps.event.addListener(window[plugin][pi].marker, 'click', function() {
						if(window[plugin][pi].infobox_display == true) {
							window[plugin][pi].infowindow.open(window[plugin][pi].mapCanvas,window[plugin][pi].marker);
							window[plugin][pi].mapCanvas.setCenter(window[plugin][pi].marker.getPosition());
						}
					});
				}

				google.maps.event.addDomListener(window, 'resize', function() {
					if(typeof(window[plugin][pi].panBy) != 'object' || $.isNumeric(window[plugin][pi].panBy.x) == false || $.isNumeric(window[plugin][pi].panBy.y) == false) {
						if(window[plugin][pi].group == true) {
							window[plugin][pi].mapCanvas.fitBounds(window[plugin][pi].bounds);
						} else {
							window[plugin][pi].mapCanvas.setCenter(window[plugin][pi].hotel);
						}
					}
				});

				window[plugin][pi].directionsDisplay.setMap(window[plugin][pi].mapCanvas);

				window[plugin][pi].panorama = window[plugin][pi].mapCanvas.getStreetView();
				if(window[plugin][pi].group == false) {
					window[plugin][pi].panorama.setPosition(window[plugin][pi].hotel);
					window[plugin][pi].panorama.setPov(({
						heading: parseInt(window[plugin][pi].streetview_options.heading),
						pitch: parseInt(window[plugin][pi].streetview_options.pitch)
					}));
				}

				window[plugin][pi].keycode = null;
				$(window[plugin][pi].itinerarySubmit).on('click', function() { methods.calcRoute(pi); });
				// $(window[plugin][pi].input).live('keypress', function(e) {
				// 	window[plugin][pi].keycode = (e.keyCode ? e.keyCode : e.which);
				// 	if (window[plugin][pi].keycode == 13) { methods.calcRoute(pi); }
				// });
				$(window[plugin][pi].streetview).on('click', function() { methods.toggleStreetView(pi); });
				$(window[plugin][pi].satellite).on('click', function() {
					window[plugin][pi].panorama.setVisible(false);
					window[plugin][pi].mapCanvas.setMapTypeId(google.maps.MapTypeId.SATELLITE);
				});
				$(window[plugin][pi].map).on('click', function() {
					window[plugin][pi].panorama.setVisible(false);
					window[plugin][pi].mapCanvas.setMapTypeId(google.maps.MapTypeId.ROADMAP);
				});

				$(window[plugin][pi].travelmode).find(window[plugin][pi].driving).on('click', function() { methods.travelMode(pi, 'DRIVING'); });
				$(window[plugin][pi].travelmode).find(window[plugin][pi].bicycling).on('click', function() { methods.travelMode(pi, 'BICYCLING'); });
				$(window[plugin][pi].travelmode).find(window[plugin][pi].transit).on('click', function() { methods.travelMode(pi, 'TRANSIT'); });
				$(window[plugin][pi].travelmode).find(window[plugin][pi].walking).on('click', function() { methods.travelMode(pi, 'WALKING'); });

			}

		},
		places : function(pi) {

			if( window[plugin][pi] !== undefined ) {

				window[plugin][pi].panorama.setVisible(false);

				if(window[plugin][pi].infowindow) { window[plugin][pi].infowindow.close(); }

				if( window[plugin][pi].markerPlace !== undefined ) {
					for (var n in window[plugin][pi].markerPlace ) {
						for (var i = 0, _lpn = window[plugin][pi].markerPlace[n].length; i < _lpn; i++) {
							window[plugin][pi].markerPlace[n][i].setMap(null);
						}
					}
				}

				window[plugin][pi].placesList = $(window[plugin][pi].places).get(0);
				window[plugin][pi].placesList.innerHTML = '';

				if($(window[plugin][pi].itineraryPanel).find(window[plugin][pi].itineraryPanelContent).children().length > 0) {
					$(window[plugin][pi].itineraryPanel).slideUp();
					$(window[plugin][pi].itineraryPanel).find(window[plugin][pi].itineraryPanelContent).html('');
					window[plugin][pi].directionsDisplay.setMap(null);
					if(window[plugin][pi].group == true) { window[plugin][pi].mapCanvas.setCenter(window[plugin][pi].hotel); }
					else { window[plugin][pi].mapCanvas.setCenter(window[plugin][pi].marker.getPosition()); }
				}

				window[plugin][pi].activeSelectors = $(window[plugin][pi].monuments + ' ' + window[plugin][pi].selectors + window[plugin][pi].active);
				if(window[plugin][pi].activeSelectors.length > 0) {

					window[plugin][pi].markerPlace = new Array(window[plugin][pi].activeSelectors.length);

					window[plugin][pi].activeSelectors.each(function() {

						var _type = $(this).data('item');

						var _radius = window[plugin][pi].minRadius;
						if(_type == 'airport') { var _radius = window[plugin][pi].maxRadius; }

						var request = {
							location: window[plugin][pi].hotel,
							radius: _radius,
							rankby : google.maps.places.RankBy.DISTANCE,
							types: [_type]
						};
						window[plugin][pi].placeInfowindow = new google.maps.InfoWindow();
						var service = new google.maps.places.PlacesService(window[plugin][pi].mapCanvas);
						service.nearbySearch(request, function(results, status) {

							if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {

								var _itemList = $('<li class="place_item"><span class="name">' + window[plugin][pi].noplaces_text + '</span></li>');
								$(window[plugin][pi].placesList).append(_itemList);

							} else if (status != google.maps.places.PlacesServiceStatus.OK) {
								return;
							} else {

								window[plugin][pi].markerPlace[_type] = new Array(results.length);

								for (var i = 0, _rl = results.length; i < _rl; i++) {

									if(window[plugin][pi].markerPlace[_type][i]) { window[plugin][pi].markerPlace[_type][i].setMap(null); }

									window[plugin][pi].markerPlace[_type][i] = new google.maps.Marker({
										map: window[plugin][pi].mapCanvas,
										position: results[i].geometry.location,
										icon: window[plugin][pi][_type]
									});
									window[plugin][pi].bounds.extend(results[i].geometry.location);

									results[i].image = '';
									if(results[i].photos) {
										results[i].image = '<img style="float:left;margin:0 1em 1em 0;" src="' + results[i].photos[0].getUrl({'maxWidth': results[i].photos[0].width, 'maxHeight': results[i].photos[0].height}) + '" width="50">';
									}

									var _itemList = $('<li class="place_item" data-item="[\''+_type+'\']['+i+']"><img src="'+ results[i].icon +'" class="place_picto"><strong>' + results[i].name + '</strong></li>');

									results[i].placeItinerary = $('<a href="javascript:;" onclick="jQuery.fn.FBMap(\'poi\',\''+ pi +'\',\''+results[i].geometry.location.lat()+','+results[i].geometry.location.lng()+'\',\''+ _type +'\')" class="place_itinerary">'+ window[plugin][pi].link_text +'</a>');

									results[i].placeContent = '<div class="map_infobox">' + results[i].image + '<div style="float:left; width:150px;" class="infobox"><strong>' + results[i].name + '</strong><br>' + results[i].vicinity +'</div><br><br>' + results[i].placeItinerary[0].outerHTML + '</div>';

									$(window[plugin][pi].placesList).append(_itemList);

									google.maps.event.addListener(window[plugin][pi].markerPlace[_type][i], 'click', (function(plugin, i) {
										return function() {
											plugin.placeInfowindow.setContent(results[i].placeContent);
											plugin.placeInfowindow.open(plugin.mapCanvas, this);
										}
									})(window[plugin][pi], i));

									_itemList.on('click', function() {
										var _point = eval('window[plugin][pi].markerPlace' + $(this).attr('data-item'));
										google.maps.event.trigger(_point, 'click');
									});

								}

								if(_type == 'airport') { window[plugin][pi].mapCanvas.fitBounds(window[plugin][pi].bounds); }
								else {
									if(window[plugin][pi].group == true) {
										window[plugin][pi].mapCanvas.setCenter(window[plugin][pi].hotel);
									} else {
										window[plugin][pi].mapCanvas.setCenter(window[plugin][pi].marker.getPosition());
									}
									window[plugin][pi].mapCanvas.setZoom(window[plugin][pi].zoom);
								}

							}
						});

					});

				}
			}

		},
		toggleStreetView : function(pi) {

			if( window[plugin][pi] !== undefined ) {

				var toggle = window[plugin][pi].panorama.getVisible();
				if (toggle == false) {
					window[plugin][pi].panorama.setVisible(true);
				} else {
					window[plugin][pi].panorama.setVisible(false);
				}

			}

		},
		calcRoute : function(pi, start, type, poi, end) {

			if( window[plugin][pi] !== undefined ) {

				window[plugin][pi].panorama.setVisible(false);

				if(start == undefined || typeof(start) == 'object') {
					var start = $(window[plugin][pi].itineraryInput).val();
				}

				if(start == '') { start = window[plugin][pi].start; }

				var travelMode = google.maps.DirectionsTravelMode[window[plugin][pi].travel];

				if(end === undefined) { var end = window[plugin][pi].lat+','+window[plugin][pi].lng; }

				var request = {
					origin: start,
					destination: end,
					travelMode: travelMode
				};
				if(poi !== undefined && poi == true) {
					request = {
						origin: end,
						destination: start,
						travelMode: travelMode
					};
				}
				if ($.trim(start)=='' || end == '0,0') { return; }
				window[plugin][pi].directions = {'start': request.origin ,'end': request.destination};
				if(poi !== undefined && poi == true) { window[plugin][pi].directions = {'start': end ,'end': start }; }
				window[plugin][pi].directionsService.route(request, function(response, status) {
					if (status == google.maps.DirectionsStatus.OK) {
						if(window[plugin][pi].group == true) {
							for(var n in window[plugin][pi].hotels) {
								if(window[plugin][pi].hotels[n].infowindow) { window[plugin][pi].hotels[n].infowindow.close(); }
								if(window[plugin][pi].poiInfowindow) { window[plugin][pi].poiInfowindow.close(); }
							}
						} else {
							if( typeof(window[plugin][pi].infowindow) !== 'undefined' ) { window[plugin][pi].infowindow.close(); }
							if(window[plugin][pi].poiInfowindow) { window[plugin][pi].poiInfowindow.close(); }
						}
						if( typeof(window[plugin][pi].placeInfowindow) !== 'undefined' ) { window[plugin][pi].placeInfowindow.close(); }
						window[plugin][pi].directionsDisplay.setMap(window[plugin][pi].mapCanvas);
						$(window[plugin][pi].itineraryPanel).find(window[plugin][pi].itineraryPanelContent).html('');
						window[plugin][pi].directionsDisplay.setPanel($(window[plugin][pi].itineraryPanel).find(window[plugin][pi].itineraryPanelContent).get(0));
						window[plugin][pi].directionsDisplay.setDirections(response);
						$(window[plugin][pi].itineraryPanel).slideDown();
						$(window[plugin][pi].close).unbind('click');
						$(window[plugin][pi].close).on('click', function() {
							window[plugin][pi].directionsDisplay.setMap(null);
							window[plugin][pi].mapCanvas.setZoom(window[plugin][pi].zoom);
							if(window[plugin][pi].group == true) {
								window[plugin][pi].current_infowindow.open(window[plugin][pi].mapCanvas,window[plugin][pi].current_marker);
								window[plugin][pi].mapCanvas.setCenter(window[plugin][pi].hotel);
							} else {
								window[plugin][pi].infowindow.open(window[plugin][pi].mapCanvas,window[plugin][pi].marker);
								window[plugin][pi].mapCanvas.setCenter(window[plugin][pi].marker.getPosition());
							}
							if( window[plugin][pi].markerPOI !== undefined ) {
								$(window[plugin][pi].markerPOI).each(function() {
									this.setMap(null);
								});
							}
							window[plugin][pi].directionsDisplay = new google.maps.DirectionsRenderer();
							$(window[plugin][pi].itineraryPanel).slideUp();
							return false;
						});
						$(window[plugin][pi].print).unbind('click');
						$(window[plugin][pi].print).on('click', function() { methods.print_itinerary(pi); });
						$(window[plugin][pi].reverse).unbind('click');
						$(window[plugin][pi].reverse).on('click', function() {
							$(window[plugin][pi].itineraryPanel).slideUp( function() {
								if(poi == true) {
									if(type != 'airport') { type = 'walking'; }
									methods.calcRoute(pi, window[plugin][pi].directions.start, type, poi, window[plugin][pi].directions.end);
								} else {
									if(type === undefined) { type = 'airport'; }
									methods.calcRoute(pi, window[plugin][pi].directions.end, type, poi, window[plugin][pi].directions.start);
								}
							});
						});
					} else {
						alert(window[plugin][pi].error);
					}
				});

			}

		},
		poi : function(pi, start, type) {
			$(window[plugin][pi].itineraryInput).val('');
			window[plugin][pi].start = start;
			methods.calcRoute(pi, start, type, true);
		},
		travelMode : function(pi, mode) {
			if(typeof(mode) !== 'undefined') {
				window[plugin][pi].travel = mode;
				methods.calcRoute(pi);
			}
		},
		print_itinerary : function(pi) {

			if( window[plugin][pi] !== undefined ) {

				var html=$(window[plugin][pi].itineraryPanel).find(window[plugin][pi].itineraryPanelContent).html(),
				hiddenForm=$('<form/>', {
					style: 'display:none;',
					target: 'printwindow',
					method: 'post',
					action: window[plugin][pi].hostname + window[plugin][pi].print_path
				});
				hiddenForm.append($('<input/>', {type:'hidden', name:'html', value: html}));
				window.open('','printwindow', 'toolbar=no,width=1000,height=550,menubar=no,scrollbars=yes,resizable=yes');
				$('body').append(hiddenForm);
				hiddenForm.submit();

			}

		}
	};

	var plugin = 'FBMap';

	$.fn.FBMap = function( method ) {

		if ( methods[method] ) {
		  return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
		  return methods.init.apply( this, arguments );
		} else {
		  $.error( 'Method ' +  method + ' does not exist on jQuery.FBMap' );
		}

	};

})( jQuery );

/**
 * @name InfoBox
 * @version 1.1.12 [December 11, 2012]
 * @author Gary Little (inspired by proof-of-concept code from Pamela Fox of Google)
 * @copyright Copyright 2010 Gary Little [gary at luxcentral.com]
 * @fileoverview InfoBox extends the Google Maps JavaScript API V3 <tt>OverlayView</tt> class.
 *  <p>
 *  An InfoBox behaves like a <tt>google.maps.InfoWindow</tt>, but it supports several
 *  additional properties for advanced styling. An InfoBox can also be used as a map label.
 *  <p>
 *  An InfoBox also fires the same events as a <tt>google.maps.InfoWindow</tt>.
 */

/*!
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*jslint browser:true */
/*global google */

/**
 * @name InfoBoxOptions
 * @class This class represents the optional parameter passed to the {@link InfoBox} constructor.
 * @property {string|Node} content The content of the InfoBox (plain text or an HTML DOM node).
 * @property {boolean} [disableAutoPan=false] Disable auto-pan on <tt>open</tt>.
 * @property {number} maxWidth The maximum width (in pixels) of the InfoBox. Set to 0 if no maximum.
 * @property {Size} pixelOffset The offset (in pixels) from the top left corner of the InfoBox
 *  (or the bottom left corner if the <code>alignBottom</code> property is <code>true</code>)
 *  to the map pixel corresponding to <tt>position</tt>.
 * @property {LatLng} position The geographic location at which to display the InfoBox.
 * @property {number} zIndex The CSS z-index style value for the InfoBox.
 *  Note: This value overrides a zIndex setting specified in the <tt>boxStyle</tt> property.
 * @property {string} [boxClass="infoBox"] The name of the CSS class defining the styles for the InfoBox container.
 * @property {Object} [boxStyle] An object literal whose properties define specific CSS
 *  style values to be applied to the InfoBox. Style values defined here override those that may
 *  be defined in the <code>boxClass</code> style sheet. If this property is changed after the
 *  InfoBox has been created, all previously set styles (except those defined in the style sheet)
 *  are removed from the InfoBox before the new style values are applied.
 * @property {string} closeBoxMargin The CSS margin style value for the close box.
 *  The default is "2px" (a 2-pixel margin on all sides).
 * @property {string} closeBoxURL The URL of the image representing the close box.
 *  Note: The default is the URL for Google's standard close box.
 *  Set this property to "" if no close box is required.
 * @property {Size} infoBoxClearance Minimum offset (in pixels) from the InfoBox to the
 *  map edge after an auto-pan.
 * @property {boolean} [isHidden=false] Hide the InfoBox on <tt>open</tt>.
 *  [Deprecated in favor of the <tt>visible</tt> property.]
 * @property {boolean} [visible=true] Show the InfoBox on <tt>open</tt>.
 * @property {boolean} alignBottom Align the bottom left corner of the InfoBox to the <code>position</code>
 *  location (default is <tt>false</tt> which means that the top left corner of the InfoBox is aligned).
 * @property {string} pane The pane where the InfoBox is to appear (default is "floatPane").
 *  Set the pane to "mapPane" if the InfoBox is being used as a map label.
 *  Valid pane names are the property names for the <tt>google.maps.MapPanes</tt> object.
 * @property {boolean} enableEventPropagation Propagate mousedown, mousemove, mouseover, mouseout,
 *  mouseup, click, dblclick, touchstart, touchend, touchmove, and contextmenu events in the InfoBox
 *  (default is <tt>false</tt> to mimic the behavior of a <tt>google.maps.InfoWindow</tt>). Set
 *  this property to <tt>true</tt> if the InfoBox is being used as a map label.
 */

/**
 * Creates an InfoBox with the options specified in {@link InfoBoxOptions}.
 *  Call <tt>InfoBox.open</tt> to add the box to the map.
 * @constructor
 * @param {InfoBoxOptions} [opt_opts]
 */
function InfoBox(opt_opts) {

  opt_opts = opt_opts || {};

  google.maps.OverlayView.apply(this, arguments);

  // Standard options (in common with google.maps.InfoWindow):
  //
  this.content_ = opt_opts.content || "";
  this.disableAutoPan_ = opt_opts.disableAutoPan || false;
  this.maxWidth_ = opt_opts.maxWidth || 0;
  this.pixelOffset_ = opt_opts.pixelOffset || new google.maps.Size(0, 0);
  this.position_ = opt_opts.position || new google.maps.LatLng(0, 0);
  this.zIndex_ = opt_opts.zIndex || null;

  // Additional options (unique to InfoBox):
  //
  this.boxClass_ = opt_opts.boxClass || "infoBox";
  this.boxStyle_ = opt_opts.boxStyle || {};
  this.closeBoxMargin_ = opt_opts.closeBoxMargin || "2px";
  this.closeBoxURL_ = opt_opts.closeBoxURL || "http://www.google.com/intl/en_us/mapfiles/close.gif";
  if (opt_opts.closeBoxURL === "") {
    this.closeBoxURL_ = "";
  }
  this.infoBoxClearance_ = opt_opts.infoBoxClearance || new google.maps.Size(1, 1);

  if (typeof opt_opts.visible === "undefined") {
    if (typeof opt_opts.isHidden === "undefined") {
      opt_opts.visible = true;
    } else {
      opt_opts.visible = !opt_opts.isHidden;
    }
  }
  this.isHidden_ = !opt_opts.visible;

  this.alignBottom_ = opt_opts.alignBottom || false;
  this.pane_ = opt_opts.pane || "floatPane";
  this.enableEventPropagation_ = opt_opts.enableEventPropagation || false;

  this.div_ = null;
  this.closeListener_ = null;
  this.moveListener_ = null;
  this.contextListener_ = null;
  this.eventListeners_ = null;
  this.fixedWidthSet_ = null;
}

/* InfoBox extends OverlayView in the Google Maps API v3.
 */
InfoBox.prototype = new google.maps.OverlayView();

/**
 * Creates the DIV representing the InfoBox.
 * @private
 */
InfoBox.prototype.createInfoBoxDiv_ = function () {

  var i;
  var events;
  var bw;
  var me = this;

  // This handler prevents an event in the InfoBox from being passed on to the map.
  //
  var cancelHandler = function (e) {
    e.cancelBubble = true;
    if (e.stopPropagation) {
      e.stopPropagation();
    }
  };

  // This handler ignores the current event in the InfoBox and conditionally prevents
  // the event from being passed on to the map. It is used for the contextmenu event.
  //
  var ignoreHandler = function (e) {

    e.returnValue = false;

    if (e.preventDefault) {

      e.preventDefault();
    }

    if (!me.enableEventPropagation_) {

      cancelHandler(e);
    }
  };

  if (!this.div_) {

    this.div_ = document.createElement("div");

    this.setBoxStyle_();

    if (typeof this.content_.nodeType === "undefined") {
      this.div_.innerHTML = this.getCloseBoxImg_() + this.content_;
    } else {
      this.div_.innerHTML = this.getCloseBoxImg_();
      this.div_.appendChild(this.content_);
    }

    // Add the InfoBox DIV to the DOM
    this.getPanes()[this.pane_].appendChild(this.div_);

    this.addClickHandler_();

    if (this.div_.style.width) {

      this.fixedWidthSet_ = true;

    } else {

      if (this.maxWidth_ !== 0 && this.div_.offsetWidth > this.maxWidth_) {

        this.div_.style.width = this.maxWidth_;
        this.div_.style.overflow = "auto";
        this.fixedWidthSet_ = true;

      } else { // The following code is needed to overcome problems with MSIE

        bw = this.getBoxWidths_();

        this.div_.style.width = (this.div_.offsetWidth - bw.left - bw.right) + "px";
        this.fixedWidthSet_ = false;
      }
    }

    this.panBox_(this.disableAutoPan_);

    if (!this.enableEventPropagation_) {

      this.eventListeners_ = [];

      // Cancel event propagation.
      //
      // Note: mousemove not included (to resolve Issue 152)
      events = ["mousedown", "mouseover", "mouseout", "mouseup",
      "click", "dblclick", "touchstart", "touchend", "touchmove"];

      for (i = 0; i < events.length; i++) {

        this.eventListeners_.push(google.maps.event.addDomListener(this.div_, events[i], cancelHandler));
      }

      // Workaround for Google bug that causes the cursor to change to a pointer
      // when the mouse moves over a marker underneath InfoBox.
      this.eventListeners_.push(google.maps.event.addDomListener(this.div_, "mouseover", function (e) {
        this.style.cursor = "default";
      }));
    }

    this.contextListener_ = google.maps.event.addDomListener(this.div_, "contextmenu", ignoreHandler);

    /**
     * This event is fired when the DIV containing the InfoBox's content is attached to the DOM.
     * @name InfoBox#domready
     * @event
     */
    google.maps.event.trigger(this, "domready");
  }
};

/**
 * Returns the HTML <IMG> tag for the close box.
 * @private
 */
InfoBox.prototype.getCloseBoxImg_ = function () {

  var img = "";

  if (this.closeBoxURL_ !== "") {

    img  = "<img";
    img += " src='" + this.closeBoxURL_ + "'";
    img += " align=right"; // Do this because Opera chokes on style='float: right;'
    img += " style='";
    img += " position: relative;"; // Required by MSIE
    img += " cursor: pointer;";
    img += " margin: " + this.closeBoxMargin_ + ";";
    img += "'>";
  }

  return img;
};

/**
 * Adds the click handler to the InfoBox close box.
 * @private
 */
InfoBox.prototype.addClickHandler_ = function () {

  var closeBox;

  if (this.closeBoxURL_ !== "") {

    closeBox = this.div_.firstChild;
    this.closeListener_ = google.maps.event.addDomListener(closeBox, "click", this.getCloseClickHandler_());

  } else {

    this.closeListener_ = null;
  }
};

/**
 * Returns the function to call when the user clicks the close box of an InfoBox.
 * @private
 */
InfoBox.prototype.getCloseClickHandler_ = function () {

  var me = this;

  return function (e) {

    // 1.0.3 fix: Always prevent propagation of a close box click to the map:
    e.cancelBubble = true;

    if (e.stopPropagation) {

      e.stopPropagation();
    }

    /**
     * This event is fired when the InfoBox's close box is clicked.
     * @name InfoBox#closeclick
     * @event
     */
    google.maps.event.trigger(me, "closeclick");

    me.close();
  };
};

/**
 * Pans the map so that the InfoBox appears entirely within the map's visible area.
 * @private
 */
InfoBox.prototype.panBox_ = function (disablePan) {

  var map;
  var bounds;
  var xOffset = 0, yOffset = 0;

  if (!disablePan) {

    map = this.getMap();

    if (map instanceof google.maps.Map) { // Only pan if attached to map, not panorama

      if (!map.getBounds().contains(this.position_)) {
      // Marker not in visible area of map, so set center
      // of map to the marker position first.
        map.setCenter(this.position_);
      }

      bounds = map.getBounds();

      var mapDiv = map.getDiv();
      var mapWidth = mapDiv.offsetWidth;
      var mapHeight = mapDiv.offsetHeight;
      var iwOffsetX = this.pixelOffset_.width;
      var iwOffsetY = this.pixelOffset_.height;
      var iwWidth = this.div_.offsetWidth;
      var iwHeight = this.div_.offsetHeight;
      var padX = this.infoBoxClearance_.width;
      var padY = this.infoBoxClearance_.height;
      var pixPosition = this.getProjection().fromLatLngToContainerPixel(this.position_);

      if (pixPosition.x < (-iwOffsetX + padX)) {
        xOffset = pixPosition.x + iwOffsetX - padX;
      } else if ((pixPosition.x + iwWidth + iwOffsetX + padX) > mapWidth) {
        xOffset = pixPosition.x + iwWidth + iwOffsetX + padX - mapWidth;
      }
      if (this.alignBottom_) {
        if (pixPosition.y < (-iwOffsetY + padY + iwHeight)) {
          yOffset = pixPosition.y + iwOffsetY - padY - iwHeight;
        } else if ((pixPosition.y + iwOffsetY + padY) > mapHeight) {
          yOffset = pixPosition.y + iwOffsetY + padY - mapHeight;
        }
      } else {
        if (pixPosition.y < (-iwOffsetY + padY)) {
          yOffset = pixPosition.y + iwOffsetY - padY;
        } else if ((pixPosition.y + iwHeight + iwOffsetY + padY) > mapHeight) {
          yOffset = pixPosition.y + iwHeight + iwOffsetY + padY - mapHeight;
        }
      }

      if (!(xOffset === 0 && yOffset === 0)) {

        // Move the map to the shifted center.
        //
        var c = map.getCenter();
        map.panBy(xOffset, yOffset);
      }
    }
  }
};

/**
 * Sets the style of the InfoBox by setting the style sheet and applying
 * other specific styles requested.
 * @private
 */
InfoBox.prototype.setBoxStyle_ = function () {

  var i, boxStyle;

  if (this.div_) {

    // Apply style values from the style sheet defined in the boxClass parameter:
    this.div_.className = this.boxClass_;

    // Clear existing inline style values:
    this.div_.style.cssText = "";

    // Apply style values defined in the boxStyle parameter:
    boxStyle = this.boxStyle_;
    for (i in boxStyle) {

      if (boxStyle.hasOwnProperty(i)) {

        this.div_.style[i] = boxStyle[i];
      }
    }

    // Fix up opacity style for benefit of MSIE:
    //
    if (typeof this.div_.style.opacity !== "undefined" && this.div_.style.opacity !== "") {

      this.div_.style.filter = "alpha(opacity=" + (this.div_.style.opacity * 100) + ")";
    }

    // Apply required styles:
    //
    this.div_.style.position = "absolute";
    this.div_.style.visibility = 'visible';
    this.div_.style.opacity = '0';
    if (this.zIndex_ !== null) {

      this.div_.style.zIndex = this.zIndex_;
    }
  }
};

/**
 * Get the widths of the borders of the InfoBox.
 * @private
 * @return {Object} widths object (top, bottom left, right)
 */
InfoBox.prototype.getBoxWidths_ = function () {

  var computedStyle;
  var bw = {top: 0, bottom: 0, left: 0, right: 0};
  var box = this.div_;

  if (document.defaultView && document.defaultView.getComputedStyle) {

    computedStyle = box.ownerDocument.defaultView.getComputedStyle(box, "");

    if (computedStyle) {

      // The computed styles are always in pixel units (good!)
      bw.top = parseInt(computedStyle.borderTopWidth, 10) || 0;
      bw.bottom = parseInt(computedStyle.borderBottomWidth, 10) || 0;
      bw.left = parseInt(computedStyle.borderLeftWidth, 10) || 0;
      bw.right = parseInt(computedStyle.borderRightWidth, 10) || 0;
    }

  } else if (document.documentElement.currentStyle) { // MSIE

    if (box.currentStyle) {

      // The current styles may not be in pixel units, but assume they are (bad!)
      bw.top = parseInt(box.currentStyle.borderTopWidth, 10) || 0;
      bw.bottom = parseInt(box.currentStyle.borderBottomWidth, 10) || 0;
      bw.left = parseInt(box.currentStyle.borderLeftWidth, 10) || 0;
      bw.right = parseInt(box.currentStyle.borderRightWidth, 10) || 0;
    }
  }

  return bw;
};

/**
 * Invoked when <tt>close</tt> is called. Do not call it directly.
 */
InfoBox.prototype.onRemove = function () {

  if (this.div_) {

    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
  }
};

/**
 * Draws the InfoBox based on the current map projection and zoom level.
 */
InfoBox.prototype.draw = function () {

  this.createInfoBoxDiv_();

  var pixPosition = this.getProjection().fromLatLngToDivPixel(this.position_);

  this.div_.style.left = (pixPosition.x + this.pixelOffset_.width) + "px";

  if (this.alignBottom_) {
    this.div_.style.bottom = -(pixPosition.y + this.pixelOffset_.height) + "px";
  } else {
    this.div_.style.top = (pixPosition.y + this.pixelOffset_.height) + "px";
  }

  if (this.isHidden_) {

    this.div_.style.visibility = 'hidden';

  } else {

    this.div_.style.visibility = "visible";
    $(this.div_).animate({
    	opacity: '1'
    }, 1000)
  }
};

/**
 * Sets the options for the InfoBox. Note that changes to the <tt>maxWidth</tt>,
 *  <tt>closeBoxMargin</tt>, <tt>closeBoxURL</tt>, and <tt>enableEventPropagation</tt>
 *  properties have no affect until the current InfoBox is <tt>close</tt>d and a new one
 *  is <tt>open</tt>ed.
 * @param {InfoBoxOptions} opt_opts
 */
InfoBox.prototype.setOptions = function (opt_opts) {
  if (typeof opt_opts.boxClass !== "undefined") { // Must be first

    this.boxClass_ = opt_opts.boxClass;
    this.setBoxStyle_();
  }
  if (typeof opt_opts.boxStyle !== "undefined") { // Must be second

    this.boxStyle_ = opt_opts.boxStyle;
    this.setBoxStyle_();
  }
  if (typeof opt_opts.content !== "undefined") {

    this.setContent(opt_opts.content);
  }
  if (typeof opt_opts.disableAutoPan !== "undefined") {

    this.disableAutoPan_ = opt_opts.disableAutoPan;
  }
  if (typeof opt_opts.maxWidth !== "undefined") {

    this.maxWidth_ = opt_opts.maxWidth;
  }
  if (typeof opt_opts.pixelOffset !== "undefined") {

    this.pixelOffset_ = opt_opts.pixelOffset;
  }
  if (typeof opt_opts.alignBottom !== "undefined") {

    this.alignBottom_ = opt_opts.alignBottom;
  }
  if (typeof opt_opts.position !== "undefined") {

    this.setPosition(opt_opts.position);
  }
  if (typeof opt_opts.zIndex !== "undefined") {

    this.setZIndex(opt_opts.zIndex);
  }
  if (typeof opt_opts.closeBoxMargin !== "undefined") {

    this.closeBoxMargin_ = opt_opts.closeBoxMargin;
  }
  if (typeof opt_opts.closeBoxURL !== "undefined") {

    this.closeBoxURL_ = opt_opts.closeBoxURL;
  }
  if (typeof opt_opts.infoBoxClearance !== "undefined") {

    this.infoBoxClearance_ = opt_opts.infoBoxClearance;
  }
  if (typeof opt_opts.isHidden !== "undefined") {

    this.isHidden_ = opt_opts.isHidden;
  }
  if (typeof opt_opts.visible !== "undefined") {

    this.isHidden_ = !opt_opts.visible;
  }
  if (typeof opt_opts.enableEventPropagation !== "undefined") {

    this.enableEventPropagation_ = opt_opts.enableEventPropagation;
  }

  if (this.div_) {

    this.draw();
  }
};

/**
 * Sets the content of the InfoBox.
 *  The content can be plain text or an HTML DOM node.
 * @param {string|Node} content
 */
InfoBox.prototype.setContent = function (content) {
  this.content_ = content;

  if (this.div_) {

    if (this.closeListener_) {

      google.maps.event.removeListener(this.closeListener_);
      this.closeListener_ = null;
    }

    // Odd code required to make things work with MSIE.
    //
    if (!this.fixedWidthSet_) {

      this.div_.style.width = "";
    }

    if (typeof content.nodeType === "undefined") {
      this.div_.innerHTML = this.getCloseBoxImg_() + content;
    } else {
      this.div_.innerHTML = this.getCloseBoxImg_();
      this.div_.appendChild(content);
    }

    // Perverse code required to make things work with MSIE.
    // (Ensures the close box does, in fact, float to the right.)
    //
    if (!this.fixedWidthSet_) {
      this.div_.style.width = this.div_.offsetWidth + "px";
      if (typeof content.nodeType === "undefined") {
        this.div_.innerHTML = this.getCloseBoxImg_() + content;
      } else {
        this.div_.innerHTML = this.getCloseBoxImg_();
        this.div_.appendChild(content);
      }
    }

    this.addClickHandler_();
  }

  /**
   * This event is fired when the content of the InfoBox changes.
   * @name InfoBox#content_changed
   * @event
   */
  google.maps.event.trigger(this, "content_changed");
};

/**
 * Sets the geographic location of the InfoBox.
 * @param {LatLng} latlng
 */
InfoBox.prototype.setPosition = function (latlng) {

  this.position_ = latlng;

  if (this.div_) {

    this.draw();
  }

  /**
   * This event is fired when the position of the InfoBox changes.
   * @name InfoBox#position_changed
   * @event
   */
  google.maps.event.trigger(this, "position_changed");
};

/**
 * Sets the zIndex style for the InfoBox.
 * @param {number} index
 */
InfoBox.prototype.setZIndex = function (index) {

  this.zIndex_ = index;

  if (this.div_) {

    this.div_.style.zIndex = index;
  }

  /**
   * This event is fired when the zIndex of the InfoBox changes.
   * @name InfoBox#zindex_changed
   * @event
   */
  google.maps.event.trigger(this, "zindex_changed");
};

/**
 * Sets the visibility of the InfoBox.
 * @param {boolean} isVisible
 */
InfoBox.prototype.setVisible = function (isVisible) {

  this.isHidden_ = !isVisible;
  if (this.div_) {
    this.div_.style.visibility = (this.isHidden_ ? "hidden" : "visible");
  }
};

/**
 * Returns the content of the InfoBox.
 * @returns {string}
 */
InfoBox.prototype.getContent = function () {

  return this.content_;
};

/**
 * Returns the geographic location of the InfoBox.
 * @returns {LatLng}
 */
InfoBox.prototype.getPosition = function () {

  return this.position_;
};

/**
 * Returns the zIndex for the InfoBox.
 * @returns {number}
 */
InfoBox.prototype.getZIndex = function () {

  return this.zIndex_;
};

/**
 * Returns a flag indicating whether the InfoBox is visible.
 * @returns {boolean}
 */
InfoBox.prototype.getVisible = function () {

  var isVisible;

  if ((typeof this.getMap() === "undefined") || (this.getMap() === null)) {
    isVisible = false;
  } else {
    isVisible = !this.isHidden_;
  }
  return isVisible;
};

/**
 * Shows the InfoBox. [Deprecated; use <tt>setVisible</tt> instead.]
 */
InfoBox.prototype.show = function () {

  this.isHidden_ = false;
  if (this.div_) {
    this.div_.style.visibility = "visible";
  }
};

/**
 * Hides the InfoBox. [Deprecated; use <tt>setVisible</tt> instead.]
 */
InfoBox.prototype.hide = function () {

  this.isHidden_ = true;
  if (this.div_) {
    this.div_.style.visibility = "hidden";
  }
};

/**
 * Adds the InfoBox to the specified map or Street View panorama. If <tt>anchor</tt>
 *  (usually a <tt>google.maps.Marker</tt>) is specified, the position
 *  of the InfoBox is set to the position of the <tt>anchor</tt>. If the
 *  anchor is dragged to a new location, the InfoBox moves as well.
 * @param {Map|StreetViewPanorama} map
 * @param {MVCObject} [anchor]
 */
InfoBox.prototype.open = function (map, anchor) {

  var me = this;

  if (anchor) {

    this.position_ = anchor.getPosition();
    this.moveListener_ = google.maps.event.addListener(anchor, "position_changed", function () {
      me.setPosition(this.getPosition());
    });
  }

  this.setMap(map);

  if (this.div_) {

    this.panBox_();
  }
};

/**
 * Removes the InfoBox from the map.
 */
InfoBox.prototype.close = function () {

  var i;

  if (this.closeListener_) {

    google.maps.event.removeListener(this.closeListener_);
    this.closeListener_ = null;
  }

  if (this.eventListeners_) {

    for (i = 0; i < this.eventListeners_.length; i++) {

      google.maps.event.removeListener(this.eventListeners_[i]);
    }
    this.eventListeners_ = null;
  }

  if (this.moveListener_) {

    google.maps.event.removeListener(this.moveListener_);
    this.moveListener_ = null;
  }

  if (this.contextListener_) {

    google.maps.event.removeListener(this.contextListener_);
    this.contextListener_ = null;
  }

  this.setMap(null);
};

'use strict';

var mapLatLng = {
    lat: 0,
    lng: 0
}

var hopinnHotelMap = (function (window) {
    var findRoute = function(address, hotelPos) {

        if (address.trim()) {
            $('#hotel-map').FBMap(
                'calcRoute',
                0,
                address.trim(),
                'airport',
                false,
                hotelPos
            );
        } else {
            alert('Input your address first!');
        }
    };

    var init = function(data) {

        // information location
        $('.city-info__calculate__address').text(data.hotel_address);

        var dataLatLng = data.hotel_latlng.split(',');
        mapLatLng.lat = parseFloat(dataLatLng[0]);
        mapLatLng.lng = parseFloat(dataLatLng[1]);

        // travel === ''? 'DRIVING':travel;

        $('#city-hotel-map').FBMap(setting(mapLatLng));

        $('.js-btn-calroute').on('click', function() {
            var address = $('.js-route-address').val();

            findRoute(address, mapLatLng);
        });

        $('.js-route-address').on('keyup', function(e) {

            if(e.which === 13) {
                var address = $(this).val();

                findRoute(address, mapLatLng);
            }
        });

        $('.js-btn-reset').on('click', function() {
            $('.js-route-address').val('');
            $('#city-hotel-map').FBMap(setting(mapLatLng));
        });

        var placesInit = false;
    };

    var setting = function(mapLatLng) {
        return {
            'lat': mapLatLng.lat,
            'lng': mapLatLng.lng,
            'mapTypeControl': {
                'display': true,
                'position': 'RIGHT_CENTER'
            },
            'marker': $('.maker__hotel').text()
        };
    };

    var insertData = function (data) {
        var data;
        var flag = false;
        var checkPhone = window.matchMedia("only screen and (max-width: 991px)").matches;        
        $.each(data, function (key, value) {
            var item = "<li class='city-info__places-of-interest__item'><a" + " href='#'>" + key + "</a> <i class='fa fa-chevron-right' aria-hidden='true'></i> </li>";
            $(item).appendTo(".city-info__places-of-interest__list");
        });
        $(".city-info__places-of-interest__item").click(function () {
            if ($(".city-info__detail-places__list").children().length > 0) {
                $(".city-info__detail-places__list").children().remove();
            }
            var data_detail_places = data[this.firstChild.innerHTML];
            $.each(data_detail_places, function (index, element) {
                item = "<li class='city-info__detail-places__item'><a href='#'>" + element.post_title + "</a><i class='fa fa-chevron-right' aria-hidden='true'></i> </li>";
                $('.city-info__detail-places__list').append(
                    $(item).click(function () {
                        for (var i = 0; i < data_detail_places.length; i++) {
                            if (this.firstChild.innerHTML === data_detail_places[i].post_title) {
                                $(".city-info__description__image").attr("src", data_detail_places[i].featured_image);
                                $(".city-info__description__title").text(data_detail_places[i].post_title);
                                $(".city-info__description__content").html(data_detail_places[i].post_content);
                            }
                        };
                        $(".city-info__places-of-interest").css({
                            display: "none"
                        });
                        $(".city-info__description").css({
                            display: "block"
                        });
                        flag = true;
                        if (checkPhone) {
                            $(".city-info__detail-places").css({
                                display: "none"
                            });
                            $(".city-info__description").css({
                                display: "block"
                            })
                        }
                    })
                )
            })
            $(".city-info__detail-places").css({
                display: "block"
            });
            if (checkPhone) {
                $(".city-info__places-of-interest").css({
                    display: "none"
                });
            }
        });
        $(".js-city-info__detail-places__back--closed").click(function () {
            if (flag === true) {
                $(".city-info__description").css({
                    display: "none"
                });
                $(".city-info__places-of-interest").css({
                    display: "block"
                });
            }
            else {
                $(".city-info__detail-places").css({
                    display: "none"
                });
            }
            flag = false;
            if (checkPhone) {
                $(".city-info__places-of-interest").css({
                    display: "block"
                });
                $(".city-info__detail-places").css({
                    display: "none"
                });
            }
        });
    };

    return {
        init: init,
        insertData: insertData
    };

})(window);

$(document).ready(function() {
    var city_info = 'http://fujita-akihabara.wsdasia-sg-1.wp-ha.fastbooking.com/wp-json/fujita-subsite/v1/places/';
    var subsite_hotel_rest_url = fjtss_data.group_rest_url + 'hotels/' + fjtss_data.site_slug;

    fjtss_get_json(city_info, hopinnHotelMap.insertData);
    fjtss_get_json(subsite_hotel_rest_url, hopinnHotelMap.init);
});
