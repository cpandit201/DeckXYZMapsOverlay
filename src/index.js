/* eslint-disable */
import * as L from "leaflet";
import { LeafletLayer } from "deck.gl-leaflet";
import { MapView } from "@deck.gl/core";
import { GeoJsonLayer, ArcLayer } from "@deck.gl/layers";

import { Map } from "@here/xyz-maps-display";
import { MVTLayer, TileLayer, SpaceProvider } from "@here/xyz-maps-core";

// source: Natural Earth http://www.naturalearthdata.com/ via geojson.xyz
const AIR_PORTS =
  "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson";

const coords = {
  longitude: -74.30603020869314,
  latitude: 40.69074847550857,
  zoom: 7,
};

const map = L.map(document.getElementById("map"), {
  center: [coords.latitude, coords.longitude],
  zoom: coords.zoom,
});

// Update lat long of XYZ map upon move
map.on("moveend", function () {
  console.log("Leaflet", map.getZoom());
  console.log("XYZ Map: ", display.getCenter());

  display.setCenter({
    longitude: map.getBounds().getCenter().lng,
    latitude: map.getBounds().getCenter().lat,
  });
  display.setZoomlevel(map.getZoom());
});

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const deckLayer = new LeafletLayer({
  debug: true,
  views: [
    new MapView({
      repeat: true,
    }),
  ],
  layers: [],
});
map.addLayer(deckLayer);

const featureGroup = L.featureGroup();
featureGroup.addLayer(L.marker([51.4709959, -0.4531566]));
map.addLayer(featureGroup);

const YOUR_ACCESS_TOKEN = "AGB705k1T0Oyizl4K04zMwA";

// Step1 - Set underlying MVT tiles layer
const MVT = new MVTLayer({
  name: "background layer",
  // the minimum zoom level the layer is displayed
  min: 1,
  // the maximum zoom level the layer is displayed
  max: 20,
  remote: {
    url:
      "https://xyz.api.here.com/tiles/osmbase/512/all/{z}/{x}/{y}.mvt?access_token=" +
      YOUR_ACCESS_TOKEN,
  },
});

// Step 1.1 - setup the Map Display
const display = new Map(document.getElementById("xyzmap"), {
  zoomlevel: coords.zoom,
  center: {
    longitude: coords.longitude,
    latitude: coords.latitude,
  },
  // add layers to the map
  layers: [MVT],
});

// Add dataset layer to display object
display.addLayer(dataTileLayer);

display.addLayer(myLayer);

window.deckLayer = deckLayer;
window.xyzMap = display;
