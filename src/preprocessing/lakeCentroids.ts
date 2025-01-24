import { lakesv3 } from "@/data/lakesv3";
import { centroid } from "@turf/turf";

const centriods = lakesv3.features.map((lakeFeature) => centroid(lakeFeature));
const centroidsWithProperties = centriods.map((centroid, index) => ({
  ...centroid,
  properties: lakesv3.features[index].properties,
}));
Bun.write("centroids.json", JSON.stringify(centroidsWithProperties, null, 2));
