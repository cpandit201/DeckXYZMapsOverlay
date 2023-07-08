/* eslint-disable */
import * as L from "leaflet";
import { LeafletLayer } from "deck.gl-leaflet";
import { MapView } from "@deck.gl/core";
import { GeoJsonLayer, ArcLayer, ScatterplotLayer } from "@deck.gl/layers";
import { style } from "./style";

import { Deck } from "@deck.gl/core";

import { Map } from "@here/xyz-maps-display";
import {
  MVTLayer,
  TileLayer,
  SpaceProvider,
  CustomLayer,
  webMercator,
} from "@here/xyz-maps-core";

const YOUR_ACCESS_TOKEN = "AGB705k1T0Oyizl4K04zMwA";

/** setup the map and "basemap" layer **/
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

/** **/

// setup the Map Display
const display = new Map(document.getElementById("xyzmap"), {
  // zoomlevel: 17,
  // zoomlevel: 11,
  // center: { longitude: -80.62089, latitude: 28.627275 },

  zoomlevel: 17,
  center: { longitude: -80.62089, latitude: 28.627275 },
  layers: [baseMapLayer],
  behavior: {
    // allow map pitch by user interaction (mouse/touch)
    // pitch: true,
    // allow map rotation by user interaction (mouse/touch)
    // rotate: true,
  },
  // set initial map pitch in degrees
  // pitch: 50,
  // set initial map rotation in degrees
  // rotate: 30,
});

window.map = display;

/***************** XYZ Maps Overlay ****************/
class XYZMapsDeckOverlay extends CustomLayer {
  min = 0;
  max = 20;

  renderOptions = {
    mode: "2d",
    // zLayer: 99,
    // zIndex: 99,
  };

  onLayerAdd(ev) {
    const { detail } = ev;
    const { canvas, context, map } = detail;
    const viewState = getViewState(map);

    const deckgl = new Deck({
      parent: document.getElementById("xyzmap"),
      // parent: canvas,
      initialViewState: viewState,
      controller: true,
      layers: [layers],
      style: { zIndex: "auto" },
    });

    window._deckGL = deckgl;
    this._deck = deckgl;
    this._map = map;
    // this._map = map;
    // updateDeckView(deckgl, map);
  }

  render(context, matrix) {
    updateDeckView(this._deck, this._map);
  }

  /**
   * @param {DeckProps} props
   * @returns {void}
   */
  setProps(props) {
    if (this._deck) {
      this._deck.setProps(props);
    }
  }

  props;
  _deck;
  _container;
  _map;
  // camera;
  // scene;
  // renderer;
}

/**
 * @param {Map} @here/xyz-maps-display
 * @returns {ViewStateProps}
 */
function getViewState(map) {
  return {
    longitude: map.getCenter().longitude,
    latitude: map.getCenter().latitude,
    zoom: map.getZoomlevel() - 1,
    pitch: 0,
    bearing: 0,
  };
}

/**
 * @param {Deck} deck
 * @param {@here/xyz-maps-display} map
 */
export function updateDeckView(deck, map) {
  const viewState = getViewState(map);

  deck.setProps({ viewState });
  deck.redraw(false);
}

// source: Natural Earth http://www.naturalearthdata.com/ via geojson.xyz
const AIR_PORTS =
  "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson";

const layers = [
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
    dataTransform: (d) => d.features.filter((f) => f.properties.scalerank < 4),
    // Styles
    getSourcePosition: (f) => [-0.4531566, 51.4709959], // London
    getTargetPosition: (f) => f.geometry.coordinates,
    getSourceColor: [0, 128, 200],
    getTargetColor: [200, 0, 80],
    getWidth: 1,
  }),
  new ScatterplotLayer({
    data: [
      {
        position: [-80.62089, 28.627275],
        color: [255, 0, 0],
        radius: 1000,
      },
    ],
    getPosition: (d) => d.position,
    getColor: (d) => d.color,
    getRadius: (d) => d.radius,
    opacity: 0.3,
  }),
];

const hereXyzMapsDeckOverlay = new XYZMapsDeckOverlay({
  zLayer: 999,
  zIndex: 999,
});

display.addLayer(hereXyzMapsDeckOverlay);
hereXyzMapsDeckOverlay.setProps({ layers });
