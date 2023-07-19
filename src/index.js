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
  longitude: -122.229621,
  latitude: 37.7820641,
  zoom: 16,
  bearing: 0,
  pitch: 0,

  // Limit DeckGL zoomLevel mapping with HERE XYZ Maps
  maxZoom: 18,
  minZoom: 3,
  maxPitch: 50,
};

// Setup Deck GL
const deckgl = new Deck({
  // layers: layersWorldAirports,
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
    level: 10,
    layer: layerId,
    catalog: catalogHrn,
    credentials: {
      apiKey: apiKey,
    },
  }),
});

// create a TileLayer using a SpaceProvider that's providing the map-data we want to display
var mySpaceLayer = new TileLayer({
  // the minimum zoom level the layer should be visible
  min: 3,
  // the maximum zoom level the layer should be visible
  max: 20,
  // create the SpaceProvider
  provider: new SpaceProvider({
    // zoom level at which tiles are loaded and a local tile index gets created
    level: 3,
    // id of the space
    space: '6HMU19KY',
    // user credentials required by the xyz-hub remote service
    credentials: {
      access_token: YOUR_ACCESS_TOKEN
    }
  })
});


// setup the Map Display
const map = new Map(document.getElementById("map-canvas"), {
  zoomlevel: INITIAL_VIEW_STATE.zoom,
  center: {
    longitude: INITIAL_VIEW_STATE.longitude,
    latitude: INITIAL_VIEW_STATE.latitude,
  },
  layers: [
      baseMapLayer,
      mySpaceLayer,
      // imlLayer
  ],
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
  map.pitch(viewState.pitch);

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
