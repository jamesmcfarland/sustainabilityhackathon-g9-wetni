import * as turf from "@turf/turf";
import { lakesv2 } from "./data/lakesv2";
import { epsg29902Convert } from "./utils/epsg29902Convert";
import { quality2 } from "./data/qualityMonitor2";

import * as turf from "@turf/turf";

function findNearbyPoints(
  points: GeoJSON.FeatureCollection<GeoJSON.Point>,
  polygons: GeoJSON.FeatureCollection<GeoJSON.Polygon>,
  maxDistance: number = 500
) {
  return {
    type: "FeatureCollection",
    features: points.features.filter((point) =>
      polygons.features.some((polygon) => {
        const closestPoint = turf.pointOnFeature(polygon);
        return turf.distance(point, closestPoint) <= maxDistance / 1000;
      })
    ),
  } as GeoJSON.FeatureCollection<GeoJSON.Point>;
}

console.log("Converting Lakesv2");
const lakesGeoJson = epsg29902Convert(lakesv2);
console.log("Expanding Lakesv2");
const expanded = findNearbyPoints(quality2, lakesGeoJson);
console.log(
  `Original - ${quality2.features.length}, Expanded - ${expanded.features.length}`
);
console.log("Stringifying points.geojson");
const json = JSON.stringify(expanded);
console.log("Writing points.geojson");
Bun.write("points.geojson", json);
