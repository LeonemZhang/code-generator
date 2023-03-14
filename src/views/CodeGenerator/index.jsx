import React, { Component } from "react";
import styles from "./index.module.scss";
import Header from "./components/Header";
import Content from "./components/Content";
export default class CodeGenerator extends Component {
  render() {
    return (
      <div className={styles.codegenerator}>
        <Header></Header>
        <Content></Content>
      </div>
    );
  }
}
