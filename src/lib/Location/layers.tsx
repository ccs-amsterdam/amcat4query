import { CircleLayer, HeatmapLayer } from "react-map-gl";

export const heatmapLayer: HeatmapLayer = {
  id: "heatmap",
  maxzoom: 14,
  type: "heatmap",
  paint: {
    "heatmap-weight": 1,
    "heatmap-intensity": 1,
    "heatmap-color": [
      "interpolate",
      ["linear"],
      ["heatmap-density"],
      0,
      "rgba(33,102,172,0)",
      0.2,
      "rgb(103,169,207)",
      0.4,
      "rgb(209,229,240)",
      0.6,
      "rgb(253,219,199)",
      0.8,
      "rgb(239,138,98)",
      0.9,
      "rgb(255,201,101)",
    ],
    // TODO: adjust for zoom level?
    "heatmap-radius": 20,
    "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 13, 1, 14, 0],
  },
};

export const circleLayer: CircleLayer = {
  id: "document",
  type: "circle",
  minzoom: 12,
  paint: {
    "circle-radius": 10,
    "circle-color": {
      property: "dbh",
      type: "exponential",
      stops: [
        [0, "rgba(236,222,239,0)"],
        [10, "rgb(236,222,239)"],
        [20, "rgb(208,209,230)"],
        [30, "rgb(166,189,219)"],
        [40, "rgb(103,169,207)"],
        [50, "rgb(28,144,153)"],
        [60, "rgb(1,108,89)"],
      ],
    },
    "circle-stroke-color": "white",
    "circle-stroke-width": 1,
    "circle-opacity": {
      stops: [
        [12, 0],
        [15, 1],
      ],
    },
  },
};
