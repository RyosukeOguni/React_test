import React from "react";
import { Grid } from "@mui/material";
import { Route, Switch, withRouter } from "react-router-dom";
import routes from "../../routes";

function Content() {
  return (
    <Grid container>
      <Grid sm={2}/>
      <Grid lg={8} sm={8} spacing={10}>
        <Switch>
          {routes.map((route, idx) => (
            <Route
              path={route.path}
              exact={route.exact}
              component={route.component}
              key={idx}
            />
          ))}
        </Switch>
      </Grid>
    </Grid>
  );
}
export default withRouter(Content);
