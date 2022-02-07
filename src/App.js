import './App.css';
import { Grid } from "@material-ui/core";
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
