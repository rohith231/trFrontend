/*eslint-disable*/
import React, { useEffect, useState } from "react";
import { NavLink as NavLinkRRD, Link } from "react-router-dom";
// nodejs library to set properties for components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import { Route, Switch, Redirect } from "react-router-dom";
// reactstrap components
import { NavItem, NavLink, Nav, Container, Row, Col } from "reactstrap";
import appRole from "commonFunctions/appRole";
import FunctionalityBar from "./FunctionalityBar";
import NavbarBrand from "reactstrap/lib/NavbarBrand";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./sidebar.css";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import ChartsBar from "./ChartsBar";
import Collapse from "reactstrap/lib/Collapse";
import { getBanner } from "network/ApiAxios";

const Sidebar = (props) => {
  const clientId = localStorage.getItem("client_id");
  const [toggle, setToggle] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [banner, setBanner] = useState();

  useEffect(() => {
    const runAsync = async () => {
      const res = await getBanner(clientId);
      if (res.data) {
        if (res.data.banner) {
          setBanner(res.data.banner);
        }
      }
    };
    runAsync();
  }, []);

  const getRoutes = (routes) => {
    const roleId = localStorage.getItem("role_id");
    return routes.map((prop, key) => {
      if (
        prop.layout.includes("/admin") &&
        prop.access?.includes(appRole(roleId))
      ) {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  const colorForRole = () => {
    const roleId = localStorage.getItem("role_id");
    if (roleId === "2") {
      return "#e3f2fd";
    } else if (roleId === "3") {
      return "white";
    } else {
      return "#e0f2f1";
    }
  };
  const redirectPath = () => {
    const roleId = localStorage.getItem("role_id");
    if (roleId === "3") {
      return `/admin/client-management`;
    } else if (roleId === "2") {
      return `/admin/index/config/map`;
    } else {
      return `/admin/index`;
    }
  };
  const createLinks = (routes) => {
    const roleId = localStorage.getItem("role_id");
    return routes.map((prop, key) => {
      if (
        prop.layout.includes("/admin") &&
        prop.access?.includes(appRole(roleId))
      ) {
        if (prop.name === "Dashboard") {
          return (
            <div key={key}>
              <NavItem className="py-2 ">
                <Row>
                  <Col sm="10" xs="8">
                    <NavLink
                      to={prop.layout + prop.path}
                      tag={NavLinkRRD}
                      activeClassName="active"
                      onClick={() => {
                        setToggle(true);
                      }}
                    >
                      <Row style={{ marginLeft: "0px", marginRight: "3px" }}>
                        <Col sm="4" xs="3" style={{ textAlign: "center" }}>
                          <span style={{ fontSize: "28px" }}>
                            <i className={prop.icon} />
                          </span>
                        </Col>
                        <Col sm="8" xs="9" style={{ textAlign: "start" }}>
                          <b> {prop.name}</b>
                        </Col>
                      </Row>
                    </NavLink>
                  </Col>
                </Row>
              </NavItem>
            </div>
          );
        } else {
          return (
            <NavItem
              key={key}
              style={{ paddingTop: "10px", paddingBottom: "10px" }}
              // className="active"
              onClick={() => {
                setToggle(true);
              }}
            >
              <Row>
                <Col sm="10" xs="8">
                  <NavLink
                    to={prop.layout + prop.path}
                    tag={NavLinkRRD}
                    activeClassName="active"
                  >
                    <Row style={{ marginLeft: "0px", marginRight: "3px" }}>
                      <Col sm="4" xs="3" style={{ textAlign: "center" }}>
                        <span style={{ fontSize: "28px" }}>
                          <i className={prop.icon} />
                        </span>
                      </Col>
                      <Col sm="8" xs="9" style={{ textAlign: "start" }}>
                        <b>{prop.name}</b>
                      </Col>
                    </Row>
                  </NavLink>
                </Col>
                <Col sm="2" xs="4"></Col>
              </Row>
            </NavItem>
          );
        }
      } else {
        return null;
      }
    });
  };

  const getBrandText = (path) => {
    for (let i = 0; i < props.routes.length; i++) {
      if (
        props.location.pathname.indexOf(
          props.routes[i].layout + props.routes[i].path
        ) !== -1
      ) {
        return props.routes[i].name;
      }
    }
    return "Brand";
  };
  return (
    <div id="wrapper" className={toggle ? "toggled" : ""}>
      <div id="sidebar-wrapper" style={{ backgroundColor: colorForRole() }}>
        <div className="sidebar-brand" id="sidebrand-wrapper">
          {props.logo ? (
            <NavbarBrand className="pt-0" to={props.logo.innerLink} tag={Link}>
              <img
                style={{ width: "90px", height: "50px" }}
                alt={props.logo.imgAlt}
                className="navbar-brand-img"
                src={
                  localStorage.getItem("role_id") === "3"
                    ? props.logo.imgSrc
                    : banner
                }
              />
            </NavbarBrand>
          ) : null}
        </div>
        <div
          className="sidebar-close"
          onClick={() => {
            setToggle(true);
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </div>
        <div className="sidebar-nav" id="sidenav-wrapper">
          <Nav navbar>{createLinks(props.routes)}</Nav>
          {["*"].includes(appRole(localStorage.getItem("role_id"))) ? (
            <div className="mt-3">
              <FunctionalityBar />
              <ChartsBar />
            </div>
          ) : null}
        </div>
      </div>

      {/* <section id="content-wrapper"></section> */}
      <div className="main-content">
        <AdminNavbar
          {...props}
          setNavebar=""
          toggle={toggle}
          setToggle={setToggle}
          brandText={getBrandText(props.location.pathname)}
        />
        <Switch>
          {getRoutes(props.routes)}
          <Redirect from="*" to={redirectPath()} />
        </Switch>
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </div>
  );
};

export default Sidebar;
