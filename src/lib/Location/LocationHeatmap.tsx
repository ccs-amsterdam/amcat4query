import { useEffect, useRef, useState } from "react";
import Map, { Layer, MapLayerMouseEvent, Source } from "react-map-gl";
import { Message } from "semantic-ui-react";
import { AmcatIndex, AmcatQuery } from "..";
import { addFilter, postQuery } from "../Amcat";
import Article from "../Article/Article";
import maplibregl from "maplibre-gl";
import { getArticleList } from "../Aggregate/AggregateResult";
import { LocationOptions } from "../interfaces";
import { heatmapLayer, circleLayer } from "./layers";
import "maplibre-gl/dist/maplibre-gl.css";

interface LocationResultsProps {
  /** The index to run the query on */
  index: AmcatIndex;
  /** An optional query to limit results*/
  query?: AmcatQuery;
  /** Additional options for location visualization ({field, numdocs}) */
  options: LocationOptions;
}

/** Heat map of documents displayed on a map */
export default function LocationHeatmap({ index, query, options }: LocationResultsProps) {
  const [data, setData] = useState<any[]>();
  const [articleId, setArticleId] = useState<[number]>();
  const [zoom, setZoom] = useState<AmcatQuery>();
  const mapref = useRef();

  useEffect(() => {
    // Obtain articles containing geo_point information
    if (index == null || options?.field == null) return;
    const q = addFilter(query, { [options.field]: { exists: true } });
    postQuery(index, q, {
      fields: [options.field],
      per_page: options.numdocs || 100,
      sort: [{ date: { order: "desc" } }],
    })
      .then((data) => setData(data.data.results))
      .catch((error) => console.error(error));
  }, [index, query, options]);

  if (index == null || options?.field == null) return null;
  if (data == null || data.length === 0) return <Message warning>No location data found</Message>;

  const handleMapClick = (event: MapLayerMouseEvent) => {
    // If user clicked on a circle, show either one article or a list of articles
    if (mapref == null || mapref.current == null) return;
    const features = (mapref.current as any).queryRenderedFeatures(event.point, {
      layers: ["document"],
    });
    const ids = features.map((f: any) => f.properties._id);
    console.log(ids);
    if (ids.length > 1) setZoom({ filters: { _id: ids } });
    else if (ids.length === 1) setArticleId([ids[0]]);
  };

  // Convert articles with possibly multiple points to flat list of points and article _id
  const features: GeoJSON.Feature<GeoJSON.Geometry>[] = data.reduce((markers, article, i) => {
    const locs = Array.isArray(article[options.field])
      ? article[options.field]
      : [article[options.field]];
    return markers.concat(
      locs.map(
        (loc: { lon: number; lat: number }, j: number): GeoJSON.Feature<GeoJSON.Geometry> => ({
          type: "Feature",
          properties: { _id: article._id },
          geometry: { type: "Point", coordinates: [loc.lon, loc.lat, 0.0] },
        })
      )
    );
  }, []);

  const avglon = median(features.map((x: any) => x.geometry.coordinates[0]));
  const avglat = median(features.map((x: any) => x.geometry.coordinates[1]));
  console.log({ features, avglon, avglat });
  //not too sure we should publish this on github...
  const TOKEN = "38e63cc279454587b03c3c342968d12e";

  return (
    <>
      {getArticleList(index, zoom, () => setZoom(undefined))}
      <Map
        mapLib={maplibregl}
        ref={mapref}
        initialViewState={{
          longitude: avglon,
          latitude: avglat,
          zoom: 10,
        }}
        style={{ width: options.width || "100%", height: options.height || 600 }}
        mapStyle={`https://maps.geoapify.com/v1/styles/klokantech-basic/style.json?apiKey=${TOKEN}`}
        onClick={handleMapClick}
      >
        <Source type="geojson" data={{ type: "FeatureCollection", features }}>
          <Layer {...heatmapLayer} />
          <Layer {...circleLayer} />
        </Source>
      </Map>
      <Article id={articleId} index={index} query={query || {}} />
    </>
  );
}

function median(numbers: number[]): number {
  const sorted = numbers.slice().sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted[middle];
}
