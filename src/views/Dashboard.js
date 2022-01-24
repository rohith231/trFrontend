import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Index from "./Index";

const Dashboard = () => {
  return (
    <>
      <Switch>
        <Route path="/admin/index" component={Index} exact />
        <Redirect from="*" to={`/`} />
      </Switch>
    </>
  );
};

export default Dashboard;
