<script src="http://maps.googleapis.com/maps/api/js"></script>
<script type="text/javascript">

 var map_types = {
    tac: {
        max_zoom: 12,
        default_zoom: 10
    },
    sec: {
        max_zoom: 12,
        default_zoom: 10
    },
    wac: {
        max_zoom: 10,
        default_zoom: 9
    },
    enrl: {
        max_zoom: 11,
        default_zoom: 10
    },
    enrh: {
        max_zoom: 10,
        default_zoom: 9
    },
    "default": {
        default_zoom: 10,
        clean_zoom: 7
    },
    "Contrast": {
        default_zoom: 10,
        clean_zoom: 7
    }
};

function updateMap() {
    setStateCookie();
}

var state_cookie = "vrs_maptype";
function getStateCookie() {
    if (document.cookie.length > 0) {
        start = document.cookie.indexOf(state_cookie + "=");
        if (start!=-1) {
            start += state_cookie.length + 1;
            end = document.cookie.indexOf(";", start);
            if (end==-1) {
                end = document.cookie.length
            }
            return document.cookie.substring(start, end)
        }
    }
    return null
}

function setStateCookie() {
    var d = window.GoogleMap.getMapTypeId();
    var b = new Date();
    var a = new Date(b.getTime() + 30 * 86400 * 1000);
    var c = state_cookie + "=" + window.GoogleMap.getCenter().lat() + "|" + window.GoogleMap.getCenter().lng() + "|" + window.GoogleMap.getZoom() + "|" + d + ";expires=" + a.toGMTString();
    document.cookie = c
}

window.contrastStyleArray = [ // The Google map styles to use for the high contrast map.
        {
            featureType: 'poi',
            stylers: [
                { visibility: 'off' }
            ]
        },{
            featureType: 'landscape',
            stylers: [
                { saturation: -70 },
                { lightness: -30 },
                { gamma: 0.80 }
            ]
        },{
            featureType: 'road',
            stylers: [
                { visibility: 'simplified' },
                { weight: 0.4 },
                { saturation: -70 },
                { lightness: -30 },
                { gamma: 0.80 }
            ]
        },{
            featureType: 'road',
            elementType: 'labels',
            stylers: [
                { visibility: 'simplified' },
                { saturation: -46 },
                { gamma: 1.82 }
            ]
        },{
            featureType: 'administrative',
            stylers: [
                { weight: 1 }
            ]
        },{
            featureType: 'administrative',
            elementType: 'labels',
            stylers: [
                { saturation: -100 },
                { weight: 0.1 },
                { lightness: -60 },
                { gamma: 2.0 }
            ]
        },{
            featureType: 'water',
            stylers: [
                { saturation: -72 },
                { lightness: -25 }
            ]
        },{
            featureType: 'administrative.locality',
            stylers: [
                { weight: 0.1 }
            ]
        },{
            featureType: 'administrative.province',
            stylers: [
                { lightness: -43 }
            ]
        },{
            "featureType": "transit.line",
            "stylers": [
                { "visibility": "off" }
            ]
        },{
            "featureType": "transit.station.bus",
            "stylers": [
                { "visibility": "off" }
            ]
        },{
            "featureType": "transit.station.rail",
            "stylers": [
                { "visibility": "off" }
            ]
        }
    ];

var l = "hybrid";

function getMapTypeOption(a) {
    var b = window.GoogleMap.getMapTypeId();
    if (map_types[b] && map_types[b][a]) {
        return map_types[b][a]
    } else {
        return map_types["default"][a]
    }
}

function addMapTypes() {
    for (var b in map_types) {
        if (b == "default") {
            continue
        }
        if (b == "Contrast") {
        	var contrastMap = new google.maps.StyledMapType(window.contrastStyleArray,
			    {name: "Contrast"});
        	var a = {
            	mapTypeControlOptions: {
      				mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'Contrast']
    				}
            	};
	        window.GoogleMap.set(a);
            continue
        }
        var a = {
            minZoom: 4,
            maxZoom: map_types[b].max_zoom,
            name: b,
            tileSize: new google.maps.Size(256, 256),
            getTileUrl: (function(c) {
                return function(f, e) {
                    var d = f.x%(1<<e);
                    if (d < 0) {
                        d = d + (1<<e)
                    }
                    var g = (1<<e) - f.y - 1;
                    return "http://wms.chartbundle.com/tms/1.0.0/" + c + "/" + e + "/" + d + "/" + g + ".png"
                }
            })(b)
        };
        window.GoogleMap.mapTypes.set(b, new google.maps.ImageMapType(a))
    }
}

function changeMapType() {
    var b = document.getElementById("menu_pulldown");
    var a = b.options[b.selectedIndex].value;
    window.GoogleMap.setMapTypeId(a);
}

function showMapType() {
    var b = document.getElementById("menu_pulldown");
    for (var a = 0; a < b.options.length; a++) {
        if (b.options[a].value == window.GoogleMap.getMapTypeId()) {
            b.options[a].selected = true;
            break
        }
    }
}

		


    if(VRS && VRS.globalDispatch && VRS.serverConfig) {
        VRS.globalDispatch.hook(VRS.globalEvent.bootstrapCreated, function(bootStrap) {
            // Check to see if this version of the bootstrap raises an event once the map has initialised
            if(bootStrap.hookMapInitialised) {
                // It has the event - hook it
                bootStrap.hookMapInitialised(function(pageSettings) {
                
                    // This is called once the map has been loaded. The jQuery plugin for the map will be
                    // held in pageSettings.mapPlugin. Note that this event is also raised when the page
                    // is loaded in offline mode, so we need to check that mapPlugin is good before we
                    // use it. We're also going to be using stuff specific to Google Maps, so we need to
                    // make sure that the map plugin is wrapping Google Maps.
                    if(pageSettings.mapPlugin && pageSettings.mapPlugin.getNativeType() === 'GoogleMaps') {
                        // Get the Google Maps map handle
                        window.GoogleMap = pageSettings.mapPlugin.getNative();
                        //document.body.onunload = setStateCookie;
                        var b = getStateCookie();
					    if (b) {
					    	parts = b.split("|");
					        f = parseFloat(parts[0]);
					        a = parseFloat(parts[1]);
					        m = parseInt(parts[2]);
					        l = parts[3]
						    }         
                        window.GoogleMap.set('disableDefaultUI', true);
                        window.GoogleMap.set('showMapControl', false);
                        window.GoogleMap.set('zoomControl', true);                                                                                        
                        addMapTypes();
					    showMapType();
					    var existingControlsInTopRight = window.GoogleMap.controls[google.maps.ControlPosition.TOP_RIGHT];
					    existingControlsInTopRight.push(document.getElementById("main_toolbar"));                                                                 
                        google.maps.event.addListener(window.GoogleMap, "center_changed", function() {
        					localStorage.CenterLat = window.GoogleMap.getCenter().lat();
       						localStorage.CenterLon = window.GoogleMap.getCenter().lng()
    						});
    					google.maps.event.addListener(window.GoogleMap, "zoom_changed", function() {
        					localStorage.ZoomLvl = window.GoogleMap.getZoom()
    						});
                    }
                });
            }
        });
    }
    
</script>