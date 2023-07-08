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
} from "@here/xyz-maps-core";
const YOUR_ACCESS_TOKEN = "AGB705k1T0Oyizl4K04zMwA";
import { style } from "./style";

const INITIAL_VIEW_STATE = {
  longitude: -0.634,//-73.75,
  latitude: 50.379, //40.73,
  zoom: 6,
  bearing: 0,
  pitch: 28.42639,

  // Limit DeckGL zoomLevel mapping with HERE XYZ Maps
  maxZoom: 18,
  minZoom: 3,
  maxPitch: 50,
};

// Setup Deck GL
const deckgl = new Deck({
  layers:
    layersWorldAirports,
    // layerHeatMap,
    // layerScatterplot,
  canvas: "deck-canvas",
  width: "100%",
  height: "100%",
  initialViewState: INITIAL_VIEW_STATE,
  controller: true,
  style: { zIndex: "auto" },
  views: new MapView({
    repeat: true,
  }),
  debug: true,
});

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

// setup the Map Display
const map = new Map(document.getElementById("map-canvas"), {
  zoomlevel: INITIAL_VIEW_STATE.zoom,
  center: {
    longitude: INITIAL_VIEW_STATE.longitude,
    latitude: INITIAL_VIEW_STATE.latitude,
  },
  layers: [baseMapLayer],
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

/**
 * @map - { Map } from "@here/xyz-maps-display"
 * viewState : {
      latitude: number,
      longitude: number,
      zoom: number,
      bearing: number,
      pitch: number,
    };
 */
const updateMapCamera = (map, viewState) => {

  // Set the view state's lon/lat to ones mapping with XYZ Maps
  map.setCenter(viewState.longitude, viewState.latitude);

  // XYZ Maps roatation is negative of DeckGL
  map.rotate(viewState.bearing * -1);
  map.pitch(viewState.pitch)

  // Center of XYZ Maps is one level higher than deck's zoom level
  map.setZoomlevel(viewState.zoom + 1);
};

deckgl.setProps({
  onViewStateChange: ({ viewState }) => updateMapCamera(map, viewState, deckgl),
  onResize: ({ width, height }) => map.resize(width, height),
});

// optionally add renderers to window object
window.xyzmap = map;
window.deckoverlay = deckgl;
