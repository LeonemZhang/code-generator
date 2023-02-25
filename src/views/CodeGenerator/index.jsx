import React, { Component } from "react";
import styles from "./index.module.scss";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Content from "./components/Content";
export default class CodeGenerator extends Component {
  render() {
    return (
      <div className={styles.codegenerator}>
        <Header></Header>
        <div className={styles.bottom}>
          <Content></Content>
          <Footer></Footer>
        </div>
      </div>
    );
  }
}
