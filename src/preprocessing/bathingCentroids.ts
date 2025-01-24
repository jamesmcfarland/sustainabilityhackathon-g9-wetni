import { bathingV2 } from "@/data/bathingv2";
import { lakesv3 } from "@/data/lakesv3";
import { centroid } from "@turf/turf";

const centriods = bathingV2.features.map((lakeFeature) =>
  centroid(lakeFeature)
);

Bun.write("bathing_centroids.json", JSON.stringify(centriods, null, 2));
