import { qualityLatest } from "../data/quality-latest";

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

type FeatureCollection = {
  type: string;
  name: string;
  features: Feature[];
  crs: {
    type: string;
    properties: { name: string };
  };
};

function deduplicateByLatestDate(data: FeatureCollection): FeatureCollection {
  const latestByStation = new Map<string, Feature>();

  data.features.forEach((feature) => {
    const siteCode = feature.properties.Site_Code;
    const date = new Date(feature.properties.Date);

    if (
      !latestByStation.has(siteCode) ||
      date > new Date(latestByStation.get(siteCode)!.properties.Date)
    ) {
      latestByStation.set(siteCode, feature);
    }
  });

  return {
    ...data,
    features: Array.from(latestByStation.values()),
  };
}

const deduped = deduplicateByLatestDate(qualityLatest);
console.log(`${qualityLatest.features.length} -> ${deduped.features.length}`);
// commented out to allow build to pass
//Bun.write("deduped.geojson", JSON.stringify(deduped));
