# Aegis AI

Aegis AI is an intelligent document analysis platform powered by **FastAPI**, **React**, and a **Multi-Agent RAG (Retrieval-Augmented Generation)** architecture. It enables users to upload documents, retrieve relevant information using vector search, and generate accurate AI-powered responses.

## Features

*  Multi-Agent RAG Pipeline
*  PDF Processing with `pdfplumber`
*  Semantic Search using `pgvector`
*  OpenAI-powered AI Assistant
*  Firebase Authentication
*  FastAPI Backend
*  Modern React Frontend
*  Document Upload & Retrieval

## Tech Stack

**Frontend**

* React
* TypeScript
* Tailwind CSS
* Firebase

**Backend**

* FastAPI
* Python
* OpenAI API
* pgvector
* PostgreSQL
* pdfplumber

## Project Structure

```text
frontend/
backend/
docs/
```

## Installation

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## Future Enhancements

* Multi-document reasoning
* OCR support
* Conversation memory
* Role-based authentication
* Cloud deployment
* Advanced analytics

## License

This project is developed for educational and research purposes.
