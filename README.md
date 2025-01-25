# QUB EEECS 2025 Sustainability Hackathon - Water - Group 9

This is a [Next.js](https://nextjs.org) project, using [shadcn/ui](https://ui.shadcn.com), [MapBox](https://mapbox.com) via [react-map-gl](https://visgl.github.io/react-map-gl/), [proj4](http://proj4js.org) and [turf](https://turfjs.org).

It is deployed live with Vercel at [this link](https://sustainabilityhackathon-g9-wetni.vercel.app).

[The Bun Javascript Toolkit](https://bun.sh) was used for development

## Datasets Used

| Name                                        | Link                                                                                              | Use                                                                                                                                                                                                                                                            |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lakes of Northern Ireland                   | [OpenDataNI](https://admin.opendatani.gov.uk/dataset/lakes-of-northern-ireland)                   | Mapping out locations of all primary water bodies in NI, detecting center points and lake metadata                                                                                                                                                             |
| River Water Quality Monitoring 1990 to 2018 | [OpenDataNI](https://admin.opendatani.gov.uk/dataset/river-water-quality-monitoring-1990-to-2018) | Latest data from 2018 was taken for each site and put through a scoring algorithm to determine the water score                                                                                                                                                 |
| Bathing Waters Directive - Protected Areas  | [OpenDataNI](https://admin.opendatani.gov.uk/dataset/bathing-waters-directive-protected-areas)    | **Not used in current version** - This data was originally used to show and map boundaries of coastal bathing areas, however we were not able to locate good quality monitoring datasets for this in a reasonable time, so it is disabled in the live version. |

## Data usage

### Preprocessing

All data underwent significant pre-processing, which can be seen in `src/preprocessing`.

This was done primarily for performance reasons, as map math is very computationally expensive, and some of the datasets are multiple megabytes in size. (The lakes dataset took 30s to process on a M2 Macbook)

The output can be found in `_preprocessing_outputs`, this was then converted to a typescript object and placed in `src/data`. There you can see many iterations of the data sources.

#### Summary

- The Lakes data needed to be converted from the Irish Grid (EPSG-29902) format to WGS84 (Latitude/Longitude), and a custom formatter was needed for this (see `src/utils/epsg29902Convert.ts`)
- The water quality data also needed significant work, as some sites had duplicated data, which was omitted in `src/preprocessing/dedupe.ts`
- The bathing coordinate data needed converted from Web Mercator (EPSG-3857) to WGS84 also, the conversion can be found in `src/utils/epsg3857.ts`

### Quality Report

When a location is selected, we grab the water quality stations within 1km and where possible, calculate a score based off of their readings. This score is then averaged, and then displayed at the top. The thresholds used in the scoring algorithm were decided on by a mix of research and GenAI assistance to understand the chemcial terms.

### Reviews

Users can leave reviews of the location also, though these are not currently persisted to any kind of storage, and will be lost when the user closes the drawer

## MapBox

We used MapBox for this project, a API token is needed to run the map, you can get one at [Mapbox](https://mapbox.com).

## Deployed on Vercel

Site is available at [this link](https://https://sustainabilityhackathon-g9-wetni.vercel.app).

## Running Locally

Get your Mapbox API Token!

First, install dependancies.

```
npm i
yarn
bun install
```

Then start the development server.

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
