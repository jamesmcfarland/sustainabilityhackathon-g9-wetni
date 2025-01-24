"use client";
import MapComponent from "@/components/map";
import Image from "next/image";

import qubLogo from "@/images/qub-white.png";
import { MapPinIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { lakesV3Centeroids } from "@/data/lakesv3Centroids";
import { findPointsNearPolygon, Polygon } from "@/utils/findPointsNearPoly";
import { qualityLatestDedupe } from "@/data/quality-latest-deduped";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { lakesv3 } from "@/data/lakesv3";

const x = {
  type: "Feature",
  properties: {
    OBJECTID: 324,
    name: "Rowallane House Pond",
    lake_code: "Lake_0315",
    squ_metre: 1857.755,
    area_ha: 0.186,
    centre_x: 340648,
    centre_y: 357664,
    ehro_2007: 0,
    county: "Down",
    border_m: 212.75,
    contour_m: 100,
    name_12: "Quoile",
    ms_cd: "GBNI1NE050504064\r\n",
    town: "SAINTFIELD",
    distance: 1443,
    SHAPE__Length: null,
    SHAPE__Area: null,
    GlobalID: "b24e8e43-aa23-441e-a894-000c20c782d6",
  },
  geometry: {
    type: "Point",
    coordinates: [-5.832460340272608, 54.44802248194129],
  },
};

export default function Home() {
  // get the ID from the search params

  const [selectedID, setselectedID] = useState<string | null>();

  const selectedLakeCentroid = useMemo(
    () =>
      lakesV3Centeroids.find((lake) => lake.properties.GlobalID === selectedID),
    [selectedID]
  );
  const selectedLakePolygon = useMemo(
    () =>
      lakesv3.features.find((lake) => lake.properties?.GlobalID === selectedID),
    [selectedID]
  );

  const pointsNear = useMemo(
    () =>
      findPointsNearPolygon(
        selectedLakePolygon as Polygon,
        qualityLatestDedupe.features,
        1000
      ),
    [selectedLakePolygon]
  );

  return (
    <div className="h-screen w-screen m-0 p-0 flex flex-col">
      <nav className="flex justify-between items-center p-4 backdrop-blur-md bg-white/30 fixed w-full z-50 text-white drop-shadow-lg">
        <h1 className="text-3xl font-bold tracking-tight font-serif">wetni</h1>

        <div className="flex items-center gap-2">
          <Image src={qubLogo} alt="qub logo" height={50} />
          <div className="flex flex-col">
            <h1 className="text-lg font-bold">
              2025 EEECS Sustainability Hackathon - Water
            </h1>
            <div className="text-md font-normal">Group 9</div>
          </div>
        </div>
      </nav>
      <div className="w-full h-full">
        <MapComponent onMarkerClick={(id) => setselectedID(id)} />
      </div>
      <Drawer open={!!selectedID} onClose={() => setselectedID(null)}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{selectedLakeCentroid?.properties.name}</DrawerTitle>
            <DrawerDescription>
              County {selectedLakeCentroid?.properties.county}
            </DrawerDescription>
            <DrawerDescription>
              Size{" "}
              {Math.round(
                (selectedLakeCentroid?.properties.squ_metre ?? 0 / 1000000) *
                  100
              ) / 100}{" "}
              km²
            </DrawerDescription>

            <Table>
              <TableCaption>Nearby water quality monitors</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableCell>Site</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>PH</TableCell>
                  <TableCell>NO3</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pointsNear.map((feature, i) => (
                  <TableRow key={`pN-${i}`}>
                    <TableCell className="font-medium">
                      {feature.properties.Station_Name.toLowerCase()
                        .replace(/\b\w/g, (char) => char.toUpperCase())
                        .replaceAll("At", "@")}
                    </TableCell>
                    <TableCell>
                      {new Date(feature.properties.Date).toLocaleDateString(
                        "en-GB"
                      )}
                    </TableCell>
                    <TableCell>{feature.properties.PH}</TableCell>
                    <TableCell>{feature.properties.NO3_N_MGL}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DrawerHeader>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
