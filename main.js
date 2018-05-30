//Window magnitudes
var windowWidth = $(window).width(); 
console.log(windowWidth);
var neigData = new Array(175);
for (var i = 0; i < 175; i++) {
  neigData[i] = new Array(5);
}//[name, borough, lat, lng, ]
var crimeData = new Array(5);
for (var i = 0; i < 5; i++) {
  neigData[i] = 0;
}
var token = '1dP7fcvaShzhTYkhejsc3Q6E8';
// google maps API goblal variables
var map;
var point;
var Ulat = 40.7291, Ulng = -73.9965;

//Datasets
//NY districts geoshapes
var NYdistrictsGeo = "https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson";
function shapes(){
    $.getJSON('https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson', function(dato) {
    $.each(dato.data, function(i, data){});
    console.log(dato.data);
    });
}
//Neighborhood names gis
var NYnames = "https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD";
function names(){
    $.getJSON('https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD', function(dato) {
    $.each(dato.data, function(i, data){});
    for(var i = 0; i<175;i++){
        neigData[i][0] = dato.data[i][10];
        neigData[i][1] = dato.data[i][16];
        point = dato.data[i][9];
        point = point.substring(7, point.lenght);
        var lat=parseFloat(point.substring(point.lastIndexOf("("),point.lastIndexOf(" ")).substring(0,8));
        var lng=parseFloat(point.substring(point.lastIndexOf(" "),point.lastIndexOf(")")-1).substring(0,8));
        neigData[i][2] = lat;
        neigData[i][3] = lng;
    }
    //console.log(dato.data);
    });
}
//Crimes in NY
var NYcrimes = "https://data.cityofnewyork.us/Public-Safety/NYPD-Complaint-Data-Historic/qgea-i56i/data";
function crimes(){
$.ajax({
    url: "https://data.cityofnewyork.us/resource/9s4h-37hy.json?cmplnt_fr_dt=2016-12-31T00:00:00.000",
    type: "GET",
    data: {
      "$limit" : 5000,
      "$$app_token" : token
    }
}).done(function(data) {
    for(var i = 0;i<745;i++){
        if(data[i][2] == 'MANHATTAN')
      {
          crimeData[0]++;
      }
      else if(data[i].boro_nm =='BRONX')
      {
          crimeData[1]++;
      }
      else if(data[i].boro_nm =='BROOKLYN')
      {
          crimeData[2]++;
      }
      else if(data[i].boro_nm == 'QUEENS')
      {
          crimeData[3]++;
      }
      else if(data[i].boro_nm =='STATEN ISLAND')
      {
          crimeData[4]++;
    }
    }
    console.log(crimeData);
    console.log(data);
});
}
//New York City housing by building data
var NYhousing = "https://catalog.data.gov/dataset/housing-new-york-units-by-building";

function housing(){
    $.getJSON('https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json?accessType=DOWNLOAD', function(dato) {
    $.each(dato.data, function(i, data){});
    console.log(dato.data);
    /*for(var i = 0; i<175;i++){
        neigData[0][i] = dato.data[i][10];
        console.log(neigData[0][i]);
    }*/
    });
}

// Google maps 
function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: Ulat, lng: Ulng},
            zoom: 10
        });
        var uniMarker = new google.maps.Marker({
            position: {lat: Ulat, lng: Ulng},
            map: map,
            title: 'uniMarker'
        });
    map.data.loadGeoJson(NYdistrictsGeo);
    map.data.setStyle(function(feature) {
        var id = feature.getProperty('BoroCD');
        var color = 'white';
        var stw = '0';
        if(id >= 100 && id < 120){color = '#6600FE';stw = '1';}
        else if(id >= 200 && id < 220){color = '#0B20E5';stw = '1';}
        else if(id >= 300 && id < 320){color = '#0092FC';stw = '1';}
        else if(id >= 400 && id < 420){color = '#0BE5D7';stw = '1';}
        else if(id >= 500 && id < 520){color = '#08FE6E';stw = '1';}
        return {
            fillColor: color,
            strokeColor: color,
            strokeWeight: stw
        };
    });
    map.data.addListener('click', function(event) {
        map.data.revertStyle();
        map.data.overrideStyle(event.feature, {strokeWeight: 4});
    });
}

// d3.js
//indices (por ahora solo son de prueba)
var criminalityIndex = [50];
var relDistanceIndex = [30];
var affordabilityIndex = [100];
shapes();
names();
crimes();
housing();
console.log(neigData);
/*
d3.select("#saf")
  .selectAll("div")
  .data(criminalityIndex)
    .enter()
    .append("div")
    .style("width", function(d) { return (d/100 * divSize) + 'px' })
    .text(function(d) { return d + "%"; });

d3.select("#dis")
  .selectAll("div")
  .data(relDistanceIndex)
    .enter()
    .append("div")
    .style("width", function(d) { return (d/100 * divSize) + 'px' })
    .text(function(d) { return d + "%"; });
    
d3.select("#aff")
  .selectAll("div")
  .data(affordabilityIndex)
    .enter()
    .append("div")
    .style("width", function(d) { return (d/100 * divSize) + 'px' })
    .text(function(d) { return d + "%"; });*/