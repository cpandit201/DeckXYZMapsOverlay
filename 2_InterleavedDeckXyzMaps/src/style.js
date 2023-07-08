export const style = {
    backgroundColor: "#ECE0CA",

    styleGroups: {
        landuse: [{ zIndex: 0, type: "Polygon", fill: "#ECE0CA" }],
        pier: [
            {
                zIndex: 1,
                type: "Polygon",
                fill: "#ECE0CA",
                stroke: "#c8b89d",
                strokeWidth: 2,
            },
        ],
        park: [{ zIndex: 1, type: "Polygon", fill: "#c8dd97" }],
        nature_reserve: [{ zIndex: 1, type: "Polygon", fill: "#dadeb0" }],
        hospital: [{ zIndex: 1, type: "Polygon", fill: "#f3d3d3" }],
        water: [{ zIndex: 2, type: "Polygon", fill: "rgb(120,188,237)" }],
        path: [{ zIndex: 3, type: "Line", stroke: "#c8b89d", strokeWidth: "1m" }],
        tunnel: [
            {
                zIndex: 3,
                type: "Line",
                stroke: "#ffffff",
                strokeWidth: { 15: 4, 20: 16 },
                strokeDasharray: [4, 4],
            },
        ],
        ferry: [{ zIndex: 4, type: "Line", stroke: "#164ac8", strokeWidth: 1 }],
        highway: [
            {
                zIndex: 5,
                type: "Line",
                stroke: "white",
                repeat: 128,
                strokeWidth: { 10: 1.5, 15: 4, 16: "12m" },
            },
        ],
        boundaries: [
            {
                zIndex: 6,
                type: "Line",
                stroke: "#b3b1ad",
                strokeWidth: { 10: 0.5, 20: 2 },
            },
        ],
        buildings: [
            {
                zIndex: 7,
                type: "Polygon",
                fill: "rgba(170,170,170,0.7)",
                stroke: "rgba(30,30,30,0.7)",
                // define extrude in meters to display polygons with extrusion
                extrude: (feature) => feature.properties.height || 0,
                // define the base of the extrusion in meters offset from the ground
                extrudeBase: (feature) => feature.properties.min_height || 0,
            },
        ],
        roads: [
            {
                zIndex: 4,
                type: "Line",
                stroke: "#ffffff",
                strokeWidth: { 15: 1, 16: "5m" },
            },
            {
                zIndex: 6,
                type: "Text",
                fill: "#222222",
                font: "12px sans-serif",
                strokeWidth: 4,
                stroke: "white",
                text: (f) => f.properties.name,
                // Minimum distance in pixel between repeated text labels on line geometries.
                // Applies per tile only. Default is 256 pixel.
                repeat: 128,
                // Alignment for Text. "map" aligns to the plane of the map.
                alignment: "map",
                // Text with a higher priority (lower value) will be drawn before lower priorities (higher value)
                // make sure "road labels" are drawn after "place labels".
                priority: 2,
            },
        ],
        places: [
            {
                zIndex: 8,
                type: "Text",
                text: (f) => f.properties.name,
                stroke: "black",
                fill: "white",
                font: "18px sans-serif",
                strokeWidth: 4,
                // set collide property to false to enable label collision detection [default]
                collide: false,
                // Alignment for Text. "viewport" aligns to the plane of the viewport/screen.
                alignment: "viewport",
                // Text with a higher priority (lower value) will be drawn before lower priorities (higher value)
                // In case of "place label" and "road label" are colliding "place label" will be draw
                // because priority 1 is smaller than priority 2
                priority: 1,
            },
        ],
    },

    assign: (feature, zoom) => {
        let props = feature.properties;
        let kind = props.kind;
        let layer = props.layer;
        let geom = feature.geometry.type;

        if (layer == "landuse") {
            switch (kind) {
                case "pier":
                    return "pier";
                case "nature_reserve":
                    return "nature_reserve";
                case "park":
                case "garden":
                case "pedestrian":
                case "forrest":
                    return "park";
                case "hospital":
                    return "hospital";
                default:
                    return "landuse";
            }
        }

        if (layer == "water") {
            if (geom == "LineString" || geom == "MultiLineString") {
                return;
            }
        } else if (layer == "roads") {
            if (kind == "rail" || kind == "ferry") {
                return;
            }
            if (props.is_tunnel && zoom > 13) {
                return "tunnel";
            }
            if (kind == "highway" || kind == "path") {
                return kind;
            }
        }
        return layer;
    },
};
