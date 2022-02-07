import React from "react";
import { Link } from "react-router-dom";
import Manual from "./manual";
import Brand from "./brand";
import axios from "axios";

class Goods extends React.Component {
  state = {
    persons: [],
  };

  componentDidMount() {
    axios.get(`http://localhost:8000/api/goods`).then((res) => {
      const persons = res.data;
      this.setState({ persons });
    });
  }

  render() {
    return (
      <div>
        <div>
          <Link to="/">マニュアル管理</Link>
          商品管理
          <br />
          <Link to="/brand">ブランド管理</Link>
        </div>
        <ul>
          {this.state.persons.map((person) => (
            <li>
              {person.id}:{person.goods_category}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Goods;
