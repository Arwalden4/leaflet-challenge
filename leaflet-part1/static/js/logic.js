// Storing API endpoint as url
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson"
//d3 request to obtain JSON data
d3.json(queryUrl).then(function(data) {
    console.log(data.features);

    createFeatures(data.features);
});

function createFeatures(data) {
    console.log(data.geometry.coordinates[0]);
    console.log(data.geometry.coordinates[1]);
    console.log(data.properties.place);
    
    function onEachFeature(feature,layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>
            ${new Date(feature.properties.time)}</p><hr><p>Earthquake Magnitude: 
            ${feature.properties.mag}</p>`);
    };
    
    let earthquakes = L.geoJSON(data, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature,coordinates) {
            let markers = {
                radius: size(feature.properties.mag),
                fillColor: colors(feature.properties.mag),
                fillOpacity: .3,
                stroke: true,
                weight: 1
            };
            return L.circle(coordinates,markers);
        }
    });
    createMap(earthquakes);
};

function createMap(earthquakes) {
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
}
