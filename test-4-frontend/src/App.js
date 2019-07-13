import React from "react";
import CSVReader from "react-csv-reader";
import { Bar } from "react-chartjs-2";
import "./App.css";

class App extends React.Component {
  state = {
    values: [],
    genderData: []
  };

  parseCSV = data => {
    // create the empty array
    const { values } = this.state;
    const newValues = [];
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
        newValues.push(object);
      }
    });
    // If the array on the state is empty, set the state to the array within this function.
    if (this.state.values.length === 0) {
      this.setState({
        values: newValues
      });
    } else {
      // If the array is filled, checked to see by a unique value if this CSV has already been imported.
      const index = values.findIndex(
        v => v.ip_address === newValues[0].ip_address
      );
      // If it hasn't, push the CSV into the existing array.
      if (index === -1) {
        const finalValues = values.concat(newValues);
        this.setState({
          values: finalValues
        });
      }
    }
    // Mutate the data into usable information.
    const genderData = this.state.genderData;

    this.state.values.forEach(value => {
      const make = value.Car_Make;
      const gender = value.Gender.toLowerCase();
      const index = genderData.findIndex(v => v.make === make);
      if (index === -1) {
        const newData = {
          make,
          [gender]: 1
        };
        {
          gender === "male" ? (newData.female = 0) : (newData.male = 1);
        }
        genderData.push(newData);
      } else {
        {
          gender === "male"
            ? (genderData[index].male = genderData[index].male + 1)
            : (genderData[index].female = genderData[index].female + 1);
        }
      }
    });
    this.setState({
      genderData
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
        {this.state.values.length > 0 ? <Bar data={this.state.values} /> : null}
      </div>
    );
  }
}

export default App;
