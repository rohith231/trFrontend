import React, { useState } from "react";
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";
import Container from "reactstrap/lib/Container";
import RolesDropdown from "components/commonComps/RolesDropdown";
import PortalItemForm from "./verticalTabs/PortalItemForm";
import Login from "./loginGeoserver";
import Button from "reactstrap/lib/Button";
import { Form, FormGroup, Label, Input } from "reactstrap";

import SelectTableComponent from "./geoserverLayerslist";
import MapWrapper from "./mapcomponent";


const MapConfig = () => {
  const [roleId, setRoleId] = useState("");
  const [selectedRole, setSelectedRole] = useState("Select a role");
  const [token, setToken] = useState();
  // const { token, setToken } = useToken();

  if(!token) {
    return <Login setToken={setToken} />
  }

  return (
    <>
      <Container fluid>
      <FormGroup className="text-center">
      <Button color="primary" >
          Connect to Geoserver
        </Button>
        </FormGroup>
        <Login></Login>
        <FormGroup className="text-center">
        <Button color="primary" >
            Layer list
        </Button>
      </FormGroup>
        <SelectTableComponent></SelectTableComponent>
        <FormGroup className="text-center">
      <Button color="primary" >
          Layers on Map
        </Button>
        </FormGroup>
        <FormGroup>
            <MapWrapper ></MapWrapper>
        </FormGroup>
      <FormGroup className="text-center">
        
        <Row>
          <Col className="pl-0">
            <RolesDropdown
              setRoleId={setRoleId}
              selectedRole={selectedRole}
              setSelectedRole={setSelectedRole}
            />
          </Col>
        </Row>
        </FormGroup>

        <FormGroup>
        <Row>
          <Col>
            <PortalItemForm roleId={roleId} />
          </Col>
        </Row>
        </FormGroup>
      </Container>
    </>
  );
};

export default MapConfig;
