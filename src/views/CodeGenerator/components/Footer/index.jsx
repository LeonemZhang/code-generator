import { Button } from "antd";
import React, { Component } from "react";
import styles from "./index.module.scss";
export default class Footer extends Component {
  render() {
    return (
      <div className={styles.footer}>
        <span className="title-font">生成代码</span>
        <Button type="primary">一键生成</Button>
      </div>
    );
  }
}
