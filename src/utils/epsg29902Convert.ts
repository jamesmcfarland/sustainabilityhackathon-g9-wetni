import proj4 from "proj4";
proj4.defs(
  "EPSG:29902",
  "+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=1.000035 +x_0=200000 +y_0=250000 +ellps=airy +datum=ire65 +units=m +no_defs"
);

const from = "EPSG:29902";
const to = "EPSG:4326";

function convertCoordinates(coordinates: number[][]): number[][] {
  return coordinates.map((coord) => {
    //round to 1dp
    const roundedCoord = coord.map((num) => Math.round(num));
    // check all numbers in coord are finite numbers
    const nonFiniteNum = roundedCoord.find((num) => !isFinite(num));
    if (nonFiniteNum !== undefined) {
      console.log("Found non-finite number:", nonFiniteNum);
      return coord;
    }
    const [x, y] = proj4(from, to, roundedCoord);
    return [x, y];
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function epsg29902Convert(geojson: any) {
  const features = [];

  for (const feature of geojson.features) {
    const convertedCoordinates = convertCoordinates(
      feature.geometry.coordinates[0]
    );
    const validCoordinates = convertedCoordinates.filter(([lat, lng]) => {
      const isValid = lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;

      if (!isValid) {
        console.log("Removed invalid coordinate:", [lat, lng]);
      }
      return isValid;
    });

    if (validCoordinates.length > 0) {
      features.push({
        ...feature,
        geometry: {
          ...feature.geometry,
          coordinates: [validCoordinates],
        },
      });
    }
  }

  return {
    ...geojson,
    features,
  };
}
