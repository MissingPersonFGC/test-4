import React from "react";
import CSVReader from "react-csv-reader";
import logo from "./logo.svg";
import "./App.css";

class App extends React.Component {
  state = {
    values: []
  };

  parseCSV = data => {
    // create the empty array
    const values = [];
    console.log(data);
    // map through the csv arrays
    data.map((value, index) => {
      // we know that the first row is always the table header, so skip it.
      if (index > 0) {
        // now we are going to create an object that goes off of each index of index 0 of the array as the key, and use the same index of the current item as the value.
        let object = {};
        for (let i = 0; i < value.length; i++) {
          object[data[0][i]] = value[i];
        }
        // Push the new object into the array
        values.push(object);
      }
    });
    // Put the new array on the state.
    this.setState({
      values
    });
  };

  render() {
    return (
      <div className="App">
        <CSVReader
          label="Upload CSV file."
          onFileLoaded={this.parseCSV}
          onError={this.handleError}
        />
      </div>
    );
  }
}

export default App;
