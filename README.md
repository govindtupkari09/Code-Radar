# 🚀 Code Radar – AI-Powered Code Review & Developer Assistant

Code Radar is an AI-powered code review and developer assistant that analyzes GitHub repositories to identify potential bugs, security vulnerabilities, and code quality issues using Large Language Models (LLMs).

The application combines GitHub API integration, FastAPI, Ollama, and Qwen2.5-Coder to provide AI-generated code analysis and improvement suggestions.

## ✨ Features

- **GitHub Repository Analysis:** Analyze public GitHub repositories using their repository URL.
- **AI-Powered Code Review:** Use Qwen2.5-Coder to review source code.
- **Bug Detection:** Identify potential bugs and programming issues.
- **Security Analysis:** Highlight potential security vulnerabilities.
- **Code Quality Review:** Identify code quality and maintainability issues.
- **AI Recommendations:** Get explanations and suggested fixes.
- **Web Dashboard:** View repository analysis results through a frontend interface.

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Python, FastAPI |
| AI Model | Qwen2.5-Coder 7B |
| AI Runtime | Ollama |
| API Integration | GitHub REST API |
| HTTP Client | HTTPX |
| API Testing | Swagger UI |

## 🏗️ Project Structure

```text
Code-Radar/
│
├── backend/
│   ├── app/
│   │   ├── services/
│   │   │   └── github_service.py
│   │   └── __init__.py
│   │
│   ├── main.py
│   └── .gitignore
│
├── frontend/
│   ├── css/
│   │   ├── analysis.css
│   │   ├── repositories.css
│   │   ├── security.css
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── analysis.js
│   │   ├── app.js
│   │   ├── repositories.js
│   │   └── security.js
│   │
│   ├── index.html
│   ├── analysis.html
│   ├── repositories.html
│   └── security.html
│
└── README.md
```

## ⚙️ Prerequisites

Before running the project, install:

- Python 3.11+
- Ollama
- Git
- Visual Studio Code

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/govindtupkari09/Code-Radar.git
```

```bash
cd Code-Radar
```

### 2. Set Up Python Virtual Environment

```bash
cd backend
```

```bash
python -m venv venv
```

Activate the environment on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

### 3. Install Dependencies

Install the backend dependencies:

```bash
pip install fastapi uvicorn httpx pydantic
```

### 4. Install and Run Ollama

Download Ollama from:

https://ollama.com/

Pull the Qwen2.5-Coder model:

```bash
ollama pull qwen2.5-coder:7b
```

Start the Ollama service:

```bash
ollama serve
```

If Ollama is already running in the background, this command may not be necessary.

### 5. Start the Backend

From the backend directory, run:

```bash
uvicorn main:app --reload
```

Backend API:

```text
http://127.0.0.1:8000
```

Swagger API Documentation:

```text
http://127.0.0.1:8000/docs
```

### 6. Run the Frontend

Open the `frontend` folder in Visual Studio Code.

Run `index.html` using the Live Server extension.

## 🔍 How It Works

1. Enter a public GitHub repository URL.
2. Code Radar fetches repository information and supported source files through the GitHub API.
3. The backend sends eligible source code to the Qwen2.5-Coder model through Ollama.
4. The AI analyzes the code and generates review suggestions.
5. Results are displayed on the frontend.

## ⚠️ Current Limitations

- Repository analysis currently processes a maximum of 5 files per full-repository analysis.
- Large files and unsupported file types may be skipped.
- The application currently supports public GitHub repositories.
- AI-generated findings are suggestions and should be manually reviewed and verified.
- Ollama and the Qwen2.5-Coder model must be available locally.

## 🔮 Future Enhancements

- GitHub OAuth authentication.
- PostgreSQL database integration.
- SonarQube integration.
- Docker containerization.
- AWS cloud deployment.
- Advanced code quality metrics.

## 👨‍💻 Author

**Govind Tupkari**

AI Engineer | Generative AI | Python | FastAPI | LLMs

GitHub: https://github.com/govindtupkari09

## 📄 License

This project is developed for learning and demonstration purposes.
