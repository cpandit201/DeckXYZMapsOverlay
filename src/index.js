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
  longitude: -73.75,
  latitude: 40.73,
  zoom: 9,
  bearing: 0,
  pitch: 0,
  maxZoom: 18,
  minZoom: 3,
};

// Setup Deck GL
const deckgl = new Deck({
  // parent: canvas,
  // parent: document.getElementById("deck-canvas"),
  controller: true,
  layers: layersWorldAirports,
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
  // style: style,
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
    pitch: false,
    // allow map rotation by user interaction (mouse/touch)
    rotate: false,
  },
  // set initial map pitch in degrees
  pitch: 0,
  // set initial map rotation in degrees
  rotate: 0,
});

// add renderers to window object
window.xyzmap = map;
window.deckoverlay = deckgl;

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
  // console.log(viewState);

  map.setCenter(viewState.longitude, viewState.latitude);
  map.setZoomlevel(viewState.zoom + 1);

  const bbox = [
    [map.getViewBounds().maxLon, map.getViewBounds().maxLat],
    [map.getViewBounds().minLon, map.getViewBounds().maxLat],
  ];

  const viewport = deckgl.getViewports()[0];
  console.log("viewport", viewport);
  console.log("bbox", bbox);

  // if (viewport !== undefined) {
  //   viewport.fitBounds(bbox);
  // }
};

deckgl.setProps({
  onViewStateChange: ({ viewState }) => updateMapCamera(map, viewState, deckgl),
  // onResize: ({ width, height }) => map.resize(width, height),
});
