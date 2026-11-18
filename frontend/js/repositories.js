// ===================================
// Repository Management
// ===================================

const repoCards = document.querySelectorAll(
    ".repo-management-card"
);

const searchRepo = document.getElementById("searchRepo");

const languageFilter = document.getElementById("languageFilter");

const statusFilter = document.getElementById("statusFilter");

const emptyMessage = document.getElementById("emptyMessage");


// ===================================
// Search and Filter
// ===================================

function filterRepositories() {

    const searchValue = searchRepo.value.toLowerCase();

    const language = languageFilter.value;

    const status = statusFilter.value;

    let visibleCount = 0;

    repoCards.forEach((card) => {

        const name = card.querySelector("h3")
            .textContent.toLowerCase();

        const cardLanguage = card.dataset.language;

        const cardStatus = card.dataset.status;

        const matchesSearch = name.includes(searchValue);

        const matchesLanguage =
            language === "all" || cardLanguage === language;

        const matchesStatus =
            status === "all" || cardStatus === status;

        if (
            matchesSearch &&
            matchesLanguage &&
            matchesStatus
        ) {

            card.style.display = "block";

            visibleCount++;

        } else {

            card.style.display = "none";

        }

    });

    emptyMessage.style.display =
        visibleCount === 0 ? "block" : "none";

}

searchRepo.addEventListener("input", filterRepositories);

languageFilter.addEventListener("change", filterRepositories);

statusFilter.addEventListener("change", filterRepositories);


// ===================================
// Repository Modal
// ===================================

const repoModal = document.getElementById("repoModal");

document.getElementById("connectRepo").addEventListener(
    "click",
    () => repoModal.classList.add("show")
);

document.getElementById("closeRepoModal").addEventListener(
    "click",
    () => repoModal.classList.remove("show")
);

repoModal.addEventListener("click", (event) => {

    if (event.target === repoModal) {
        repoModal.classList.remove("show");
    }

});


// ===================================
// Toast Notification
// ===================================

function showRepoToast(message) {

    const toast = document.getElementById("repoToast");

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);

}


// ===================================
// Add Repository
// ===================================

const repoForm = document.getElementById("repoForm");

repoForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const url = document.getElementById("newRepoUrl").value.trim();

    const name = document.getElementById("newRepoName").value.trim();

    const pattern =
        /^https:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9._-]+\/?$/;

    if (!pattern.test(url)) {

        showRepoToast("Enter a valid GitHub repository URL!");

        return;

    }

    const existingNames = [...document.querySelectorAll(
        ".repo-management-card h3"
    )].map(element => element.textContent.toLowerCase());

    if (existingNames.includes(name.toLowerCase())) {

        showRepoToast("Repository already exists!");

        return;

    }

    const card = document.createElement("div");

    card.className = "repo-management-card";

    card.dataset.language = "unknown";

    card.dataset.status = "pending";

    card.innerHTML = `

        <div class="repo-card-header">

            <div class="repo-icon">⌘</div>

            <span class="status pending-status">Pending</span>

        </div>

        <h3></h3>

        <p>Newly connected GitHub repository.</p>

        <div class="repo-meta">

            <span>● Unknown</span>

            <span>Branch: Unknown</span>

        </div>

        <div class="quality-section">

            <span>Code Quality</span>

            <strong>Not analyzed</strong>

        </div>

        <div class="progress">

            <div style="width:0%"></div>

        </div>

        <div class="repo-footer">

            <span>Recently added</span>

            <button class="analyze-btn">Analyze →</button>

        </div>

    `;

    card.querySelector("h3").textContent = name;

    document.getElementById("repositoryList").appendChild(card);

    document.getElementById("totalRepos").textContent =
        String(document.querySelectorAll(
            ".repo-management-card"
        ).length).padStart(2, "0");

    repoModal.classList.remove("show");

    repoForm.reset();

    showRepoToast("Repository added successfully!");

    attachAnalyzeButton(card);

    filterRepositories();

});


// ===================================
// Analyze Button
// ===================================

function attachAnalyzeButton(card) {

    const button = card.querySelector(".analyze-btn");

    button.addEventListener("click", () => {

        showRepoToast(
            "Analysis engine integration is coming next!"
        );

    });

}

document.querySelectorAll(".repo-management-card").forEach(
    attachAnalyzeButton
);