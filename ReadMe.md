# Receipt Dashboard 📊

A full-stack receipt management dashboard that allows users to upload receipts (PNG, JPG, JPEG, PDF), extract data using OCR, search/sort/filter receipts, visualize analytics, and export summaries.

---

## 🚀 Features

- 📄 Upload receipts via image or PDF
- 🧠 Extracts fields (vendor, date, amount, category) using OCR
- 🔍 Smart search & filtering (by vendor, amount, date, category)
- 📊 Visual analytics (pie/bar charts with % breakdowns)
- 🗃️ Export summaries as CSV or JSON
- ✏️ Edit receipt fields directly from UI
- ⚙️ REST API with FastAPI backend

---

## 📁 Project Structure

```
receipt-dashboard/
├── backend/
│   ├── algorithms/
│   │   ├── aggregate.py        # Computes stats and summaries
│   │   ├── search.py           # Implements search logic
│   │   └── sort.py             # Sorting helpers
│   │
│   ├── parser/
│   │   ├── extractor.py        # Extracts fields from OCR text
│   │   └── ocr.py              # OCR logic using pytesseract/pdf2image
│   │
│   ├── utils/
│   │   └── file_utils.py       # File-related helpers
│   │
│   ├── uploads/                # Stores uploaded files temporarily
│   ├── crud.py                 # DB CRUD operations
│   ├── database.py             # SQLAlchemy models and DB config
│   ├── models.py               # DB schema definitions
│   ├── main.py                 # FastAPI entry point
│   ├── receipts.db             # SQLite database file 
│   ├── requirements.txt        # Backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js          # Axios instance and API functions
│   │   ├── components/
│   │   │   ├── ReceiptEditor.js
│   │   │   ├── ReceiptTable.js
│   │   │   ├── SearchSortPanel.js
│   │   │   ├── StatsPanel.js
│   │   │   └── UploadForm.js
│   │   ├── pages/
│   │   │   └── Dashboard.js    # Main dashboard page
│   │   ├── App.js              # Entry component with routing
│   │   ├── App.css             # App-level styles
│   │   ├── App.test.js
│   │   ├── index.js            # React DOM render root
│   │   └── index.css
│   ├── public/
│   ├── package.json            # Frontend dependencies
│   └── package-lock.json
│
├── README.md

```


---

## ⚙️ Setup Instructions

### 🔧 Backend (FastAPI)

### Install dependencies
    pip install -r requirements.txt

### Run FastAPI server
    uvicorn main:app --reload
    Backend available at: http://localhost:8000

💻 Frontend (React)
### Navigate to frontend
    cd frontend
### Install dependencies
    npm install
### Start development server
    Frontend available at: http://localhost:3000


🧱 Design Choices
### Backend
FastAPI for quick and performant APIs

SQLAlchemy for ORM-based DB operations

Modular design: separate parser, crud, algorithms

OCR via pytesseract (images) and pdf2image (PDFs)

### Frontend
React with hooks and functional components

Bootstrap 5 for responsive UI

Chart.js for data visualization

Axios for API interaction

## 📊 User Journeys
Upload Receipt → Automatically parsed → Stored in DB

Search/Filter Receipts → View specific records

Visualize Analytics → Pie/bar charts for categories/vendors

Edit Fields → Save updates from UI

Export Summary → Download as CSV/JSON

## ⚠️ Limitations
OCR quality depends on receipt clarity

Categories are extracted using basic keyword matching

No user authentication implemented (yet)

Currently uses local SQLite DB (no multi-user support)

## 🧠 Assumptions
Input receipts are reasonably clear and structured

Fields like vendor, amount, and date are extractable

One user operating the system at a time (no concurrency handling)

##  📦 Export APIs
GET /export/summary/csv → CSV summary

GET /export/summary/json → JSON summary

