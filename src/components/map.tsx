"use client";

import Map, {
  GeolocateControl,
  Layer,
  LayerProps,
  Marker,
  NavigationControl,
  ScaleControl,
  Source,
} from "react-map-gl";
import { useMemo, useState } from "react";

import { lakesv3 } from "@/data/lakesv3";

import { MapPinIcon, Sheet } from "lucide-react";

import { qualityLatestDedupe } from "@/data/quality-latest-deduped";
import { findPointsNearPolygon } from "@/utils/findPointsNearPoly";
import { bathingV2 } from "@/data/bathingv2";
import { bathingV2Centroids } from "@/data/bathingV2Centroids";
import { lakesV3Centeroids } from "@/data/lakesv3Centroids";
import Image from "next/image";
import MapMarkerImage from "@/images/marker.png";
import MapFlaskImage from "@/images/flask.png";
import MapSwimImage from "@/images/swim.png";

const lakesLayerStyle: LayerProps = {
  id: "lakesData",
  type: "fill",
  paint: {
    "fill-color": "red",
    "fill-opacity": 0.3,
  },
};
const lakesOutlineLayerStyle: LayerProps = {
  id: "lakesDataOutline",
  type: "line",
  paint: {
    "line-color": "yellow",
    "line-width": 4,
  },
};
const bathingLayerStyle: LayerProps = {
  id: "bathingData",
  type: "fill",
  paint: {
    "fill-color": "green",
    "fill-opacity": 0.6,
  },
};

const bathingOutlineLayerStyle: LayerProps = {
  id: "bathingDataOutline",
  type: "line",
  paint: {
    "line-color": "yellow",
    "line-width": 4,
  },
};

export default function MapComponent({
  onMarkerClick,
}: {
  onMarkerClick: (id: string) => void;
}) {
  const [mapReady, setMapReady] = useState(false);

  const pointsNear = useMemo(
    () =>
      lakesv3.features.flatMap((lakeFeature) =>
        findPointsNearPolygon(lakeFeature, qualityLatestDedupe.features, 1500)
      ),
    [lakesv3, qualityLatestDedupe]
  );

  return (
    <div className="w-full h-full">
      <Map
        reuseMaps={true}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{
          latitude: 54.7877,
          longitude: -6.4923,
          zoom: 8,
        }}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        onLoad={() => setMapReady(true)}
      >
        {mapReady && (
          <>
            <Source id="lakesData" type="geojson" data={lakesv3}>
              <Layer {...lakesOutlineLayerStyle} />
              {/* <Layer {...lakesLayerStyle} /> */}
            </Source>

            {/* <Source id="bathingData" type="geojson" data={bathingV2}>
              <Layer {...bathingOutlineLayerStyle} />
              <Layer {...bathingLayerStyle} />
            </Source> */}
          </>
        )}

        {useMemo(
          () =>
            pointsNear.map((feature, i) => (
              <Marker
                key={`pN-${i}`}
                longitude={Number(feature.geometry.coordinates[0])}
                latitude={Number(feature.geometry.coordinates[1])}
              >
                <Image src={MapFlaskImage} alt="flask marker" height={24} />
              </Marker>
            )),
          [pointsNear]
        )}

        {useMemo(
          () =>
            lakesV3Centeroids.map((feature, i) => (
              <Marker
                key={`cent-${i}`}
                longitude={Number(feature.geometry.coordinates[0])}
                latitude={Number(feature.geometry.coordinates[1])}
                onClick={() => onMarkerClick(feature.properties.GlobalID)}
                anchor="bottom"
              >
                <Image
                  src={MapSwimImage}
                  alt="marker"
                  height={32}
                  className="drop-shadow-sm"
                />
              </Marker>
            )),
          [onMarkerClick]
        )}

        {/* {useMemo(
          () =>
            bathingV2Centroids.map((feature, i) => (
              <Marker
                key={`bathing_cent-${i}`}
                longitude={Number(feature.geometry.coordinates[0])}
                latitude={Number(feature.geometry.coordinates[1])}
              >
                <MapPinIcon color="red" className="drop-shadow-sm" />
              </Marker>
            )),
          []
        )} */}
        <ScaleControl />
        <NavigationControl position="bottom-right" />
        <GeolocateControl position="bottom-right" />
      </Map>
    </div>
  );
}
