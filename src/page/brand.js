import React from "react";
import { Link } from "react-router-dom";
import Manual from "./manual";
import Goods from "./goods";
import axios from "axios";

class Brand extends React.Component {
  state = {
    persons: [],
  };

  componentDidMount() {
    axios.get(`http://localhost:8000/api/brand`).then((res) => {
      const persons = res.data;
      this.setState({ persons });
    });
  }

  render() {
    return (
      <div>
        <div>
          <Link to="/">マニュアル管理</Link>
          <Link to="/goods">商品管理</Link>
          ブランド管理
          <br />
        </div>
        <ul>
          {this.state.persons.map((person) => (
            <li>
              {person.id}:{person.brand_name}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Brand;
