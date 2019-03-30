import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";
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

const initialState = {
  dropFile: undefined,
  dropFileName: undefined,
  dropActive: false,
  isUploading: false,
  upLoadStatusText: undefined,
  upLoadStatus: null,
  upLoadReturnDataID: null
};

export default class DropZone extends Component {
  state = { ...initialState };

  onSend = async () => {
    // is uploading indicator
    this.setState({ isUploading: true });
    console.log("send func");
    // file from state
    const { dropFile } = this.state;
    // sending file to api
    try {
      const response = await axios({
        method: "post",
        url: "https://fhirtest.uhn.ca/baseDstu3/Binary",
        data: dropFile
      });
      //update state on return
      console.log(response);
      this.setState({
        upLoadStatus: response.status,
        upLoadStatusText: response.statusText,
        upLoadReturnDataID: response.data.id,
        dropActive: false,
        isUploading: false
      });
    } catch (error) {
      console.log(error);
    }
  };

  onDrop = acceptedFiles => {
    console.log(acceptedFiles);
    this.setState({
      dropFile: acceptedFiles,
      dropFileName: acceptedFiles[0].name,
      dropActive: true
    });
  };

  render() {
    const { dropActive, dropFileName, upLoadStatus, isUploading } = this.state;
    return (
      <div>
        <h2 style={{ color: "#057550" }}>
          You can upload here a report. Please be award that your report is
          shared with practitioners.
        </h2>
        <Dropzone onDrop={this.onDrop}>
          {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
            <DropContainer {...getRootProps()}>
              {!dropActive && !upLoadStatus && (
                <div>
                  <div>
                    <i
                      className="far fa-plus-square fa-3x"
                      style={{ color: "#057550" }}
                    />
                  </div>
                  <div>
                    <input {...getInputProps()} />
                  </div>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "1.5rem"
                    }}
                  >
                    {!isDragActive && "Click here or drop a file."}
                    {isDragActive && !isDragReject && "Drop it to select!"}
                    {isDragReject &&
                      "This file type is not accepted! Try with .pdf"}
                  </div>
                  <div>
                    <a className="button is-link" style={{ width: "90%" }}>
                      Select file to upload
                    </a>
                  </div>
                </div>
              )}
              {dropActive && !upLoadStatus && !isUploading && (
                <div>
                  <div>
                    Your file <strong>{dropFileName}</strong> is ready to be
                    uploaded
                  </div>
                  <div>
                    <a
                      className="button is-success"
                      style={{
                        width: "90%",
                        marginTop: "1em",
                        marginBottom: "1em"
                      }}
                      onClick={this.onSend}
                    >
                      Upload
                    </a>
                    <a
                      className="button is-danger"
                      style={{ width: "90%" }}
                      onClick={() =>
                        this.setState({
                          ...initialState
                        })
                      }
                    >
                      Cancel
                    </a>
                  </div>
                </div>
              )}

              {isUploading && (
                <progress className="progress is-medium is-primary" max="100">
                  45%
                </progress>
              )}

              {upLoadStatus === 201 && (
                <div className="notification is-success">
                  <button
                    className="delete"
                    onClick={() => this.setState({ ...initialState })}
                  />
                  Your file <strong>{dropFileName}</strong> have been uploaded!
                </div>
              )}
            </DropContainer>
          )}
        </Dropzone>
        <div className="result" />
      </div>
    );
  }
}
