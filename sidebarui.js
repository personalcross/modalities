function formatEUR(input) {
    input.addEventListener("input", () => {
        let value = input.value.replace(/\D/g, ""); // Remove anything not digit
        value = (parseInt(value, 10) / 100).toFixed(2) + "";
        // value = value.replace(".", ",");
        value = value.replace(/\B(?=(\d{3})+(?!\d))/g, "");
        input.value = `${value}`;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // Initialize all Materialize modals
    document.querySelectorAll('.modal').forEach(modal => {
        M.Modal.init(modal);
    });

    // Initialize all selectors
    document.querySelectorAll('select').forEach(select => {
        M.FormSelect.init(select);
    });

    const itemValueInput = document.getElementById("item-value");
    if (itemValueInput) {
        formatEUR(itemValueInput);
    }

    // Sidebar logic
    const settingsIcon = document.querySelector(".settings-icon");
    const settingsSidebar = document.querySelector(".settings-sidebar");
    const btnClose = document.querySelector(".close-settings");

    if (settingsIcon) {
        settingsIcon.addEventListener("click", () => {
            settingsSidebar.classList.add("open");
        });
    }

    if (btnClose) {
        btnClose.addEventListener("click", () => {
            settingsSidebar.classList.remove("open");
        });
    }

    // Sidebar buttons
    const btnLogin = document.getElementById("btn-login");
    const btnSignup = document.getElementById("btn-signup");

    const btnGym = document.getElementById("btn-gym");
    const btnCustomers = document.getElementById("btn-customers");
    const btnExercises = document.getElementById("btn-exercises");
    const btnPrescriptions = document.getElementById("btn-prescriptions");
    const btnWorkouts = document.getElementById("btn-workouts");

    const btnManageAccounts = document.getElementById("btn-manage-accounts");
    const btnLogout = document.getElementById("btn-logout");

    const redirectUrls=
    {
        "login": "https://personalcross.github.io/login",
        "signup": "https://personalcross.github.io/signup/",

        "gym": "https://personalcross.github.io/gym/",
        "customers": "https://personalcross.github.io/customers/",
        "exercises": "https://personalcross.github.io/exercises/",
        "prescriptions": "https://personalcross.github.io/prescriptions/",
        "workouts": "https://personalcross.github.io/workouts/",
        
        "manage-accounts": "https://personalcross.github.io/account-management/",
        "logout": "https://personalcross.github.io/home/" // logout redirects to home
    }

    if (btnLogin) {
        btnLogin.addEventListener("click", () => {
            window.location.href = redirectUrls["login"];
        });
    }

    if (btnSignup) {
        btnSignup.addEventListener("click", () => {
            window.location.href = redirectUrls["signup"];
        });
    }

    if (btnGym) {
        btnGym.addEventListener("click", () => {
            window.location.href = redirectUrls["gym"];
        });
    }

    if (btnCustomers) {
        btnCustomers.addEventListener("click", () => {
            window.location.href = redirectUrls["customers"];
        });
    }

    if (btnExercises) {
        btnExercises.addEventListener("click", () => {
            window.location.href = redirectUrls["exercises"];
        });
    }

    if (btnPrescriptions) {
        btnPrescriptions.addEventListener("click", () => {
            window.location.href = redirectUrls["prescriptions"];
        });
    }

    if (btnWorkouts) {
        btnWorkouts.addEventListener("click", () => {
            window.location.href = redirectUrls["workouts"];
        });
    }

    if (btnManageAccounts) {
        btnManageAccounts.addEventListener("click", () => {
            window.location.href = redirectUrls["manage-accounts"];
        });
    }

    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
            auth.signOut().then(() => {
                window.location.href = redirectUrls["logout"];
            });
        });
    }
});
