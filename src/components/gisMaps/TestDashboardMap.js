import React, { useRef, useEffect, useState, useContext } from "react";
import "./testDashboard.css";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import FeatureTable from "@arcgis/core/widgets/FeatureTable";
import * as watchUtils from "@arcgis/core/core/watchUtils.js";
import * as intl from "@arcgis/core/intl";
import PortalItem from "@arcgis/core/portal/PortalItem";
import * as promiseUtils from "@arcgis/core/core/promiseUtils";
import Layer from "@arcgis/core/layers/Layer";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";
import PortalQueryParams from "@arcgis/core/portal/PortalQueryParams";
import { funcContext } from "GlobalState";
import funcsConditions from "./funcsConditions";
import dashboardFuncs from "./dashboardFuncs";

const TestDashboardMap = (props) => {
  const mapDiv = useRef(null);
  const tableDiv = useRef();
  const [webmap, setWebmap] = useState();
  const [view, setView] = useState();
  const [layerList, setLayerList] = useState();
  const [search, setSearch] = useState();
  const [compass, setCompass] = useState();
  const [locate, setLocate] = useState();
  const [directions, setDirections] = useState();
  const [home, setHome] = useState();
  const [state] = useContext(funcContext);

  var template =
    '<div data-itemid="{id}" class="card block" draggable="true">' +
    '<figure class="card-image-wrap"><img class="card-image" src="{thumbnailUrl}" alt="Card Thumbnail">' +
    '<figcaption class="card-image-caption">{title}</figcaption>' +
    "</figure>" +
    // '<div class="card-content">' +
    // "<li>Published Date:</li>" +
    // "{created}" +
    // "<li>Owner:</li>" +
    // "{owner}" +
    // "</div>" +
    "</div>";

  //this code sets view and webmap initially and when data from props changes
  useEffect(() => {
    if (mapDiv.current) {
      if (props.data) {
        const webmap = new WebMap({
          portalItem: {
            id: props.data.portalid,
          },
        });
        const view = new MapView({
          container: mapDiv.current,
          map: webmap,
          // zoom: 3,
          // center: [-98, 38.5],
          popup: {
            dockEnabled: true,
            dockOptions: {
              buttonEnabled: false,
              breakpoint: false,
            },
          },
        });
        setWebmap(webmap);
        setView(view);
      }
    }
  }, [props.data]);

  //code for feature table, runs initially and also when view changes
  useEffect(() => {
    const whenViewLoad = async () => {
      var features = [];
      var id, selectedFeature;
      const loadedView = await view?.when();
      if (loadedView) {
        if (props.data) {
          const featureLayer = webmap.findLayerById(props.data.layer_id);
          featureLayer.title = props.data.layer_title;
          featureLayer.outFields = ["*"];
          const featureTable = new FeatureTable({
            view: view,
            layer: featureLayer,
            // attachmentsEnabled: true,
            // editingEnabled: true,
            fieldConfigs: props.data.field_configs,
            container: tableDiv.current,
          });
          //for functionalities(widgets)
          dashboardFuncs(
            view,
            setLayerList,
            setSearch,
            setCompass,
            setLocate,
            setDirections,
            setHome
          );
          featureTable.on("selection-change", (changes) => {
            // If row is unselected in table, remove it from the features array
            changes.removed.forEach((item) => {
              const resdata = features.find((data) => {
                return data.feature === item.feature;
              });
            });
            // If a row is selected, add to the features array
            changes.added.forEach((item) => {
              const feature = item.feature;
              features.push({
                feature: feature,
              });

              // Listen for row selection in the feature table. If the popup is open and a row is selected that is not the same feature as opened popup, close the existing popup.
              var ObjectID;
              if (feature.attributes.OID) {
                ObjectID = feature.attributes.OID;
              } else if (feature.attributes.FID) {
                ObjectID = feature.attributes.FID;
              } else if (feature.attributes.objectid) {
                ObjectID = feature.attributes.objectid;
              } else {
                ObjectID = feature.attributes.OBJECTID;
              }
              if (ObjectID !== id && view.popup.visible === true) {
                featureTable.deselectRows(selectedFeature);
                view.popup.close();
              }
            });
          });
          watchUtils.watch(view.popup.viewModel, "active", (graphic) => {
            selectedFeature = view.popup.selectedFeature;
            if (
              view.popup.selectedFeature !== null &&
              view.popup.visible !== false
            ) {
              featureTable.clearSelection();
              featureTable.selectRows(view.popup.selectedFeature);
              id = view.popup.selectedFeature?.getObjectId();
            }
          });
        }
      }
    };
    whenViewLoad();
  }, [view]);

  //toggling widgets from sidebar
  useEffect(() => {
    funcsConditions(
      view,
      state,
      layerList,
      search,
      compass,
      locate,
      directions,
      home
    );
  }, [view, state]);

  //for dragging and dropping layers from our content to map
  useEffect(() => {
    view?.when(function () {
      props.portal.load().then(function () {
        const queryParams = new PortalQueryParams({
          query: "owner:" + props.portal.user.username,
          num: 20,
        });
        props.portal.queryItems(queryParams).then((res) => {
          const layerItems = [];
          res.results.forEach((item) => {
            if (item.isLayer) {
              layerItems.push(item.id);
            }
          });
          var portalItems = layerItems.map(function (itemid) {
            return new PortalItem({
              id: itemid,
            }).load();
          });

          promiseUtils.eachAlways(portalItems).then(function (items) {
            var docFrag = document.createDocumentFragment();
            items.map(function (result) {
              var item = result.value;
              var card = intl.substitute(template, item);
              var elem = document.createElement("div");
              elem.innerHTML = card;
              // This is a technique to turn a DOM string to a DOM element.
              var target = elem.firstChild;
              docFrag.appendChild(target);
              target.addEventListener("dragstart", function (event) {
                var id = event.currentTarget.getAttribute("data-itemid");
                event.dataTransfer.setData("text", id);
              });
            });
            document.querySelector(".cards-list")?.appendChild(docFrag);
            view.container.addEventListener("dragover", function (event) {
              event.preventDefault();
              event.dataTransfer.dropEffect = "copy";
            });

            view.container.addEventListener("drop", function (event) {
              event.preventDefault();
              var id = event.dataTransfer.getData("text");
              var resultItem = items.find(function (x) {
                return x.value.id === id;
              });
              var item = resultItem?.value;
              if (item && item.isLayer) {
                Layer.fromPortalItem({
                  portalItem: item,
                }).then(function (layer) {
                  webmap.add(layer);
                  view.extent = item.extent;
                });
              }
            });
          });
        });
      });
    });
  }, [view]);

  return (
    <>
      <Row>
        <Col md={2} className="pr-0">
          <div id="itemDiv" className="esri-widget">
            <label className="description">
              <b>Instructions:</b>
              <br />
            </label>
            <label className="description">
              Drag Layers to the Map
              <br />
            </label>
            <label className="description"></label>
            <div className="cards-list"></div>
          </div>
        </Col>
        <Col md={10} className="pl-0">
          {/*div to display map*/}
          <div ref={mapDiv} id="mapDiv"></div>
          {/* div to display feature table */}
          <div ref={tableDiv} id="tableDiv"></div>
        </Col>
      </Row>
    </>
  );
};

export default TestDashboardMap;
