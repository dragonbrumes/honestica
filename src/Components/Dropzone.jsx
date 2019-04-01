import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";
import Dropzone from "react-dropzone";

import "bulma/css/bulma.css";

const getColor = props => {
  if (props.isDragAccept) {
    return "#00e676";
  }
  if (props.isDragReject) {
    return "#ff1744";
  }
  if (props.isDragActive) {
    return "#6c6";
  }
  return "#666";
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin: 1em auto;
`;

const DropContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 90%;
  height: 200px;
  margin: 1em auto;
  border-width: 2px;
  border-style: ${props => (props.isDragActive ? "solid" : "dashed")};
  border-color: ${props => getColor(props)};
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

  componentDidMount = () => {
    axios
      .get("https://fhirtest.uhn.ca/baseDstu3/Binary?_summary=count")
      .then(resp => {
        this.setState({ binaryTotal: resp.data.total });
      });
  };

  // send upload & fetch total of binaries  files
  onSend = async () => {
    // is uploading indicator
    this.setState({ isUploading: true });

    // file from state
    const { dropFile } = this.state;
    // sending file to api
    try {
      await axios({
        method: "post",
        url: "https://fhirtest.uhn.ca/baseDstu3/Binary",
        data: dropFile
      }).then(response => {
        //update state on return
        // console.log("resp1:", response);
        this.setState({
          upLoadStatus: response.status,
          upLoadStatusText: response.statusText,
          upLoadReturnDataID: response.data.id,
          dropActive: false,
          isUploading: false
        });

        axios
          .get("https://fhirtest.uhn.ca/baseDstu3/Binary?_summary=count")
          .then(resp => {
            // console.log("resp2:", resp);
            this.setState({ binaryTotal: resp.data.total });
          });
      });
    } catch (error) {
      this.setState({ error });
      console.log(error);
    }
  };

  onDrop = acceptedFiles => {
    if (acceptedFiles.length > 0) {
      // console.log(acceptedFiles);
      this.setState({
        dropFile: acceptedFiles,
        dropFileName: acceptedFiles[0].name,
        dropActive: true
      });
    }
  };

  render() {
    const maxSize = 2097152;
    const {
      dropActive,
      dropFileName,
      upLoadStatus,
      isUploading,
      binaryTotal,
      upLoadReturnDataID
    } = this.state;

    return (
      <Wrapper>
        <h2 style={{ color: "#057550" }}>
          You can upload here a report. Please be award that your report is
          shared with practitioners.
        </h2>
        <Dropzone
          onDrop={this.onDrop}
          accept="application/pdf"
          maxSize={maxSize}
        >
          {({
            getRootProps,
            getInputProps,
            isDragActive,
            isDragAccept,
            isDragReject,
            rejectedFiles
          }) => {
            const isFileTooLarge =
              rejectedFiles.length > 0 && rejectedFiles[0].size > maxSize;

            return (
              <DropContainer
                {...getRootProps({
                  isDragActive,
                  isDragAccept,
                  isDragReject
                })}
              >
                {/* Reactive Drop zone */}
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
                      {isDragReject && (
                        <div className="has-text-danger">
                          This file type is not accepted! Try with .pdf!
                        </div>
                      )}
                      {isFileTooLarge && (
                        <div className="has-text-danger">
                          File is too large. No more than 2MO!
                        </div>
                      )}
                    </div>
                    <div>
                      {/* eslint-disable-next-line */}
                      <a className="button is-link" style={{ width: "250px" }}>
                        Select file to upload
                      </a>
                    </div>
                  </div>
                )}
                {/* Drop zone with element on standby */}
                {dropActive && !upLoadStatus && !isUploading && (
                  <div>
                    <div>
                      Your file <strong>{dropFileName}</strong> is ready to be
                      uploaded
                    </div>
                    <div>
                      {/* eslint-disable-next-line */}
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
                      {/* eslint-disable-next-line */}
                      <a
                        className="button is-danger"
                        style={{ width: "90%" }}
                        onClick={() =>
                          this.setState({
                            ...initialState,
                            binaryTotal
                          })
                        }
                      >
                        Cancel
                      </a>
                    </div>
                  </div>
                )}
                {/* loader during file upload */}
                {isUploading && (
                  <progress className="progress is-medium is-primary" max="100">
                    45%
                  </progress>
                )}
                {/* uploading attempt file result */}
                {upLoadStatus === 201 && (
                  <div className="notification is-success">
                    <button
                      className="delete"
                      onClick={() => this.setState({ ...initialState })}
                    />
                    Your file <strong>{dropFileName}</strong> with id
                    <strong>{upLoadReturnDataID}</strong> have been uploaded!
                  </div>
                )}
              </DropContainer>
            );
          }}
        </Dropzone>
        <div
          className="tags has-addons"
          style={{ marginRight: "1em", marginLeft: "2em" }}
        >
          <span className="tag is-dark">Total files</span>
          <span
            className="tag"
            style={{ backgroundColor: "#057550", color: "white" }}
          >
            {binaryTotal}
          </span>
        </div>
      </Wrapper>
    );
  }
}
