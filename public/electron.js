const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const { ipcMain } = require("electron");
var watch = require("node-watch");

const fs = require("fs");
const path = require("path");
const url = require("url");
const isDev = require("electron-is-dev");

// spy the dir for new file
watch("FHIR", { filter: /\.pdf$/ }, function(evt, name) {

  // if new file send it to the front
  if (evt === "update") {
    // on create or modify
    fs.readFile(name, function read(err, data) {
      if (err) {
        console.log(err);
        throw err;
      }
      let content = data;

    });

  
  } 
});


let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: { nodeIntegration: true },
    backgroundColor: "#057550",
    icon: path.join(__dirname, "icon/icon.png")
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  isDev ? mainWindow.toggleDevTools() : "";
  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);

// Directory watching and update
app.on("ready", () => {
  //directory watcher
  watch("FHIR", { filter: /\.pdf$/ }, function(evt, name) {
    // console.log("the name is :", name);

    // if a new file is detected
    if (evt === "update") {
      // Read the file and send it to front
      fs.readFile(name, function read(err, data) {
        if (err) {
          console.log(err);
          throw err;
        }
        let content = data;
        // console.log("watch send");
        mainWindow.webContents.send("send-data", { file: content, name: name });
      });
    } // if
  }); // watch
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
