console.log("Code Radar Dashboard Initialized!");

// =================================
// 1. Toast Notification
// =================================

const toast = document.getElementById("toast");

function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}


// =================================
// 2. GitHub Modal
// =================================

const connectBtn = document.getElementById("connectBtn");
const githubModal = document.getElementById("githubModal");
const closeModal = document.getElementById("closeModal");

connectBtn?.addEventListener("click", () => {
    githubModal?.classList.add("show");
});

closeModal?.addEventListener("click", () => {
    githubModal?.classList.remove("show");
});

githubModal?.addEventListener("click", (event) => {
    if (event.target === githubModal) {
        githubModal.classList.remove("show");
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        githubModal?.classList.remove("show");
    }
});


// =================================
// 3. Dashboard Elements
// =================================

const totalRepositories = document.getElementById("totalRepositories");
const totalIssues = document.getElementById("totalIssues");
const totalVulnerabilities = document.getElementById("totalVulnerabilities");
const qualityScore = document.getElementById("qualityScore");

const recentRepositories = document.getElementById("recentRepositories");
const recentIssues = document.getElementById("recentIssues");


// =================================
// 4. Read Repository Data
// =================================

function getSavedRepositories() {
    try {
        return JSON.parse(
            localStorage.getItem("codeRadarRepositories") || "[]"
        );
    } catch (error) {
        console.error("Error reading repository data:", error);
        return [];
    }
}


// =================================
// 5. Count AI Findings
// =================================

function countFindings(text) {
    if (!text) return 0;

    if (/no (genuine )?(bugs|issues|security vulnerabilities|vulnerabilities)/i.test(text)) {
        return 0;
    }

    const matches = text.match(/^\s*(?:[-*]|\d+\.)\s+.+/gm);

    return matches ? matches.length : 0;
}


// =================================
// 6. Extract Analysis Section
// =================================

function extractSection(analysis, heading) {
    if (!analysis) return "";

    const regex = new RegExp(
        `^##\\s*${heading}\\s*\\n([\\s\\S]*?)(?=^##\\s|$)`,
        "im"
    );

    const match = analysis.match(regex);

    return match ? match[1].trim() : "";
}


// =================================
// 7. Escape HTML
// =================================

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => {
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


// =================================
// 8. Calculate Dashboard Statistics
// =================================

function loadDashboard() {
    const repositories = getSavedRepositories();

    let issueCount = 0;
    let vulnerabilityCount = 0;

    repositories.forEach((repo) => {
        const results = Array.isArray(repo.results) ? repo.results : [];

        results.forEach((file) => {
            const analysis = file.analysis || "";

            const bugs = extractSection(analysis, "Bugs");
            const security = extractSection(
                analysis,
                "Security Vulnerabilities"
            );
            const quality = extractSection(
                analysis,
                "Code Quality Issues"
            );

            issueCount += countFindings(bugs);
            issueCount += countFindings(security);
            issueCount += countFindings(quality);

            vulnerabilityCount += countFindings(security);
        });
    });

    if (totalRepositories) {
        totalRepositories.textContent = repositories.length;
    }

    if (totalIssues) {
        totalIssues.textContent = issueCount;
    }

    if (totalVulnerabilities) {
        totalVulnerabilities.textContent = vulnerabilityCount;
    }

    // Quality score is not implemented yet.
    if (qualityScore) {
        qualityScore.textContent = "--";
    }

    renderRecentRepositories(repositories);
    renderRecentIssues(repositories);
}


// =================================
// 9. Render Recent Repositories
// =================================

function renderRecentRepositories(repositories) {
    if (!recentRepositories) return;

    if (repositories.length === 0) {
        recentRepositories.innerHTML = `
            <p>
                No repositories analyzed yet.
                Connect a GitHub repository to get started.
            </p>
        `;

        return;
    }

    recentRepositories.innerHTML = repositories
        .slice(-3)
        .reverse()
        .map((repo) => {
            const name = escapeHTML(repo.repository || "Unknown");

            const totalFiles = Number(repo.total_files_found) || 0;
            const analyzedFiles = Number(repo.analyzed_files) || 0;

            return `
                <div class="repo-card">

                    <div class="repo-top">
                        <h3>${name}</h3>
                        <span class="status success">Analyzed</span>
                    </div>

                    <p>AI-powered repository code analysis.</p>

                    <div class="repo-details">
                        <span>Files Found: ${totalFiles}</span>
                        <span>Files Analyzed: ${analyzedFiles}</span>
                    </div>

                </div>
            `;
        })
        .join("");
}


// =================================
// 10. Render Recent Issues
// =================================

function renderRecentIssues(repositories) {
    if (!recentIssues) return;

    const rows = [];

    repositories.forEach((repo) => {
        const results = Array.isArray(repo.results) ? repo.results : [];

        results.forEach((file) => {
            const analysis = file.analysis || "";

            const sections = [
                {
                    title: "Bugs",
                    content: extractSection(analysis, "Bugs")
                },
                {
                    title: "Security Vulnerabilities",
                    content: extractSection(
                        analysis,
                        "Security Vulnerabilities"
                    )
                },
                {
                    title: "Code Quality Issues",
                    content: extractSection(
                        analysis,
                        "Code Quality Issues"
                    )
                }
            ];

            sections.forEach((section) => {
                if (!section.content) return;

                const findings =
                    section.content.match(/^\s*(?:[-*]|\d+\.)\s+.+/gm) || [];

                findings.forEach((finding) => {
                    rows.push({
                        issue: finding
                            .replace(/^\s*(?:[-*]|\d+\.)\s+/, "")
                            .slice(0, 120),

                        repository: repo.repository || "Unknown",

                        category: section.title
                    });
                });
            });
        });
    });

    if (rows.length === 0) {
        recentIssues.innerHTML = `
            <tr>
                <td colspan="4">No AI findings available yet.</td>
            </tr>
        `;

        return;
    }

    recentIssues.innerHTML = rows.slice(0, 10).map((item) => {
        return `
            <tr>
                <td>${escapeHTML(item.issue)}</td>
                <td>${escapeHTML(item.repository)}</td>
                <td>${escapeHTML(item.category)}</td>
                <td>Needs Review</td>
            </tr>
        `;
    }).join("");
}


// =================================
// 11. GitHub Repository Form
// =================================

const githubForm = document.getElementById("githubForm");

githubForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const repoUrl = document.getElementById("repoUrl")?.value.trim();

    const githubPattern =
        /^https:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9._-]+\/?$/;

    if (!repoUrl || !githubPattern.test(repoUrl)) {
        showToast("Please enter a valid GitHub repository URL!");
        return;
    }

    showToast("Repository URL submitted successfully!");

    githubForm.reset();
    githubModal?.classList.remove("show");
});


// =================================
// 12. Sidebar Navigation
// =================================

const menuItems = document.querySelectorAll(".menu-item");

menuItems.forEach((item) => {
    item.addEventListener("click", (event) => {
        const href = item.getAttribute("href");

        // Prevent navigation only for placeholder links.
        if (!href || href === "#") {
            event.preventDefault();

            const pageName = item.textContent.trim();

            showToast(`${pageName} is not available yet.`);
        }
    });
});


// =================================
// 13. Repository Search
// =================================

const searchInput = document.querySelector(".top-actions input");

searchInput?.addEventListener("input", () => {
    const searchValue = searchInput.value.toLowerCase();

    const repositoryCards = document.querySelectorAll(".repo-card");

    repositoryCards.forEach((repo) => {
        const repoName =
            repo.querySelector("h3")?.textContent.toLowerCase() || "";

        repo.style.display = repoName.includes(searchValue)
            ? "block"
            : "none";
    });
});


// =================================
// 14. Notification Button
// =================================

const notificationBtn = document.querySelector(".notification");

notificationBtn?.addEventListener("click", () => {
    showToast("You are all caught up!");
});


// =================================
// 15. Listen for Storage Changes
// =================================

window.addEventListener("storage", (event) => {
    if (event.key === "codeRadarRepositories") {
        loadDashboard();
    }
});


// =================================
// 16. Initialize Dashboard
// =================================

loadDashboard();

console.log("Code Radar Dashboard Ready!");