$.get("../places.json", function(response){
    let content = "";
    for (let i = 0; i < response.length; i++) {
        content += "<option value='" + response[i]['latLng'] + "'>"+ response[i]['name'] +"</option>";
    }

    $('#from').append(content);
    $('#to').append(content);
});

$('#search-form').on('submit', function(event){
    event.preventDefault();
    if($('#from').val() == ""){
        $('#from-is-invalid').text('Pick-up location is required.');
    }else if($('#from').val() == $('#to').val()){
        $('#to-is-invalid').text('Drof-off cannot be the same with Pick-up Location.');
    }else if($('#to').val() == ""){
        $('#to-is-invalid').text('Drop-off Location is required.');
    }else{
        $('.vehicle-results').css("display", "block");
        $('.vehicles').empty();
        $('#from-is-invalid').text('');
        $('#to-is-invalid').text('');

        let from = $('#from').val();
        let to = $('#to').val();
        let not = $('#not').val();
        let nod = $('#nod').val();

        $.get("../vehicles.json", function(response){
            // console.log(response);

            let placeholder = "";
            let result = [];
            for (let i = 0; i < response.length; i++) {
                if(not >= response[i]['minimum_capacity'] 
                    && not <= response[i]['maximum_capacity']
                    && nod >= response[i]['minimum']
                    && nod <= response[i]['maximum']){

                    result.push(i);
                    
                    // console.log(response[i]);

                    let minumumIsEqualToMaximum = (response[i]['minimum_capacity'] == response[i]['maximum_capacity']) 
                        ? response[i]['maximum_capacity'] 
                        : response[i]['minimum_capacity'] + '-' + response[i]['maximum_capacity'];

                    placeholder += '<div class="vehicle-items">\
                        <div class="image">\
                            <img src="'+ response[i]['image'] +'" alt="' + response[i]['name'] + '">\
                        </div>\
                        <div class="details">\
                            <ul>\
                                <li>\
                                    <h1>' + response[i]['name'] + '</h1>\
                                </li>\
                                <li>\
                                    <img src="images/icons/person.svg" alt="person" width="18" height="18">\
                                    <span>' + minumumIsEqualToMaximum + ' persons</span>\
                                </li>\
                                <li>\
                                    <img src="images/icons/dollar.svg" alt="dollar" width="18" height="18">\
                                    <span>NZD $'+ response[i]['price_per_day'] +'  per day</span>\
                                </li>\
                                <li>\
                                    <img src="images/icons/calendar.svg" alt="calendar" width="18" height="18">\
                                    <span>minimum ' + response[i]['minimum'] + ' day, maximum ' + response[i]['maximum'] + ' days</span>\
                                </li>\
                                <li>\
                                    <img src="images/icons/truck.svg" alt="truck" width="18" height="18">\
                                    <span>'+ response[i]['fuel_consumption'] +'L / '+ response[i]['fuel_consumption_distance'] +'km fuel consumption</span>\
                                </li>\
                            </ul>\
                        </div>\
                        <div class="action">\
                            <button type="button" class="btn btn-total-cost" onclick="showCalculation('+ i +', ' + response[i]['price_per_day'] + ', '+ response[i]['fuel_consumption'] +', '+ response[i]['fuel_consumption_distance'] +')">VIEW TOTAL COST</button>\
                        </div>\
                    </div>';
                }
            }

            if(result.length <= 0){
                $('.vehicle-results .empty-state').css("display", "flex");
                $('.vehicle-results .title-and-description').css('display', 'none');
            }

            $('.vehicles').append(placeholder);
            
            initMapDistance();
        });
    }
});


$('.btn-close').on('click', function(){
    $('#modal').css('display', 'none');
});

function showCalculation(index, pricePerDay, fuelConsumption, consumptionDistance){
    console.log(fuelConsumption);
    console.log(consumptionDistance);

    // alert("I Exist" + index);
    let numberOfDays = $('#nod').val();
    let totalPrice = numberOfDays * pricePerDay;
    $('#total-price').text("$" + totalPrice.toFixed(2));

    let distance = $('#distance-in-km').val();

    let totalFuelConsumption = (parseFloat(fuelConsumption) / parseFloat(consumptionDistance)) * parseFloat(distance);

    $('#fuel-consumption').text(totalFuelConsumption.toFixed(2) + "L");
    $('#modal').css('display', 'flex');
}