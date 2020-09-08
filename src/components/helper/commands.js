import React, { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import * as actions from "../../actions/actions";
import { exec, spawn } from "child_process";

import parseContainerFormat from "./parseContainerFormat";

// const dispatch = useDispatch();
// const addRunningContainers = (data) => dispatch(actions.addRunningContainers(data));
// const removeContainer = (id) => dispatch(actions.removeContainer(id));
// const stopRunningContainer = (id) => dispatch(actions.stopRunningContainer(id));
// const addStoppedContainers = (data) => dispatch(actions.addStoppedContainers(data));
// const runStoppedContainer = (id) => dispatch(actions.runStoppedContainer(id));
// const addExistingImages = (data) => dispatch(actions.getImages(data))

// on app start-up, get the containers that are already running by calling addRunning
export const addRunning = (runningList, callback) => {
  console.log("runningList", runningList);
  console.log("I am here5");
  exec("docker stats --no-stream", (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }

    let value = parseContainerFormat.convert(stdout);
    let objArray = ["cid", "name", "cpu", "mul", "mp", "net", "block", "pids"];
    let convertedValue = parseContainerFormat.convertArrToObj(value, objArray);
    console.log(convertedValue);
    const newList = [];
    for (let i = 0; i < convertedValue.length; i++) {
      let isInTheList = false;
      for (let container of runningList) {
        if (container.cid === convertedValue[i].cid) {
          isInTheList = true;
        }
      }
      if (!isInTheList) {
        newList.push(convertedValue[i]);
      }
    }
    console.log(newList.length);
    if (newList.length > 0) {
      console.log("I am in callback");
      callback(newList);
      console.log("I am after callback");
    }
  });
};

export const addStopped = (stoppedList, callback) => {
  exec('docker ps -f "status=exited"', (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    let value = parseContainerFormat.convert(stdout);
    //value => array
    const result = [];
    //tempoary we will have it as manual number
    for (let i = 0; i < value.length; i++) {
      let innerArray = [];
      innerArray.push(value[i][0]); // id
      innerArray.push(value[i][1]); // image
      if (!isNaN(parseInt(value[i][3]))) {
        innerArray.push(value[i][3] + " days ago"); // created
      } else {
        innerArray.push(value[i][6] + " days ago");
      }
      result.push(innerArray);
    }
    let objArray = ["cid", "img", "created"];
    let convertedValue = parseContainerFormat.convertArrToObj(result, objArray);

    const newList = [];
    for (let i = 0; i < convertedValue.length; i++) {
      let isInTheList = false;
      for (let container of stoppedList) {
        if (container.cid === convertedValue[i].cid) {
          isInTheList = true;
        }
      }
      if (!isInTheList) {
        newList.push(convertedValue[i]);
      }
    }
    if (newList.length > 0) {
      callback(newList);
      // addStoppedContainers(newList)
    }
  });
};

export const addImages = (imagesList, callback) => {
  exec(`docker images`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    let value = parseContainerFormat.convert(stdout);
    let objArray = ["reps", "tag", "imgid", "size"];
    const resultImages = [];
    for (let i = 0; i < value.length; i++) {
      let innerArray = [];
      if (value[i][0] !== "<none>") {
        innerArray.push(value[i][0]);
        innerArray.push(value[i][1]);
        innerArray.push(value[i][2]);
        innerArray.push(value[i][6]);
        resultImages.push(innerArray);
      }
    }
    let convertedValue = parseContainerFormat.convertArrToObj(
      resultImages,
      objArray
    );
    const newList = [];
    for (let i = 0; i < convertedValue.length; i++) {
      let isInTheList = false;
      for (let container of imagesList) {
        if (container.cid === convertedValue[i].cid) {
          isInTheList = true;
        }
      }
      if (!isInTheList) {
        newList.push(convertedValue[i]);
      }
    }
    if (newList.length > 0) {
      callback(newList);
      // addExistingImages(newList)
    }
  });
};

export const refreshRunning = (runningList, callback) => {
  exec("docker stats --no-stream", (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    let value = parseContainerFormat.convert(stdout);
    let objArray = ["cid", "name", "cpu", "mul", "mp", "net", "block", "pids"];
    let convertedValue = parseContainerFormat.convertArrToObj(value, objArray);
    console.log(convertedValue);
    callback(convertedValue);
  });
};

export const remove = (id, callback) => {
  exec(`docker rm --force ${id}`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    callback(id);
    // removeContainer(id);
  });
};

export const stop = (id, callback) => {
  exec(`docker stop ${id}`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    callback(id);
    // stopRunningContainer(id);
  });
};

export const runStopped = (id, callback) => {
  exec(`docker start ${id}`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    callback(id);
  });
};

export const runIm = (id, runningList, callback_1, callback_2) => {
  console.log("I am here1");
  console.log("id", id);
  console.log("runningList:", runningList);

  exec(`docker run ${id}`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    //callback_1(id)
    console.log("I am here2");
    callback_1(runningList, callback_2);
  });
};

export const removeIm = (id, callback) => {
  exec(`docker rmi -f ${id}`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    callback(id);
  });
};

export const connectContainers = (filepath, callback) => {
  //We still need to get a file path from a user
  let child = spawn(
    `cd ${filepath} && docker-compose up -d && docker network ls`,
    {
      shell: true,
    }
  );
  const array = [];
  child.stderr.on("data", function (data) {
    console.error("STDERR:", data.toString()); //showing the process but comes out as error for some reason

    let letter = data.toString(); // change buffer to string
    letter = letter.match(/(["])(?:(?=(\\?))\2.)*?\1/g); // find only letter in quotation
    if (letter) array.push(letter[0]);
  });
  child.stdout.on("data", function (data) {
    console.log("STDOUT:", data.toString());
  });

  child.on("exit", function (exitCode) {
    console.log("Child exited with code: " + exitCode);
    console.log(typeof exitCode);
    //console.log('Array: ', array);
    if (exitCode !== 0) {
      console.log("There was an error while executing docker-compose");
    } else {
      if (!array.length) {
        console.log("Your docker-compose is already defined");
      } else {
        //Inspect to get the network information
        exec(`docker network inspect ${array[0]}`, (error, stdout, stderr) => {
          if (error) {
            console.log(`error: ${error.message}`);
            return;
          }
          if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
          }

          // parse string to Object
          let parsed = JSON.parse(stdout);
          let containerIds = Object.keys(parsed[0]["Containers"]);

          let resultString = "";
          for (let i = 0; i < containerIds.length; i++) {
            resultString += containerIds[i] + " ";
          }

          // Get stats for each container and display it
          exec(
            `docker stats --no-stream ${resultString}`,
            (error, stdout, stderr) => {
              if (error) {
                console.log(`error: ${error.message}`);
                return;
              }
              if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
              }
              console.log(stdout);
              let value = parseContainerFormat.convert(stdout);
              let objArray = ["cid", "name"];
              let composeValue = parseContainerFormat.convertArrToObj(
                value,
                objArray
              ); //[{cid: xxxx, name: container1}, {cid:xxxx, name: container2}];
              let savedArr = [];
              let ymlObj = {};
              ymlObj[array[0]] = [];
              ymlObj[array[0]].push(composeValue);
              console.log("this is ymlobj", ymlObj);

              //{parentName: [{cid: 21312, name: sdfew}]}

              savedArr.push(ymlObj);
              console.log("this is saved arr", savedArr);
              callback(savedArr);

              //parentName => array[0]
              //         state = [
              //         {parentName: [{cid: 123213, name: xxxx}, {cid:1564654, name: yyyyyy}]},
              //         {anotherParent: [{}]}
              //         ];
            }
          );
        });
      }
    }
  });
};

// export const showGeneralMetrics = () => {
// 	// docker stats --no-stream

// 	let convertedValue = parseContainerFormat.convertArrToObj(value, objArray);

// 	return parseContainerFormat(convertedValue)

// }