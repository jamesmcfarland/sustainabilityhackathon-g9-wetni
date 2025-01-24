/* eslint-disable @typescript-eslint/no-unused-vars */
import { bathingV2 } from "@/data/bathingv2";
import { centroid } from "@turf/turf";

const centriods = bathingV2.features.map((lakeFeature) =>
  centroid(lakeFeature)
);

// commented out to allow build to pass
// Bun.write("bathing_centroids.json", JSON.stringify(centriods, null, 2));
