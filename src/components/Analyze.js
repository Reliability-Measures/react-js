import React , {useState} from "react"
import './components.css'
import csv from "csv";
import Dropzone from 'react-dropzone'
import { get_config, fnExcelReport,
    convertToArrayOfObjects, saveJSON} from './config'

import {process} from './file_process'

export default function Analyze() {
  const [fileNames, setFileNames] = useState([]);
  
    const handleSampleServer = e =>{
      e.preventDefault();      
      process(null, "results")
  }    

      const handleExport = e =>{
        saveJSON("jsonStr", "downloadJSON")
      }
      const handleExportResult = e =>{
        saveJSON("resultStr", "downloadResult")
      }
      const handleExportCSV = e =>{
        fnExcelReport("output", "result")
      }

      // Csv upload
      const handleDropC = acceptedFiles =>{
        document.getElementById("btn1").style.display = "none";
        document.getElementById("btn2").style.display = "none";
        document.getElementById("btn3").style.display = "none";
        setFileNames(acceptedFiles.map(file => file.name))
        const reader = new FileReader();
        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading failed");
        reader.onload = () => {
          csv.parse(reader.result, (err, data) => {
            let jsonStr = null;
            if (err) {
                //alert("File not in CSV format");
                // try JSON format
                try {
                  jsonStr = JSON.parse(reader.result);
                }
                catch(err) {
                  alert('The file is not in a valid CSV or JSON format!');
                }
            } else {
                console.log("Parsed CSV data: ", data)
                let obj = convertToArrayOfObjects(data)
                console.log(obj)
                for (let i = 0; i < obj.length; i++) {
                    let item = obj[i]
                    let keys = Object.keys(item)
                    let items = []
                    keys.forEach(function get_key(key) {
                        //console.log(key, parseInt(key))
                        if (!(isNaN(parseInt(key)))) {
                            items.push({
                                item_id: parseInt(key),
                                response: parseInt(item[key])
                            })
                            delete item[key]
                        }
                    })
                    item["item_responses"] = items
                }
                console.log(obj)
                console.log(acceptedFiles[0].name)
                jsonStr = {
                    student_list: obj,
                    exam: {name: acceptedFiles[0].name.split(".")[0]}
                }
               
            }
            if (jsonStr) {
                process(jsonStr, "results")
                
            }
        })
        }
        acceptedFiles.forEach(file => reader.readAsBinaryString(file))
      }
      
  return (
    <React.Fragment>
     <div className="row">

        <div className="card text-center col-md-7">
            <div className="card-header bg-info text-white h2">
                {get_config('application_form')} (v {get_config('application_version')})
            </div>
            <div className="card-body">
              <h5 className="card-title">Analyze your Teacher-Made tests</h5>
              <p className="card-text">Provide you with reliability indicators to help you determine your tests’ capabilities for assessing your students.</p>
              <p className="card-text">Sample exam <span onClick={handleSampleServer}><a href=" ">Use this data</a></span></p>
                <p className="card-text">Please upload exam scores in CSV or JSON format.<br></br>
                  You can download Sample files here: <a target="_blank" href="data/20 Students.csv">CSV</a> <a target="_blank" href="data/20 Students.json">JSON</a>
              </p>
              <Dropzone className="card-text" onDrop={handleDropC}
              accept=".csv,.txt,.json"
              >
                {({ getRootProps, getInputProps }) => (
                <div {...getRootProps({ className: "dropzone" })}>
                  <input {...getInputProps()} />
                  <p>Drag'n'drop a CSV or JSON file, or click to select a file</p>
                  <div>
                <ul className="ba">
                  {fileNames.map(fileName => (
                    <li key={fileName}>{fileName}</li>
                  ))}
                </ul>
              </div>
                </div>
                )}
              </Dropzone>  
              <div id="input">
               
              </div>
               <div className="text-center col-md-12">
                <a id="downloadJSON" href=" " style={{display: 'none'}}> </a>
                <input type="button" id="btn1" style={{display: 'none'}}
                       className="btn btn-sm btn-warning" value="Save Input JSON"
                       title="Download"
                       onClick= {handleExport} />
                </div> 
                      

    </div>
    </div>
    <div className="card col-md-5">
    <div className="card-header bg-info text-white h2">
                Results
            </div>  
            <div className="card-body">          
        <div className="text-center">
            <button type="button" className="btn btn-danger btn-lg"
                    style={{display: 'none'}}
                    variant="contained">
            Compute 
            </button>
        </div>

     <div className="text-center"> <br></br>
          <ul className="nav nav-tabs">
          <li className="nav-item">
            <a className="nav-link active" data-toggle="tab" href="#results">Results</a>
          </li>
          <li className="nav-item" id="updated_results_tab" style={{display: 'none'}}>
            <a className="nav-link" data-toggle="tab" href="#updated_results">Updated results</a>
          </li>
        </ul>
        <div className="tab-content"><br></br>
        <div id="results" className="container tab-pane active"></div>
        <div id="updated_results" className="container tab-pane fade"></div>
        </div>

         <span id="jsonStr" style={{display: 'none'}}></span>
         <span id="resultStr" style={{display: 'none'}}></span>
         <div className="row">
                <div className="col">
                <a id="downloadResult" href=" " style={{display: 'none'}}> </a>
                <button  id="btn2" style={{display: 'none'}}
                       className="btn btn-md btn-success" value="Save Result JSON"
                       title="Download JSON"
                       onClick= {handleExportResult}>Export JSON  <i className="fas fa-file-download"></i></button>
                </div>
                <div className="col">
                <button id="btn3" style={{display: 'none'}}
                       className="btn btn-md btn-success" value="Save Excel"
                       title="Download Excel"
                       onClick= {handleExportCSV}>Export Excel <i className="fas fa-file-excel"></i></button>
                </div>
         </div>

        {/* <h5 id="jsoninput"> </h5> */}

        </div>
     </div>    
    </div>
    </div>
 
    </React.Fragment>
    
  );
}
