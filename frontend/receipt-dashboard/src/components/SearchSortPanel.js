// src/components/SearchSortPanel.js
import React, { useState } from 'react';
import axios from 'axios';

export default function SearchSortPanel() {
  const [field, setField] = useState('vendor');
  const [keyword, setKeyword] = useState('');
  const [minVal, setMinVal] = useState('');
  const [maxVal, setMaxVal] = useState('');
  const [pattern, setPattern] = useState('');
  const [results, setResults] = useState([]);
  const [sortField, setSortField] = useState('');
  const [reverse, setReverse] = useState(false);

  const handleSearch = async () => {
    try {
      const params = { field };
      if (keyword) params.keyword = keyword;
      if (minVal && maxVal) {
        params.min_val = minVal;
        params.max_val = maxVal;
      }
      if (pattern) params.pattern = pattern;

      const res = await axios.get('http://localhost:8000/algosearch', { params });
      setResults(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSort = async () => {
    try {
      const res = await axios.get('http://localhost:8000/algosort', {
        params: { field: sortField, reverse }
      });
      setResults(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card p-4 mb-4">
      <h5>🔍 Advanced Search & Sort</h5>

      <div className="row">
        <div className="col-md-2">
          <label>Field</label>
          <select className="form-control" value={field} onChange={e => setField(e.target.value)}>
            <option value="vendor">Vendor</option>
            <option value="amount">Amount</option>
            <option value="category">Category</option>
            <option value="date">Date</option>
          </select>
        </div>

        <div className="col-md-2">
          <label>Keyword</label>
          <input type="text" className="form-control" value={keyword} onChange={e => setKeyword(e.target.value)} />
        </div>

        <div className="col-md-2">
          <label>Min</label>
          <input type="number" className="form-control" value={minVal} onChange={e => setMinVal(e.target.value)} />
        </div>

        <div className="col-md-2">
          <label>Max</label>
          <input type="number" className="form-control" value={maxVal} onChange={e => setMaxVal(e.target.value)} />
        </div>

        <div className="col-md-2">
          <label>Pattern</label>
          <input type="text" className="form-control" value={pattern} onChange={e => setPattern(e.target.value)} />
        </div>

        <div className="col-md-2 d-flex align-items-end">
          <button onClick={handleSearch} className="btn btn-primary w-100">Search</button>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-3">
          <label>Sort Field</label>
          <input type="text" className="form-control" value={sortField} onChange={e => setSortField(e.target.value)} />
        </div>
        <div className="col-md-3">
          <label>Order</label>
          <select className="form-control" value={reverse} onChange={e => setReverse(e.target.value === "true")}>
            <option value="false">Ascending</option>
            <option value="true">Descending</option>
          </select>
        </div>
        <div className="col-md-2 d-flex align-items-end">
          <button onClick={handleSort} className="btn btn-secondary w-100">Sort</button>
        </div>
      </div>

      <div className="table-responsive mt-4">
        <table className="table table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              <th>Vendor</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, idx) => (
              <tr key={idx}>
                <td>{r.vendor}</td>
                <td>{r.amount}</td>
                <td>{r.date}</td>
                <td>{r.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
