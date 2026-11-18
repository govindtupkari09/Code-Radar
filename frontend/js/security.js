// ======================================
// CODE RADAR - SECURITY MODULE
// ======================================

console.log("Security Dashboard Initialized!");


// ======================================
// 1. Vulnerability Risk Filter
// ======================================

const riskFilter = document.getElementById("riskFilter");

const vulnerabilityCards =
    document.querySelectorAll(".vulnerability-card");

const noVulnerabilities =
    document.getElementById("noVulnerabilities");


riskFilter.addEventListener("change", function () {

    const selectedRisk = this.value;

    let visibleCount = 0;

    vulnerabilityCards.forEach((card) => {

        const risk = card.dataset.risk;

        if (
            selectedRisk === "all" ||
            selectedRisk === risk
        ) {

            card.style.display = "block";

            visibleCount++;

        } else {

            card.style.display = "none";

        }

    });

    noVulnerabilities.style.display =
        visibleCount === 0 ? "block" : "none";

});


// ======================================
// 2. Security Details Modal
// ======================================

const securityModal =
    document.getElementById("securityModal");

const closeSecurityModal =
    document.getElementById("closeSecurityModal");

const securityTitle =
    document.getElementById("securityTitle");

const securityDescription =
    document.getElementById("securityDescription");

const securitySolution =
    document.getElementById("securitySolution");


document.querySelectorAll(".security-details-btn")
.forEach((button) => {

    button.addEventListener("click", () => {

        securityTitle.textContent =
            button.dataset.title;

        securityDescription.textContent =
            button.dataset.description;

        securitySolution.textContent =
            button.dataset.solution;

        securityModal.classList.add("show");

    });

});


// Close Modal

closeSecurityModal.addEventListener("click", () => {

    securityModal.classList.remove("show");

});

securityModal.addEventListener("click", (event) => {

    if (event.target === securityModal) {

        securityModal.classList.remove("show");

    }

});

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        securityModal.classList.remove("show");

    }

});


// ======================================
// 3. Security Scan Button
// ======================================

const securityScan =
    document.getElementById("securityScan");

const securityToast =
    document.getElementById("securityToast");


function showSecurityToast(message) {

    securityToast.textContent = message;

    securityToast.classList.add("show");

    setTimeout(() => {

        securityToast.classList.remove("show");

    }, 3000);

}


securityScan.addEventListener("click", () => {

    showSecurityToast(
        "Security scanning engine integration is coming soon!"
    );

});


// ======================================
// 4. Repository Selection
// ======================================

const securityRepo =
    document.getElementById("securityRepo");

securityRepo.addEventListener("change", () => {

    showSecurityToast(
        `Selected repository: ${securityRepo.value}`
    );

});