// Storing API endpoint as url
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson"
//d3 request to obtain JSON data
d3.json(queryUrl).then((data) => {
    console.log(data.features);

    createFeatures(data.features);
});

function markerColor(depth) {
    if(depth >= 90) {
        return '#A4F600'
    }else if(depth >= 70) {
        return '#DDF403'
    }else if(depth >= 50) {
        return '#F7DB12'
    }else if (depth >= 30) {
        return '#F9B72A'
    }else if (depth >= 10){
        return '#F66066'
    } else if (depth < 10) {
        "#F66066"
    };
};

function createFeatures(data) {
    
    function onEachFeature(feature,layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>
            Depth: ${feature.geometry.coordinates[2]} km</p></h3><hr><p>Magnitude: 
            ${feature.properties.mag}</p>`);
    };
    


    let earthquakes = L.geoJSON(data, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature,coordinates) {
            let depth = feature.geometry.coordinates[2];
            let color = depth >= 90 ? '#F42C38' : depth >= 70 ? '#FF9933': 
            depth >= 50 ? '#ee9c00': depth >= 30 ? '#eecc00' : depth >= 10 ? "#d4ee00": "#98ee00";
            return L.circleMarker(coordinates, {
                radius: feature.properties.mag * 4,
                fillColor: color,
                color: "#000",
                fillOpacity: 1,
                stroke: true,
                weight: 1
            });
        }
    });
    createMap(earthquakes);
};

function createMap(earthquakes) {
    let streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let baseMaps = {"Overlay Map": streetMap};

    let overlayMaps = {
        Earthquakes: earthquakes
    };

    let eqMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 4,
        layers: [streetMap,earthquakes]
        }
    );
    
    L.control.layers(baseMaps, overlayMaps).addTo(eqMap);

    let legend = L.control({position: "bottomright"});

    legend.onAdd = function (eqMap) {

        let div = L.DomUtil.create("div","legend");
        let grades = ["-10", "10", "30", "50", "70", "90"];
        let colors = ["lightgreen", "#ddff99", "#ffff80", "#ffc266", "#ff6600", "#e60000"];

        for(let i = 0; i < grades.length; i++) {
            div.innerHTML += "<i style='background:" + 
            colors[i] + "'></i>"+ grades[i] +
            (grades[i + 1] ? "&ndash;"+ grades[i + 1]+ "<br>" : "+ km")};
        return div
    }
    legend.addTo(eqMap);

}
