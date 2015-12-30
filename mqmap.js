MQA.EventUtil.observe(window, 'load', function() {

  window.map = new MQA.TileMap(
      document.getElementById('map-canvas')
    , 8
    , {lat:37.41083333, lng:-94.7047222}
    , 'map'
  );

  MQA.withModule('mousewheel', 'zoomcontrol3', 'viewcontrol3', function() {

    map.enableMouseWheelZoom();

    map.addControl(
      new MQA.LargeZoomControl3(), 
      new MQA.MapCornerPlacement(MQA.MapCorner.TOP_LEFT)
    );

    map.addControl(
      new MQA.ViewControl3(),
      new MQA.MapCornerPlacement(MQA.MapCorner.TOP_RIGHT)
    );

    var i, alen;
    for ( i = 0; alen = addresses.length, i < alen; i++ ) { processLocations(addresses[i], i); }

  });


  var divTag = document.createElement('div');          
  divTag.id = 'mqcredit';             
  divTag.setAttribute('align','right');
  divTag.style.margin = '0px auto';  
  divTag.style.fontSize = 'small';  
  divTag.innerHTML = '<a href="http://mapquest.com/">Map courtesy MapQuest</a>';
  document.getElementById('map-canvas').appendChild(divTag);

});

function processLocations(address, i) {
  var location_url = address[3];
//console.log(address);
  location_url = location_url.replace(/#/g, '').replace(/^\s+/, '').replace(/\s+$/, '').replace(/\W/g, ' ').replace(/ +/g, '+');
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'http://www.mapquestapi.com/geocoding/v1/address?key=Jmjtd%7Cluu2290tnq%2C8a%3Do5-lw8x9&inFormat=json&json={"location":{"i":"' + i + '","street":"' + address[4] + '","city":"' + address[5] + '","state":"' + address[6] + '"}}&callback=renderGeocode';
  document.body.appendChild(script);
}

function renderGeocode(response) {
//console.log(response);
  var location = response.results[0].locations[0];
  var providedLocation = response.results[0].providedLocation;
  var city=location.adminArea5;
  var state=location.adminArea3;
  var street=location.street;

  var p = new MQA.Poi(location.latLng);
  var ur_marker = new MQA.Icon('gmap_images/ur_r.png',18,23);
  var blue_marker = new MQA.Icon('gmap_images/ur.png',18,23);

  p.setIcon(blue_marker);
  p.setAltIcon(ur_marker);
  p.setRolloverContent('<div style="white-space: nowrap">' +street+', '+city+', '+state+'</div>');
  //p.setInfoTitleHTML(p.getRolloverContent());
  //p.setInfoContentHTML('<div style="white-space: nowrap">'+street+', '+city+', '+state+'</div>');
  map.addShape(p);
//console.log(providedLocation);
  addresses[providedLocation.i][8] = p;

  MQA.EventManager.addListener(p, 'mouseover', function(evt) {
    reset_list();
    highlight_marker(p);
    highlight_list_item(providedLocation.i);
    show_item_details(providedLocation.i);
  });

  map.bestFit(false, 4, 10);
}

function highlight_marker(p) {
	console.log(p);
	p.toggleInfoWindowRollover();
	p.setAltStateFlag(true);
}

function dim_marker(p) {
	p.toggleInfoWindowRollover();
	p.setAltStateFlag(false);
}

function highlight_list_item(i, evt) {
  var pi = document.getElementById('page-item_' + i);
  pi.style.backgroundColor = '#FF9';
}

function reset_list() {
  for ( i = 0; alen = addresses.length, i < alen; i++ ) {
    document.getElementById('page-item_' + i).style.background = 'white';
    if ( addresses[i][8] ) { addresses[i][8].setAltStateFlag(false); }
  }
}

function show_item_details(i) {

  var pi = document.getElementById('page-item-details');
  var piHTML = '<a href="' + addresses[i][0] + '">';
  piHTML += '<img src="pics' + '/' + addresses[i][0] + '_0_2.JPG"';
  piHTML += 'width="160" height="120" align="left" style="margin-right: 5px; border: 1px solid silver;"></' + 'a>';
  piHTML += '<a href="' + addresses[i][0] + '">MLS# ' + addresses[i][0] + '</' + 'a>';
  piHTML += '<br>$' + addresses[i][2];
  piHTML += '<br>' + addresses[i][3];

  if ( 'residential' == addresses[i][1] || 'rural' == addresses[i][1] ) {
    piHTML += '<br>' + addresses[i][4] + ' Bedrooms&#8212;' + addresses[i][5] + ' Baths/Half-Baths';
    if ( '' != addresses[i][6] && '0' != addresses[i][6] ) {
      piHTML += '&#8212;' + addresses[i][6] + ' Acres';
    }
  }
  else if ( 'land' == addresses[i][1] ) { piHTML += '<br>' + addresses[i][6] + ' Acres'; }

  piHTML += '<br><br><span class="alert">Call (620) 231-HOME (4663)</span>';
  piHTML += '<br clear="all">';
  piHTML += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="';
  piHTML += addresses[i][0] + '" style="font-size: small;">See ' + addresses[i][7] + ' Photos ></a>';
//alert(piHTML);
//alert('a');
  pi.innerHTML = piHTML;
}
