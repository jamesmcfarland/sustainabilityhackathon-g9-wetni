"use client";
import MapComponent from "@/components/map";
import Image from "next/image";

import qubLogo from "@/images/qub-white.png";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { lakesV3Centeroids } from "@/data/lakesv3Centroids";
import { findPointsNearPolygon, Polygon } from "@/utils/findPointsNearPoly";
import { qualityLatestDedupe } from "@/data/quality-latest-deduped";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { lakesv3 } from "@/data/lakesv3";
import {
  calculateWaterQualityScore,
  WaterQualityData,
} from "@/utils/calculateScore";
import { CircleAlertIcon, ExternalLinkIcon } from "lucide-react";
import { getParameterColour } from "@/utils/getParameterColour";

import RadialGraph from "@/components/graph";
import ReviewComponent from "@/components/review";
import { Separator } from "@/components/ui/separator";

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

  const pointsNear = useMemo(() => {
    const points = findPointsNearPolygon(
      selectedLakePolygon as Polygon,
      qualityLatestDedupe.features,
      1000
    );
    return points.map((point) => {
      return {
        ...point,
        score: calculateWaterQualityScore(
          point.properties as unknown as WaterQualityData
        ),
      };
    });
  }, [selectedLakePolygon]);

  const averageScore = useMemo(
    () =>
      Math.round(
        (pointsNear.reduce(
          (sum, p) => (p.score !== -1 ? sum + p.score : sum),
          0
        ) / pointsNear.filter((p) => p.score !== -1).length || -1) * 10
      ) / 10,
    [pointsNear]
  );

  return (
    <div
      className="h-screen w-screen m-0 p-0 flex flex-col"
      style={{ backgroundColor: "#87CEEB" }}
    >
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
            {/* <DrawerTitle>{selectedLakeCentroid?.properties.name} - {averageScore}</DrawerTitle>
            <DrawerDescription>
              County {selectedLakeCentroid?.properties.county}
            </DrawerDescription>
            <DrawerDescription>
              Size{" "}
              {Math.round(
                ((selectedLakeCentroid?.properties.squ_metre ?? 0) / 1000000) *
                100
              ) / 100}{" "}
              km²
            </DrawerDescription> */}
            <div className="grid grid-cols-2">
              <div>
                <div className="flex items-center gap-12">
                  <div className="flex flex-col items-start justify-center">
                    <DrawerTitle>
                      {selectedLakeCentroid?.properties.name}
                    </DrawerTitle>

                    <h2 className="text-muted-foreground">
                      County {selectedLakeCentroid?.properties.county}
                    </h2>
                    <h1 className="text-muted-foreground mono text-xs">
                      {selectedID}
                    </h1>
                  </div>
                  <Button asChild>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${selectedLakeCentroid?.properties.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on map <ExternalLinkIcon />
                    </a>
                  </Button>
                </div>
                <Separator orientation="horizontal" className="mt-4" />
                <ReviewComponent />
              </div>

              <div className="text-center">
                <h1 className=" font-semibold">Water Quality</h1>
                <RadialGraph score={averageScore} />
              </div>
            </div>

            {pointsNear.length > 0 && (
              <Table>
                <TableCaption>Nearby water quality monitors</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableCell>Site</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Oxygen Level (mg/l)</TableCell>
                    <TableCell>pH</TableCell>
                    <TableCell>Organic Pollution - BOD (mg/l)</TableCell>
                    {/*  <TableCell>Suspended Solutions (mg/l)</TableCell> */}
                    <TableCell>Ammonia (mg/l)</TableCell>
                    <TableCell>Score</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pointsNear.map((point, i) => (
                    <TableRow key={`pN-${i}`}>
                      <TableCell className="font-medium">
                        {point.properties.Station_Name.toLowerCase()
                          .replace(/\b\w/g, (char: string) =>
                            char.toUpperCase()
                          )
                          .replaceAll("At", "@")}
                      </TableCell>
                      <TableCell>
                        {new Date(point.properties.Date).toLocaleDateString(
                          "en-GB"
                        )}
                      </TableCell>
                      {["DO_MGL", "PH", "BOD_MGL", "NH4_N_MGL"].map((param) => (
                        <TableCell key={param}>
                          {point.properties[param] !== null ? (
                            <span
                              style={{
                                color: getParameterColour(
                                  param,
                                  point.properties[param]
                                ),
                              }}
                            >
                              {point.properties[param]}
                            </span>
                          ) : (
                            <CircleAlertIcon color="orange" className="h-4" />
                          )}
                        </TableCell>
                      ))}
                      {/* <TableCell>{feature.properties.SS_MGL ? feature.properties.SS_MGL : <CircleAlertIcon color="orange" className="h-4 "/>}</TableCell>*/}

                      <TableCell>
                        {point.score === -1
                          ? "Not Available"
                          : point.score + "%"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {pointsNear.length === 0 && <h1>No nearby quality monitors</h1>}
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
