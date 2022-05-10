import React, { useState } from "react";
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";
import Container from "reactstrap/lib/Container";
import RolesDropdown from "components/commonComps/RolesDropdown";
import PortalItemForm from "./verticalTabs/PortalItemForm";

const MapConfig = () => {
  const [roleId, setRoleId] = useState("");
  const [selectedRole, setSelectedRole] = useState("Select a role");

  return (
    <>
      <Container fluid>
        <Row>
          <Col className="pl-0">
            <RolesDropdown
              setRoleId={setRoleId}
              selectedRole={selectedRole}
              setSelectedRole={setSelectedRole}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <PortalItemForm roleId={roleId} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default MapConfig;
