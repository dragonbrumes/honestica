import React, { Component } from "react";
import styled from "styled-components";

import Dropzone from "react-dropzone";

import "bulma/css/bulma.css";

const DropContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 90%;
  height: 200px;
  margin: 1em auto;
  border: 1px dashed black;

  &-button {
  }
`;

export default class DropZone extends Component {
  onDrop = acceptedFiles => {
    console.log(acceptedFiles);
  };
  render() {
    return (
      <div>
        <h2 style={{ color: "#057550" }}>
          You can upload here a report. Please be award that only PDF is
          accepted.
        </h2>
        <Dropzone onDrop={this.onDrop}>
          {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
            <DropContainer {...getRootProps()}>
              <div>
                <div>
                  <i
                    className="far fa-plus-square fa-3x"
                    style={{ color: "#057550" }}
                  />
                </div>
                <input {...getInputProps()} />
                <div style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
                  {!isDragActive && "Click here or drop a file to upload!"}
                  {isDragActive && !isDragReject && "Drop it to upload!"}
                  {isDragReject &&
                    "This file type is not accepted! Try with .pdf"}
                </div>
              </div>
              <a className="button is-link" style={{ width: "90%" }}>
                Select file to upload
              </a>
            </DropContainer>
          )}
        </Dropzone>
      </div>
    );
  }
}
