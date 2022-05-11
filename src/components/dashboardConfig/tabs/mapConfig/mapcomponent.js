// react
import React, { useState, useEffect, useRef } from 'react';

// openlayers
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import XYZ from 'ol/source/XYZ'
import {transform} from 'ol/proj'
import {toStringXY} from 'ol/coordinate';
import OSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON';
import TileWMS from 'ol/source/TileWMS';

function MapWrapper(props) {

  // set intial state
  const [ map, setMap ] = useState()
  const [ featuresLayer, setFeaturesLayer ] = useState()
  const [ selectedCoord , setSelectedCoord ] = useState()
  const [wmslayer,setwmslayer] = useState()

  // pull refs
  const mapElement = useRef()
  
  // create state ref that can be accessed in OpenLayers onclick callback function
  //  https://stackoverflow.com/a/60643670
  const mapRef = useRef()
  mapRef.current = map

  // initialize map on first render - logic formerly put into componentDidMount
  useEffect( () => {
//https://taylor.callsen.me/using-openlayers-with-react-functional-components/
    // create and add vector source layer
    const initalFeaturesLayer = new VectorLayer({
      source: new VectorSource({
          url:'http://productplatform.digital.trccompanies.com/geoserver/topp/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=topp%3Astates&maxFeatures=50&outputFormat=application%2Fjson',
          format: new GeoJSON(),
      })
    })

    const iniwmsLayer = new TileLayer({
      extent:[24.955967, -124.73142200000001, 49.371735, -66.969849],
      source: new TileWMS({
        url: 'http://productplatform.digital.trccompanies.com/geoserver/wms',
        params: {'LAYERS': 'topp:states', 'TILED': true},
        serverType: 'geoserver',
        // Countries have transparency, so do not fade tiles:
        transition: 0,
      }),
    })
  

    // create map
    const initialMap = new Map({
      target: mapElement.current,
      layers: [
        new TileLayer({
            source: new OSM(),
        }),
        // USGS Topo
        // new TileLayer({
        //   source: new XYZ({
        //     url: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}',
        //   })
        // }),

        // Google Maps Terrain
        /* new TileLayer({
          source: new XYZ({
            url: 'http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}',
          })
        }), */
        iniwmsLayer,

        initalFeaturesLayer,
        
      ],
      view: new View({
        projection: 'EPSG:3857',
        center: [0, 0],
        zoom: 2
      }),
      controls: []
    })

    // set map onclick handler
    initialMap.on('click', handleMapClick)

    // save map and vector layer references to state
    setMap(initialMap)
    setFeaturesLayer(initalFeaturesLayer)
    setwmslayer(iniwmsLayer)
  },[])

  // update map if features prop changes - logic formerly put into componentDidUpdate
  // useEffect( () => {

  //   if (props.length) { // may be null on first render
  //       console.log(props,'....props');
  //     // set features to map
  //     featuresLayer.setSource(
  //       new VectorSource({
  //           url:props.wfsurl,
  //           format: new GeoJSON(), // make sure features is an array
  //       })
  //     )

  //     // fit map to feature extent (with 100px of padding)
  //     map.getView().fit(featuresLayer.getSource().getExtent(), {
  //       padding: [100,100,100,100]
  //     })

  //   }

  // },[props])

//   // map click handler
  const handleMapClick = (event) => {

    // get clicked coordinate using mapRef to access current React state inside OpenLayers callback
    //  https://stackoverflow.com/a/60643670
    const clickedCoord = mapRef.current.getCoordinateFromPixel(event.pixel);

    // transform coord to EPSG 4326 standard Lat Long
    const transormedCoord = transform(clickedCoord, 'EPSG:3857', 'EPSG:4326')

    // set React state
    setSelectedCoord( transormedCoord )

    console.log(transormedCoord)
    
  }

  // render component
  return (      
    <div ref={mapElement} className="map-container"></div>
  ) 

}

export default MapWrapper