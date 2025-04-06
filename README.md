# Malicious URL Detection

Malicious URL Detection is a web application that uses AI-powered scanning technology to analyze URLs and determine their likelihood of being malicious. The project consists of a **frontend** built with React and Tailwind CSS and a **backend** powered by Flask and scikit-learn.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Real-time Scanning**: Analyze URLs instantly using advanced AI technology.
- **Malicious URL Detection**: Identify URLs with a high likelihood of being malicious.
- **Safe URL Suggestions**: Display a list of safe URLs for reference.
- **Interactive Visualizations**: Pie charts to represent malicious and safe percentages.
- **Responsive Design**: Fully responsive UI built with Tailwind CSS.

---

## Tech Stack

### Frontend
- **React**: For building the user interface.
- **Tailwind CSS**: For styling.
- **Framer Motion**: For animations.
- **Recharts**: For data visualizations.
- **Axios**: For making HTTP requests.

### Backend
- **Flask**: For serving the API.
- **scikit-learn**: For machine learning-based URL classification.
- **pandas** and **numpy**: For data processing.
- **joblib**: For loading pre-trained models.

---

## Project Structure

```
MaliciousUrlDetection/
├── backend/
│   ├── app.py                  # Flask application
│   ├── pipeline.py             # URL feature extraction and prediction logic
│   ├── requirements.txt        # Backend dependencies
│   ├── url_classifier_model.joblib  # Pre-trained model
│   ├── url_classifier_scaler.joblib # Scaler for feature normalization
│   └── __pycache__/            # Compiled Python files
├── frontend/
│   ├── src/
│   │   ├── App.tsx             # Main React component
│   │   ├── main.tsx            # React entry point
│   │   ├── index.css           # Tailwind CSS styles
│   │   └── vite-env.d.ts       # Vite environment types
│   ├── index.html              # HTML template
│   ├── package.json            # Frontend dependencies and scripts
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   ├── vite.config.ts          # Vite configuration
│   └── tsconfig.json           # TypeScript configuration
```

---

## Setup Instructions

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the Flask server:
   ```bash
   python app.py
   ```

   The backend will be available at `http://127.0.0.1:5000`.

---

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://127.0.0.1:5173`.

---

## Usage

1. Open the frontend in your browser (`http://127.0.0.1:5173`).
2. Enter a URL in the input field and click **Scan URL**.
3. View the scan results, including the likelihood of the URL being malicious.
4. Explore the suggested safe URLs and malicious URLs displayed in the UI.

---

## API Endpoints

### POST `/detect`
- **Description**: Accepts a URL and returns the likelihood of it being malicious.
- **Request Body**:
  ```json
  {
    "url": "http://example.com"
  }
  ```
- **Response**:
  ```json
  {
        'malicious': 0.75,
        'benign': 0.25
    }
  ```

---


https://github.com/user-attachments/assets/7d7a7d30-218e-4fb1-b34e-3af504d09575


