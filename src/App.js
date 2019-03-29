import React, { Component } from "react";
import "./App.css";
import DropZone from "./Components/Dropzone";

import "bulma/css/bulma.css";

class App extends Component {
  onDrop = acceptedFiles => {
    console.log(acceptedFiles);
  };

  render() {
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
          <DropZone />
        </div>
      </div>
    );
  }
}

export default App;
