import { MapboxOverlay as DeckOverlay } from "@deck.gl/mapbox";
import { COORDINATE_SYSTEM } from "@deck.gl/core";
import { GeoJsonLayer, ArcLayer, PointCloudLayer } from "@deck.gl/layers";
import mapboxgl from "mapbox-gl";

// source: Natural Earth http://www.naturalearthdata.com/ via geojson.xyz
const AIR_PORTS =
  "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZGVhZG5pZ2h0NyIsImEiOiJjanJzeWY1dGkwMWQ4NDNsZmJjaGNsemZ3In0.WglAlgSd9imV5C778hJ0cA";
const map = new mapboxgl.Map({
  container: "map",
  style:
    "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json",
  center: [0.45, 51.47],
  zoom: 4,
  bearing: 0,
  pitch: 30,
});

// // Jump to New York City
export function goToNYC(deckOverlay) {
  deckOverlay.setProps({
    initialViewState: {
      longitude: -70.4,
      latitude: 40.7,
      zoom: 12,
    },
  });
}

export const deckOverlay = new DeckOverlay({
  controller: true,
  layers: [
    // new PointCloudLayer({
    //   coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
    //   coordinateOrigin: [-122.4004935, 37.7900486, 0], // anchor point in longitude/latitude/altitude
    //   data: AIR_PORTS, // meter offsets from the coordinate origin,
    //   radiusPixels: 2,
    //   sizeUnits: "pixels",
    // }),
    new GeoJsonLayer({
      id: "airports",
      data: AIR_PORTS,
      // Styles
      filled: true,
      pointRadiusMinPixels: 2,
      pointRadiusScale: 2000,
      getPointRadius: (f) => 11 - f.properties.scalerank,
      getFillColor: [200, 0, 80, 180],
      // Interactive props
      pickable: true,
      autoHighlight: true,
      onClick: (info) =>
        // eslint-disable-next-line
        info.object &&
        alert(
          `${info.object.properties.name} (${info.object.properties.abbrev})`
        ),
    }),
    new ArcLayer({
      id: "arcs",
      data: AIR_PORTS,
      dataTransform: (d) =>
        d.features.filter((f) => f.properties.scalerank < 4),
      // Styles
      getSourcePosition: (f) => [-0.4531566, 51.4709959], // London
      getTargetPosition: (f) => f.geometry.coordinates,
      getSourceColor: [0, 128, 200],
      getTargetColor: [200, 0, 80],
      getWidth: 1,
    }),
  ],
});

map.addControl(deckOverlay);
map.addControl(new mapboxgl.NavigationControl());

window.deckOverlay = deckOverlay;
document
  .getElementById("goToNYC")
  .addEventListener("click", goToNYC(deckOverlay));
