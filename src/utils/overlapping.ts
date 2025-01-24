import * as turf from "@turf/turf";

export function findOverlappingBufferedPoints(
  points: GeoJSON.FeatureCollection<GeoJSON.Point>,
  polygons: GeoJSON.FeatureCollection<GeoJSON.Polygon>,
  bufferDistance: number,
  units: turf.Units = "kilometers"
) {
  const bufferedPoints = points.features.map((point) =>
    turf.buffer(point, bufferDistance, { units })
  );

  return points.features.filter(
    (point, i) =>
      bufferedPoints[i] &&
      polygons.features.some((poly) =>
        turf.booleanIntersects(bufferedPoints[i]!, poly)
      )
  );
}
