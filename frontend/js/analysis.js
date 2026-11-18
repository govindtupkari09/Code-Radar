// ======================================
// CODE RADAR - REAL AI CODE ANALYSIS
// ======================================

console.log("Code Analysis Module Loaded!");

const API_URL = "http://127.0.0.1:8000/api/ai/explain-code";

// ======================================
// SEVERITY FILTER
// ======================================

const severityFilter = document.getElementById("severityFilter");
const issueCards = document.querySelectorAll(".issue-card");
const noIssues = document.getElementById("noIssues");

if (severityFilter) {
    severityFilter.addEventListener("change", function () {
        const selectedSeverity = this.value;
        let visibleCount = 0;

        issueCards.forEach((card) => {
            const severity = card.dataset.severity;

            if (
                selectedSeverity === "all" ||
                selectedSeverity === severity
            ) {
                card.style.display = "block";
                visibleCount++;
            } else {
                card.style.display = "none";
            }
        });

        if (noIssues) {
            noIssues.style.display =
                visibleCount === 0 ? "block" : "none";
        }
    });
}

// ======================================
// AI MODAL ELEMENTS
// ======================================

const aiModal = document.getElementById("aiModal");
const closeAiModal = document.getElementById("closeAiModal");

const aiLoading = document.getElementById("aiLoading");
const aiResult = document.getElementById("aiResult");

const selectedIssue = document.getElementById("selectedIssue");
const aiExplanation = document.getElementById("aiExplanation");
const aiFix = document.getElementById("aiFix");

// ======================================
// SAMPLE ISSUE DATA
// ======================================

const issueData = {

    "SQL Injection Vulnerability": {
        language: "python",
        description: "User input is directly used in SQL queries.",

        code: `
def get_user(user_id, cursor):

    query = "SELECT * FROM users WHERE id = " + user_id

    cursor.execute(query)

    return cursor.fetchall()
`
    },

    "Hardcoded API Key": {
        language: "python",
        description: "Sensitive API credentials are stored directly inside source code.",

        code: `
API_KEY = "123456789_SECRET_API_KEY"

def connect_to_service():
    return API_KEY
`
    },

    "Unused Variables": {
        language: "python",
        description: "Some variables are declared but never used.",

        code: `
def calculate_total(price, quantity):
    unused_variable = 100
    total = price * quantity
    return total
`
    },

    "Long Function": {
        language: "python",
        description: "A function contains too many operations and should be divided into smaller functions.",

        code: `
def process_order(order):
    print("Validating order")
    print("Checking user")
    print("Checking payment")
    print("Calculating total")
    print("Updating inventory")
    print("Sending confirmation")
    print("Generating invoice")
    print("Saving order")
    return "Order completed"
`
    }
};

// ======================================
// FORMAT AI RESPONSE
// ======================================

function formatAIResponse(response) {

    const codeMatch = response.match(
        /```(?:[a-zA-Z0-9_+-]+)?\s*([\s\S]*?)```/
    );

    const correctedCode = codeMatch
        ? codeMatch[1].trim()
        : "No corrected code was generated.";

    const explanation = response
        .replace(/\*\*Corrected Code\*\*:?\s*/i, "")
        .replace(/```[\s\S]*?```/g, "")
        .trim();

    return {
        explanation,
        correctedCode
    };
}

// ======================================
// MARKDOWN RENDERING
// ======================================

function renderMarkdown(content) {

    if (
        typeof marked === "undefined" ||
        typeof DOMPurify === "undefined"
    ) {
        return content;
    }

    // Fix escaped Markdown characters
    content = content
        .replace(/\\([#*`_~])/g, "$1")
        .replace(/\\n/g, "\n");

    // Convert Markdown into HTML
    const html = marked.parse(content);

    // Sanitize HTML for security
    return DOMPurify.sanitize(html);
}

// ======================================
// CALL BACKEND AI API
// ======================================

async function explainIssueWithAI(issueName) {

    const data = issueData[issueName];

    if (!data) {
        throw new Error("Issue code not found.");
    }

    const requestBody = {

        code: data.code,

        language: data.language,

        issue_title: issueName,

        issue_description: data.description
    };

    console.log("Sending Code to AI:", requestBody.code);
    console.log("Full API Request:", requestBody);

    const response = await fetch(API_URL, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {

        let errorMessage = "AI analysis failed.";

        try {
            const errorData = await response.json();
            errorMessage = errorData.detail || errorMessage;
        } catch (error) {
            console.error("Error reading API response:", error);
        }

        throw new Error(errorMessage);
    }

    const result = await response.json();

    if (!result.success) {
        throw new Error("AI analysis was unsuccessful.");
    }

    console.log("Backend AI Response:", result);

    return result.ai_explanation;
}

// ======================================
// AI EXPLAIN BUTTON
// ======================================

document.querySelectorAll(".ai-explain-btn").forEach(button => {

    button.addEventListener("click", async () => {

        const issueName = button.dataset.issue;

        // Open AI Modal
        selectedIssue.textContent = issueName;

        aiModal.classList.add("show");

        aiResult.style.display = "none";

        aiLoading.style.display = "block";

        aiLoading.textContent =
            "Analyzing code with Qwen2.5-Coder AI...";

        try {

            // Call AI Backend
            const aiResponse =
                await explainIssueWithAI(issueName);

            // Format AI Response
            const formatted =
                formatAIResponse(aiResponse);

            // ======================================
            // DEBUG LOGS
            // ======================================

            console.log("Raw AI Response:", aiResponse);

            console.log(
                "Formatted Explanation:",
                formatted.explanation
            );

            console.log(
                "Rendered HTML:",
                renderMarkdown(formatted.explanation)
            );

            // ======================================
            // DISPLAY MARKDOWN EXPLANATION
            // ======================================

            aiExplanation.innerHTML =
                renderMarkdown(formatted.explanation);

            // Display Corrected Code
            aiFix.textContent =
                formatted.correctedCode;

            // Hide Loading
            aiLoading.style.display = "none";

            // Show Results
            aiResult.style.display = "block";

        } catch (error) {

            console.error("AI Analysis Error:", error);

            aiLoading.style.display = "none";

            aiResult.style.display = "block";

            aiExplanation.textContent =
                "AI Analysis Failed: " + error.message;

            aiFix.textContent =
                "Please check whether FastAPI and Ollama are running.";
        }
    });
});

// ======================================
// CLOSE AI MODAL
// ======================================

if (closeAiModal) {

    closeAiModal.addEventListener("click", () => {
        aiModal.classList.remove("show");
    });
}

if (aiModal) {

    aiModal.addEventListener("click", (event) => {

        if (event.target === aiModal) {
            aiModal.classList.remove("show");
        }
    });
}

// Close modal using Escape key
document.addEventListener("keydown", (event) => {

    if (event.key === "Escape" && aiModal) {
        aiModal.classList.remove("show");
    }
});

// ======================================
// RUN ANALYSIS BUTTON
// ======================================

const runAnalysis = document.getElementById("runAnalysis");

const analysisToast = document.getElementById("analysisToast");

if (runAnalysis) {

    runAnalysis.addEventListener("click", () => {

        analysisToast.textContent =
            "SonarQube integration is coming soon!";

        analysisToast.classList.add("show");

        setTimeout(() => {
            analysisToast.classList.remove("show");
        }, 3000);
    });
}

// ======================================
// REPOSITORY SELECTION
// ======================================

const repoSelect = document.getElementById("repoSelect");

if (repoSelect) {

    repoSelect.addEventListener("change", () => {

        analysisToast.textContent =
            `Selected repository: ${repoSelect.value}`;

        analysisToast.classList.add("show");

        setTimeout(() => {
            analysisToast.classList.remove("show");
        }, 3000);
    });
}

// ======================================
// END OF CODE RADAR ANALYSIS MODULE
// ======================================

console.log("Code Radar AI Analysis Ready!");

// ==========================================
// GitHub Full Repository AI Analysis
// ==========================================

const githubRepoUrl = document.getElementById("githubRepoUrl");
const analyzeGithubRepoBtn = document.getElementById("analyzeGithubRepo");
const repositoryLoading = document.getElementById("repositoryLoading");
const repositoryStatus = document.getElementById("repositoryStatus");
const repositoryResults = document.getElementById("repositoryResults");

if (analyzeGithubRepoBtn) {

    analyzeGithubRepoBtn.addEventListener("click", async () => {

        const repoUrl = githubRepoUrl.value.trim();

        // Validate GitHub URL
        if (!repoUrl) {
            repositoryStatus.textContent = "Please enter a GitHub repository URL.";
            return;
        }

        if (!repoUrl.startsWith("https://github.com/")) {
            repositoryStatus.textContent = "Please enter a valid GitHub repository URL.";
            return;
        }

        repositoryLoading.style.display = "block";
        repositoryStatus.textContent = "";
        repositoryResults.innerHTML = "";

        analyzeGithubRepoBtn.disabled = true;
        analyzeGithubRepoBtn.textContent = "Analyzing...";

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/api/github/analyze-full-repository",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        repo_url: repoUrl
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Repository analysis failed.");
            }

            if (!data.success) {
                throw new Error("AI analysis was unsuccessful.");
            }

            repositoryStatus.textContent =
                `Analysis completed for ${data.repository}`;

            // Summary
            let html = `
                <div class="repository-summary">
                    <h3>Repository Analysis Summary</h3>

                    <p><strong>Repository:</strong> ${escapeHTML(data.repository)}</p>

                    <p><strong>Total Files Found:</strong> ${data.total_files_found}</p>

                    <p><strong>Files Analyzed:</strong> ${data.analyzed_files}</p>

                    <p><strong>Files Skipped:</strong> ${data.skipped_files}</p>

                    <p><strong>AI Provider:</strong> ${escapeHTML(data.ai_provider)}</p>

                    <p><strong>Model:</strong> ${escapeHTML(data.model)}</p>
                </div>

                <h3>AI Code Review Results</h3>
            `;

            // Individual file results
            data.results.forEach((file, index) => {

                const safeAnalysis = DOMPurify.sanitize(
                    marked.parse(file.analysis || "No analysis available.")
                );

                html += `
                    <div class="file-analysis-card">

                        <h4>
                            ${index + 1}. ${escapeHTML(file.file_path)}
                        </h4>

                        <div class="ai-analysis-content">
                            ${safeAnalysis}
                        </div>

                    </div>
                `;
            });

            // Skipped files
            if (data.skipped_file_details?.length) {

                html += `
                    <div class="skipped-files">
                        <h3>Skipped Files</h3>
                `;

                data.skipped_file_details.forEach(file => {

                    html += `
                        <p>
                            <strong>${escapeHTML(file.file_path)}</strong>:
                            ${escapeHTML(file.reason)}
                        </p>
                    `;
                });

                html += `</div>`;
            }

            repositoryResults.innerHTML = html;

        } catch (error) {

            console.error("GitHub Analysis Error:", error);

            repositoryStatus.textContent =
                error.message || "Something went wrong.";

        } finally {

            repositoryLoading.style.display = "none";

            analyzeGithubRepoBtn.disabled = false;
            analyzeGithubRepoBtn.textContent = "🚀 Analyze Repository";
        }

    });

}


// Escape HTML to safely display text
function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, character => {

        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[character];
    });
}

if (!data.success) {
    throw new Error("AI analysis was unsuccessful.");
}

// =================================
// Save Analysis Data for Dashboard
// =================================

try {
    const savedRepositories = JSON.parse(
        localStorage.getItem("codeRadarRepositories") || "[]"
    );

    const repositoryData = {
        repository: data.repository,
        total_files_found: data.total_files_found,
        analyzed_files: data.analyzed_files,
        skipped_files: data.skipped_files,
        ai_provider: data.ai_provider,
        model: data.model,
        results: data.results || [],
        analyzed_at: new Date().toISOString()
    };

    // Check whether repository already exists
    const existingIndex = savedRepositories.findIndex(
        repo => repo.repository === data.repository
    );

    if (existingIndex !== -1) {
        savedRepositories[existingIndex] = repositoryData;
    } else {
        savedRepositories.push(repositoryData);
    }

    localStorage.setItem(
        "codeRadarRepositories",
        JSON.stringify(savedRepositories)
    );

    console.log("Repository analysis saved successfully!");

} catch (storageError) {
    console.error("Failed to save analysis:", storageError);
}