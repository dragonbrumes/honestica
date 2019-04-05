import React, { Component } from "react";
import "./App.css";
import DropZone from "./Components/Dropzone";

import "bulma/css/bulma.css";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

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
