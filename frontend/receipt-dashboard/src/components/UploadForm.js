import React, { useState } from 'react';
import axios from 'axios';

function UploadForm() {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    if (category) formData.append('category', category);

    try {
      await axios.post('http://localhost:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('Upload successful!');
    } catch (error) {
      console.error(error);
      setMessage('Upload failed.');
    }
  };

  return (
    <div className="container">
      <h2>Upload Receipt</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="row align-items-end g-2">
          <div className="col-md-6">
            <label htmlFor="file" className="form-label">Choose File</label>
            <input
              type="file"
              className="form-control"
              id="file"
              accept=".pdf,.jpg,.jpeg,.png,.txt"
              onChange={handleFileChange}
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="category" className="form-label">Optional Category</label>
            <input
              type="text"
              className="form-control"
              id="category"
              placeholder="e.g. Travel, Food, Misc"
              value={category}
              onChange={handleCategoryChange}
            />
          </div>
          <div className="col-md-2 d-grid">
            <button type="submit" className="btn btn-primary">Upload</button>
          </div>
        </div>

        {message && (
          <div className={`alert mt-3 ${message.includes('successful') ? 'alert-success' : 'alert-danger'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

export default UploadForm;
