/* eslint-disable @typescript-eslint/no-unused-vars */
import { bathingData } from "@/data/bathing";
import { epsg3857Convert } from "@/utils/epsg3857Convert";

const converted = epsg3857Convert(bathingData);
// commented out to allow build to pass
//Bun.write("bathing_data_converted.json", JSON.stringify(converted, null, 2));
