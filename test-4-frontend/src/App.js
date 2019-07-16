import React from "react";
import CSVReader from "react-csv-reader";
import { RadialChart, DiscreteColorLegend } from "react-vis";
import "./App.css";
import colours from "./colours";

class App extends React.Component {
  state = {
    values: [],
    genderData: [],
    totalMaleCars: 0,
    totalFemaleCars: 0,
    legend: []
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

    let totalFemaleCars = 0;
    let totalMaleCars = 0;
    const makes = [];
    const legend = this.state.legend;

    this.state.values.forEach(value => {
      const make = value.Car_Make;
      const gender = value.Gender.toLowerCase();
      const index = genderData.findIndex(v => v.make === make);
      if (index === -1) {
        const newData = {
          make,
          [gender]: 1
        };
        makes.push(make);
        gender === "male" ? (newData.female = 0) : (newData.male = 1);
        genderData.push(newData);
      } else {
        if (gender === "male") {
          genderData[index].male = genderData[index].male + 1;
          totalMaleCars = totalMaleCars + 1;
        } else {
          genderData[index].female = genderData[index].female + 1;
          totalFemaleCars = totalFemaleCars + 1;
        }
      }
    });

    this.setState({
      genderData,
      totalFemaleCars,
      totalMaleCars
    });

    // Create a colour legend for the chart
    colours.forEach((colour, index) => {
      console.log(colour);
      const item = {
        color: colour,
        title: makes[index]
      };
      legend.push(item);
    });
    const indeces = [];
    legend.forEach((item, index) => {
      if (item.title === undefined) {
        indeces.push(index);
      }
    });
    legend.splice(indeces[0], indeces.length);
    console.log(legend);
    console.log(this.state.genderData);
    this.setState({
      legend
    });
  };

  render() {
    const chartDataFemale = [];
    const chartDataMale = [];

    this.state.genderData.forEach((make, index) => {
      const femaleData = {
        angle: (make.female / this.state.totalFemaleCars) * 360,
        label: make.make,
        color: colours[index]
      };
      const maleData = {
        angle: (make.male / this.state.totalMaleCars) * 360,
        label: make.make,
        color: colours[index]
      };
      chartDataFemale.push(femaleData);
      chartDataMale.push(maleData);
    });
    return (
      <div className="App">
        <CSVReader
          label="Upload CSV file."
          onFileLoaded={this.parseCSV}
          onError={this.handleError}
        />
        {this.state.genderData.length > 0 ? (
          <>
            <h2>Car Ownership by Gender</h2>
            <RadialChart
              data={[
                {
                  angle:
                    (this.state.totalMaleCars /
                      (this.state.totalMaleCars + this.state.totalFemaleCars)) *
                    360,
                  label: "Male",
                  color: "blue"
                },
                {
                  angle:
                    (this.state.totalFemaleCars /
                      (this.state.totalMaleCars + this.state.totalFemaleCars)) *
                    360,
                  label: "Female",
                  color: "pink"
                }
              ]}
              width={1280}
              height={960}
              showLabels
              labelsOverChildren
              colorType="literal"
            />

            <h2>Female Car Ownership by Make</h2>
            <DiscreteColorLegend
              items={this.state.legend}
              orientation="horizontal"
            />
            <RadialChart
              data={chartDataFemale}
              width={1280}
              height={960}
              colorType="literal"
            />

            <h2>Male Car Ownership by Make</h2>
            <DiscreteColorLegend
              items={this.state.legend}
              orientation="horizontal"
            />
            <RadialChart
              data={chartDataMale}
              width={1280}
              height={960}
              colorType="literal"
            />
          </>
        ) : null}
      </div>
    );
  }
}

export default App;
