function initMapDistance(){
    let from = $('#from').val().split(', ');
    let fromLat = from[0];
    let fromLng = from[1];

    let to = $('#to').val().split(', ');
    let toLat = to[0];
    let toLng = to[1];

    let origin = new google.maps.LatLng(fromLat, fromLng);
    let destination = new google.maps.LatLng(toLat, toLng);
  
    let service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: 'DRIVING',
        avoidHighways: false,
        avoidTolls: false,
      }, callback);
}

function callback(response, status) {
    if(status == 'OK'){
        console.log(response);
        $('#distance-in-km').val(response.rows[0].elements[0].distance.value / 1000);
    }

    // See Parsing the Results for
    // the basics of a callback function.
}