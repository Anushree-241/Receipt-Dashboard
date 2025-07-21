// src/pages/Dashboard.js
import React from "react";
import UploadForm from "../components/UploadForm";
import ReceiptTable from "../components/ReceiptTable";
import StatsPanel from "../components/StatsPanel";

export default function Dashboard() {
  return (
    <div className="container-fluid mt-3">
      <div className="row">
        <div className="col-md-12">
          <div id="stats">
            <h1 className="text-center">Visual & Statistical Insights</h1>
            <StatsPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
