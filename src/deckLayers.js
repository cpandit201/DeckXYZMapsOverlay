import { GeoJsonLayer, ArcLayer, ScatterplotLayer } from "@deck.gl/layers";

import { HeatmapLayer } from "@deck.gl/aggregation-layers";

// source: Natural Earth http://www.naturalearthdata.com/ via geojson.xyz
export const dataSource = {
  AIR_PORTS:
    "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson",

  HEAT_MAPS:
    "https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/screen-grid/uber-pickup-locations.json",
};

const intensity = 1;
const threshold = 0.03;
const radiusPixels = 30;

export const layers = [
  new HeatmapLayer({
    data: dataSource.HEAT_MAPS,
    id: "heatmp-layer",
    pickable: false,
    getPosition: (d) => [d[0], d[1]],
    getWeight: (d) => d[2],
    radiusPixels,
    intensity,
    threshold,
  }),
];

export const layers1 = [
  new GeoJsonLayer({
    id: "airports",
    data: dataSource.AIR_PORTS,
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
    data: dataSource.AIR_PORTS,
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
