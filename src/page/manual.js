import React from "react";
import { Link } from "react-router-dom";
import Brand from "./brand";
import Goods from "./goods";
import axios from "axios";

class Manual extends React.Component {
  state = {
    persons: [],
  };

  componentDidMount() {
    axios.get(`http://localhost:8000/api/manual`).then((res) => {
      const persons = res.data;
      this.setState({ persons });
    });
  }

  render() {
    return (
      <div>
        <div>
          マニュアル管理
          <br />
          <Link to="/brand">ブランド名管理</Link>
          <Link to="/goods">商品管理</Link>
        </div>
        <ul>
          {this.state.persons.map((person) => (
            <li>:{person.id}{person.goods_name}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Manual;
