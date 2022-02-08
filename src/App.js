import './App.css';
import { Grid } from "@mui/material";
import Header from './components/templates/Header';
import Content from './components/templates/Content';

const App = () => {
  return (
    <Grid container direction="column">
      <Header />
      <div style={{ padding: 30 }}>
        <Content />
      </div>
    </Grid>
  );
};

export default App;
