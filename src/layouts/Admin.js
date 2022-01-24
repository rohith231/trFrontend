import React from "react";
// reactstrap components
// core components
import routes from "routes.js";
import GlobalState from "GlobalState";
import Sidebar from "components/Sidebar/Sidebar";

class Admin extends React.Component {
  render() {
    return (
      <GlobalState>
        <Sidebar
          {...this.props}
          routes={routes}
          logo={{
            innerLink: "/admin/index",
            imgSrc: require("assets/img/brand/tech-pro.jpg").default,
            imgAlt: "...",
          }}
        />
      </GlobalState>
    );
  }
}

export default Admin;
