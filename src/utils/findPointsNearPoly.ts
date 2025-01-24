type Feature = {
  type: string;
  properties: {
    Site_Code: string;
    Date: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  geometry: {
    type: string;
    coordinates: number[];
  };
};

export type Polygon = {
  type: "Feature";
  geometry: {
    type: "Polygon";
    coordinates: number[][][];
  };
};

export function findPointsNearPolygon(
  polygon: Polygon | undefined,
  points: Feature[],
  distanceMeters = 500
): Feature[] {
  if (!polygon) return [];
  return points.filter((point) => {
    const [px, py] = point.geometry.coordinates;

    // Check each polygon edge
    return polygon.geometry.coordinates[0].some((coord, i) => {
      const next =
        polygon.geometry.coordinates[0][
          (i + 1) % polygon.geometry.coordinates[0].length
        ];
      const distance = pointToLineDistance(
        px,
        py,
        coord[0],
        coord[1],
        next[0],
        next[1]
      );
      return distance <= distanceMeters;
    });
  });
}

function pointToLineDistance(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;

  if (lenSq !== 0) param = dot / lenSq;

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = px - xx;
  const dy = py - yy;

  // Convert to meters assuming WGS84
  return Math.sqrt(dx * dx + dy * dy) * 111139;
}
