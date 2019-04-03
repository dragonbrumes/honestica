import React, { Component } from "react";
import "./App.css";
import DropZone from "./Components/Dropzone";

import "bulma/css/bulma.css";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

// test****************************

// console.log(ipcRenderer.sendSync("synchronous-message", "ping")); // affiche "pong"

// ipcRenderer.on("asynchronous-reply", (event, arg) => {
//   console.log(arg); // affiche "pong"
// });
// ipcRenderer.send("asynchronous-message", "ping");
// let newFile = "";
// ipcRenderer.on("send-data", (event, file) => {
//   // console.log(arg); // affiche "pong"
//   // console.log("ipcRenderer");
//   newFile = file;
//   console.log(newFile);
// });

// /test

class App extends Component {
  state = {
    file: undefined,
    name: undefined
  };

  render() {
    // Electron listener
    ipcRenderer.on("send-data", (event, data) => {
      const { file, name } = data;
      this.setState({ file, name });
    });

    return (
      <div className="App">
        <header className="App-header">
          <section className="hero">
            <div className="hero-body">
              <div className="container">
                <h1 className="title has-text-white">Medi Report</h1>
              </div>
            </div>
          </section>
        </header>
        <div className="App-drop">
          <DropZone file={this.state.file} name={this.state.name} />
        </div>
      </div>
    );
  }
}

export default App;
