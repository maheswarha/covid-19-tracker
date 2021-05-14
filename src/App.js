import {
  FormControl,
  MenuItem,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import InfoBox from "./components/infoBox/InfoBox";
import Map from "./components/map/Map";
import Table from "./components/table/Table";
import LineGraph from "./components/lineGraph/LineGraph";
import "./App.css";
import "leaflet/dist/leaflet.css";
import {
  capitalizeFirstLetter,
  prettyPrintStat,
  sortData,
} from "./common/utils";

function App() {
  // STATE -> Used to write a variable in REACT
  const [dropdownCountries, setDropdownCountries] = useState([]);
  const [country, setCountry] = useState("ww");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [mapCenter, setMapCenter] = useState([34.80746, -40.4796]);
  const [mapZoom, setMapZoom] = useState(3);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  // USEEFFECT = Runs a piece of code based on a given condition
  useEffect(() => {
    // Code inside here will run once when the component loads and not again.
    // When there is a variable inside the array, then it reloads whenever there is a change in the variable too.

    // async -> send a request, wait for it, do something

    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, // United States, India
            value: country.countryInfo.iso2, // US, IND
          }));

          const sortedData = sortData(data);

          setDropdownCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url =
      countryCode === "ww"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);

        if (countryCode === "ww") {
          setMapCenter([34.80746, -15.4796]);
          setMapZoom(1.5);
        } else {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(4);
        }
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          {/* Header */}
          <h1>COVID-19 TRACKER</h1>

          {/* Title + Select input dropdown field */}
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="ww">Worldwide</MenuItem>
              {dropdownCountries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* InfoBoxes */}
        <div className="app__stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />
          <InfoBox
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBox
            isGrey
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>

        {/* Map */}
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Lives Cases By Country</h3>
          {/* Table */}
          <Table countries={tableData} />

          <h3 className="app__lineGraphTitle">
            Worldwide New {capitalizeFirstLetter(casesType)}
          </h3>
          {/* Graph */}
          <LineGraph className="app__lineGraph" casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
