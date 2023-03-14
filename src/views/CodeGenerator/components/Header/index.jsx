import React, { Component } from "react";
import styles from "./index.module.scss";
export default class Header extends Component {
  render() {
    return (
      <div className={styles.header}>
        <span
          className={["icon-react", "font-bold", "common-font"].join(" ")}
          style={{ fontSize: "20px" }}
        ></span>
        <div className={["font-bold", "common-font", styles.title].join(" ")}>
          代码生成器
        </div>
      </div>
    );
  }
}
