import React, { useState, useEffect } from "react";
// reactstrap components
import { Card, Container, Row, Col } from "reactstrap";

import Header from "components/Headers/Header.js";
import DashboardScene from "components/gisMaps/DashboardScene";
import { getActiveWebmap } from "network/ApiAxios";
import TestDashboardMap from "components/gisMaps/TestDashboardMap";
import OAuthInfo from "@arcgis/core/identity/OAuthInfo";
import esriId from "@arcgis/core/identity/IdentityManager";
import Portal from "@arcgis/core/portal/Portal";
import Button from "reactstrap/lib/Button";
import CardHeader from "reactstrap/lib/CardHeader";
import CardBody from "reactstrap/lib/CardBody";
import { getActivePortal } from "network/ApiAxios";
import Charts from "components/dashboard/Charts";

const Index = () => {
  const [data, setData] = useState();
  const [type, setType] = useState("");
  const roleId = localStorage.getItem("role_id");
  const [portal, setPortal] = useState();
  const [isPortalConfig, setIsPortalConfig] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(null);
  useEffect(() => {
    const runAsync = async () => {
      const response = await getActiveWebmap(roleId);
      if (response.data.success) {
        if (response.data.webmap) {
          setType(response.data.webmap.type);
          setData(response.data.webmap);
        }
      }
    };
    runAsync();
  }, []);

  useEffect(() => {
    var info = new OAuthInfo({
      appId: "f1NSd8qLyoLYO2rf",
      popup: false,
    });

    esriId.registerOAuthInfos([info]);

    const runAsync = async () => {
      const response = await getActivePortal(roleId);
      if (response.data.success) {
        if (response.data.portal) {
          setIsPortalConfig(true);
          let tempPortal = new Portal({
            url: `https://${response.data.portal.org_name}.maps.arcgis.com/`,
          });
          tempPortal.authMode = "immediate";
          setPortal(tempPortal);
          esriId
            .checkSignInStatus(info.portalUrl + "/sharing")
            .then((res) => {
              if (res) {
                setIsSignedIn(true);
              }
            })
            .catch((error) => {
              setIsSignedIn(false);
            });
        } else {
          setIsPortalConfig(false);
        }
      }
    };
    runAsync();
  }, [isSignedIn]);

  const onSignInClick = () => {
    portal.load().then(function (res) {
      console.log(res);
    });
  };

  const renderMap = () => {
    if (type === "Web Map") {
      return (
        <>
          <Card className="shadow" style={{ height: "100%" }}>
            <TestDashboardMap data={data} portal={portal} />
          </Card>
        </>
      );
    } else if (type === "Web Scene") {
      return (
        <>
          <Card className="shadow" style={{ height: "500px" }}>
            <DashboardScene data={data} />
          </Card>
        </>
      );
    } else {
      return null;
    }
  };

  const renderBasedOnSignIn = () => {
    if (isPortalConfig === true) {
      if (isSignedIn === true) {
        if (data) {
          return <>{renderMap()}</>;
        } else {
          return (
            <Card className="shadow">
              <h1 className="text-muted d-flex justify-content-center">
                No Configured WebMap or WebScene to display.
              </h1>
            </Card>
          );
        }
      } else if (isSignedIn === false) {
        return renderLoginForm();
      } else {
        return <h3>Loading...</h3>;
      }
    } else if (isPortalConfig === false) {
      return (
        <Card className="shadow">
          <h1 className="text-muted d-flex justify-content-center">
            No configured organization account
          </h1>
        </Card>
      );
    } else {
      return <h3>Loading...</h3>;
    }
  };

  const renderLoginForm = () => {
    return (
      <Container className="mt-5" fluid>
        <Card className="shadow">
          <CardHeader className="text-center">
            <h2 className="text-muted">Sign in to ArcGIS to view content</h2>
          </CardHeader>
          <CardBody className="text-center">
            <Button color="primary" onClick={onSignInClick}>
              Sign in
            </Button>
          </CardBody>
        </Card>
      </Container>
    );
  };

  return (
    <>
      <Header />
      {/* Page content */}
      <Row>
        <Col className="mb-5 " xl="12">
          {renderBasedOnSignIn()}
        </Col>
      </Row>
      <Row>
        <Col style={{ textAlign: "end" }}>
          {isSignedIn === true ? (
            <>
              <Button
                color="primary"
                onClick={() => {
                  esriId.destroyCredentials();
                  setIsSignedIn(false);
                }}
              >
                <i className="fas fa-sign-out-alt"></i>
              </Button>
            </>
          ) : null}
        </Col>
      </Row>
      <Row>
        <Col>
          <Charts />
        </Col>
      </Row>
    </>
  );
};

export default Index;
