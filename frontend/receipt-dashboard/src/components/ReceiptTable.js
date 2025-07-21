import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ReceiptTable() {
  const [receipts, setReceipts] = useState([]);

  // SEARCH FIELDS
  const [searchField, setSearchField] = useState('vendor');
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [pattern, setPattern] = useState('');

  // SORT FIELDS
  const [sortField, setSortField] = useState('');
  const [reverse, setReverse] = useState(false);

  const fetchReceipts = async () => {
    try {
      const baseURL = 'http://localhost:8000';

      // Decide search endpoint
      const useAdvancedSearch = keyword || (minAmount && maxAmount) || pattern;
      if (useAdvancedSearch) {
        const params = { field: searchField };
        if (keyword) params.keyword = keyword;
        if (pattern) params.pattern = pattern;
        if (minAmount && maxAmount) {
          params.min_val = minAmount;
          params.max_val = maxAmount;
        }
        const response = await axios.get(`${baseURL}/algosearch`, { params });
        setReceipts(response.data);
      } else {
        const params = {};
        if (category) params.category = category;
        if (minAmount) params.min_amount = minAmount;
        if (maxAmount) params.max_amount = maxAmount;
        const response = await axios.get(`${baseURL}/search`, { params });
        setReceipts(response.data);
      }
    } catch (err) {
      console.error('Error fetching receipts:', err);
    }
  };

  const handleSort = async () => {
    try {
      const response = await axios.get('http://localhost:8000/algosort', {
        params: { field: sortField, reverse }
      });
      setReceipts(response.data);
    } catch (err) {
      console.error('Error sorting receipts:', err);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchReceipts();
  };

  const handleClear = () => {
    setSearchField('vendor');
    setKeyword('');
    setCategory('');
    setMinAmount('');
    setMaxAmount('');
    setPattern('');
    setSortField('');
    setReverse(false);
    fetchReceipts();
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">📄 Receipts</h2>

      {/* Search + Sort Form */}
      <form className="row gy-2 gx-3 align-items-center mb-4" onSubmit={handleSearch}>
        <div className="col-md-2">
          <select className="form-select" value={searchField} onChange={e => setSearchField(e.target.value)}>
            <option value="vendor">Vendor</option>
            <option value="category">Category</option>
            <option value="amount">Amount</option>
            <option value="date">Date</option>
          </select>
        </div>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            placeholder="Keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            placeholder="Regex Pattern"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="Min ₹"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="Max ₹"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
          />
        </div>
        <div className="col-md-1 d-grid">
          <button className="btn btn-primary" type="submit">Search</button>
        </div>
        <div className="col-md-1 d-grid">
          <button className="btn btn-secondary" type="button" onClick={handleClear}>Clear</button>
        </div>
      </form>

      {/* Sort Controls */}
      <div className="row mb-3">
        <div className="col-md-3">
          <select className="form-select" value={sortField} onChange={e => setSortField(e.target.value)}>
            <option value="">-- Sort Field --</option>
            <option value="vendor">Vendor</option>
            <option value="amount">Amount</option>
            <option value="date">Date</option>
            <option value="category">Category</option>
          </select>
        </div>
        <div className="col-md-2">
          <select className="form-select" value={reverse} onChange={e => setReverse(e.target.value === 'true')}>
            <option value="false">Asc</option>
            <option value="true">Desc</option>
          </select>
        </div>
        <div className="col-md-2 d-grid">
          <button className="btn btn-info" onClick={handleSort}>Sort</button>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Vendor</th>
              <th>Date</th>
              <th>Amount (₹)</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {receipts.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">No receipts found.</td>
              </tr>
            ) : (
              receipts.map((receipt) => (
                <tr key={receipt.id}>
                  <td>{receipt.id}</td>
                  <td>{receipt.vendor}</td>
                  <td>{receipt.date}</td>
                  <td>₹{receipt.amount}</td>
                  <td>{receipt.category}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReceiptTable;
