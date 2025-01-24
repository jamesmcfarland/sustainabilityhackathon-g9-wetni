import { feature } from "@turf/helpers";

import { featureCollection } from "@turf/helpers";

import { toWgs84 } from "@turf/projection";

export const epsg3857Convert = (geoJson: GeoJSON.FeatureCollection) => {
  return featureCollection(
    geoJson.features.map((f) => toWgs84(feature(f.geometry)))
  );
};
