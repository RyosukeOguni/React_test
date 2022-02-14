import * as React from "react";
import { Link } from "react-router-dom";
import { Tabs, Tab, Box } from "@material-ui/core";

function Tablink() {
  const [value, setValue] = React.useState("manual");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box fullWidth>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="management menu tabs"
      >
        <Tab
          value="manual"
          label="マニュアル管理"
          to="/management"
          component={Link}
        />
        <Tab value="goods" label="商品管理" to="goods" component={Link} />
        <Tab value="brand" label="ブランド名管理" to="brand" component={Link} />
      </Tabs>
    </Box>
  );
}

export default Tablink;
