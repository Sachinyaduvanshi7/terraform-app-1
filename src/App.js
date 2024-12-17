import React, { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [keyword, setKeyword] = useState("");
  const [appEndpoint, setAppEndpoint] = useState("");
  const [dbEndpoint, setDbEndpoint] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAppEndpoint("");
    setDbEndpoint("");
    setDataError("");
    setSuccessMessage("");

    try {
      // Step 1: Trigger infrastructure creation
      console.log("Creating infrastructure...");
      const infraResponse = await axios.post(
        "http://localhost:5000/api/infra",
        {
          keyword: keyword,
        }
      );

      const { appEndpoint: appEp, dbEndpoint: dbEp } = infraResponse.data;
      setAppEndpoint(appEp); // Set app endpoint
      setDbEndpoint(dbEp); // Set database endpoint

      console.log("Infrastructure created successfully:", infraResponse.data);

      // Step 2: Trigger data load
      console.log("Loading data...");
      setDataLoading(true);
      const dataResponse = await axios.post("http://localhost:5000/load-data", {
        keyword: keyword,
        appEndpoint: appEp,
        dbEndpoint: dbEp,
      });

      console.log("Data loaded successfully:", dataResponse.data);
      setSuccessMessage("Infrastructure and data loaded successfully!");
    } catch (err) {
      console.error("Error:", err);
      setError(
        "Failed to create infrastructure or load data. Please try again."
      );
    } finally {
      setLoading(false);
      setDataLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Infrastructure and Data Loader</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter a keyword"
            value={keyword}
            onChange={handleInputChange}
            required
          />
          <button type="submit" disabled={loading || dataLoading}>
            {loading || dataLoading ? "Processing..." : "Submit"}
          </button>
        </form>

        {appEndpoint && (
          <div>
            <h3>App Endpoint:</h3>
            <a href={appEndpoint} target="_blank" rel="noopener noreferrer">
              {appEndpoint}
            </a>
          </div>
        )}

        {dbEndpoint && (
          <div>
            <h3>Database Endpoint:</h3>
            <p>{dbEndpoint}</p>
          </div>
        )}

        {dataLoading && <p>Loading data into the application...</p>}

        {error && <p className="error">{error}</p>}
        {dataError && <p className="error">{dataError}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
      </header>
    </div>
  );
}

export default App;
