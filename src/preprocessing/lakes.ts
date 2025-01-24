import { lakesv2 } from "./data/lakesv2";
import { epsg29902Convert } from "./utils/epsg29902Convert";

const converted = epsg29902Convert(lakesv2);

Bun.write("lakes_converted.json", JSON.stringify(converted, null, 2));
