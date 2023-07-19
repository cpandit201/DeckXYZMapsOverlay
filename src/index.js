// Deck Imports
import { Deck } from "@deck.gl/core";
import { MapView } from "@deck.gl/core";
import {
  layerScatterplot,
  layerHeatMap,
  layersWorldAirports,
} from "./deckLayers";

// XYZ Imports
import { Map } from "@here/xyz-maps-display";
import {
  MVTLayer,
  TileLayer,
  SpaceProvider,
  CustomLayer,
  webMercator,
  IMLProvider,
} from "@here/xyz-maps-core";
const YOUR_ACCESS_TOKEN = "AGB705k1T0Oyizl4K04zMwA";
import { style } from "./style";

const INITIAL_VIEW_STATE = {
  longitude: -120.64021673968094, //-73.75,
  latitude: 36.19311064138663, //40.73,
  zoom: 7.3,
  bearing: 0,
  pitch: 0,

  // Limit DeckGL zoomLevel mapping with HERE XYZ Maps
  maxZoom: 18,
  minZoom: 3,
  maxPitch: 50,
};

/** setup the XYZ map and "basemap" layer **/
const baseMapLayer = new MVTLayer({
  name: "mvt-world-layer",
  zIndex: 1,
  remote: {
    url:
      "https://xyz.api.here.com/tiles/osmbase/512/all/{z}/{x}/{y}.mvt?access_token=" +
      YOUR_ACCESS_TOKEN,
  },
  style: style,
});

// From studio project - https://platform.here.com/studio/viewer?project_id=project-studio-t&artifact_hrn=hrn:here:artifact::olp-here:com.here.studio.project-studio-t:project-api:1.0.0&apiKey=PM6cqAYXuQJj6dVmW6C4y2fBNDn6cfDVuV2mIOGAICM
const apiKey = "PM6cqAYXuQJj6dVmW6C4y2fBNDn6cfDVuV2mIOGAICM"; // "d-4UWghNKnFeM8UWf1vD4SSrdilMqBm1bawNzvcyYEo";
const catalogHrn = "hrn:here:data::olp-here:f074b8-3c119a2fb";
const layerId = "b6d9939";

var flightRoutesURL = `https://interactive.data.api.platform.here.com/interactive/v1/catalogs/${catalogHrn}/layers/${layerId}/search?p.src=AIRPORTCODE&apiKey=${apiKey}&selection=-`;

// create a TileLayer using a IMLProvider that's providing the map-data we want to display
var imlLayer = new TileLayer({
  // the minimum zoom level the layer should be visible
  min: 3,
  // the maximum zoom level the layer should be visible
  max: 20,
  // create the SpaceProvider
  provider: new IMLProvider({
    level: 3,
    layer: layerId,
    catalog: catalogHrn,
    credentials: {
      apiKey: apiKey,
    },
  }),
});

// setup the Map Display
const map = new Map(document.getElementById("map-canvas"), {
  zoomlevel: INITIAL_VIEW_STATE.zoom,
  center: {
    longitude: INITIAL_VIEW_STATE.longitude,
    latitude: INITIAL_VIEW_STATE.latitude,
  },
  layers: [baseMapLayer, imlLayer],
  minLevel: 4,
  maxLevel: 19,
  debug: false,
  behavior: {
    // allow map pitch by user interaction (mouse/touch)
    pitch: true,
    // allow map rotation by user interaction (mouse/touch)
    rotate: true,
  },
  // set initial map pitch in degrees
  pitch: 0,
  // set initial map rotation in degrees
  rotate: 0,
});

// optionally add renderers to window object
window.xyzmap = map;
