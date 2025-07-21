import React, { useEffect, useState } from "react";
import axios from "axios";

function ReceiptEditor() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/receipts");
        setReceipts(response.data.items || []);
      } catch (err) {
        console.error("Error fetching receipts:", err);
        setError("Failed to load receipts.");
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, []);

  const handleChange = (index, field, value) => {
    const updated = [...receipts];
    updated[index][field] = value;
    setReceipts(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (let receipt of receipts) {
        if (!receipt.id) continue;
        await axios.put(
          `http://localhost:8000/receipts/${receipt.id}`,
          receipt
        );
      }
      alert("All changes saved to backend!");
    } catch (err) {
      console.error("Error saving updates:", err);
      alert("Error saving updates. See console for details.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading receipts...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Edit Receipts</h2>

      {receipts.length === 0 ? (
        <p>No receipts to display.</p>
      ) : (
        <form>
          {receipts.map((receipt, index) => (
            <div key={receipt.id || index} className="card mb-3 p-3 shadow">
              <div className="row">
                <div className="col-md-3">
                  <label className="form-label">Vendor</label>
                  <input
                    type="text"
                    className="form-control"
                    value={receipt.vendor || ""}
                    onChange={(e) =>
                      handleChange(index, "vendor", e.target.value)
                    }
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label">Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    value={receipt.amount || ""}
                    onChange={(e) =>
                      handleChange(index, "amount", e.target.value)
                    }
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={receipt.date ? receipt.date.slice(0, 10) : ""}
                    onChange={(e) =>
                      handleChange(index, "date", e.target.value)
                    }
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    className="form-control"
                    value={receipt.category || ""}
                    onChange={(e) =>
                      handleChange(index, "category", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="text-end">
            <button
              type="button"
              className="btn btn-success"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ReceiptEditor;
