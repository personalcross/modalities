function checkIfAdmin() {
    // Get role from localStorage
    const role = localStorage.getItem("userRole");

    if (role === 'admin') {
        return true;
    } else {
        return false;
    }
}

function showLoggedOptions(user) {
    if (!user) {
        document.querySelectorAll(".guest-only").forEach(btn => btn.style.display = "block");
        document.querySelectorAll(".logged-only").forEach(btn => btn.style.display = "none");
        document.querySelectorAll(".admin-only").forEach(btn => btn.style.display = "none");
        document.querySelectorAll(".admin-actions").forEach(div => div.style.display = "none");
        return;
    }

    const cachedRole = localStorage.getItem('userRole');
    if (cachedRole) {
        // Show UI based on cached role immediately
        document.querySelectorAll(".guest-only").forEach(btn => btn.style.display = "none");
        document.querySelectorAll(".logged-only").forEach(btn => btn.style.display = "block");

        if (cachedRole === 'admin') {
            document.querySelectorAll(".admin-only").forEach(btn => btn.style.display = "block");
        } else {
            document.querySelectorAll(".admin-only").forEach(btn => btn.style.display = "none");
        }
    }

    db.collection('users').doc(user.uid).get().then(doc => {
        const data = doc && doc.exists ? doc.data() : null;
        const role = data && data.role ? data.role : 'common';

        // persist and update UI if it differs from cached value
        const prev = localStorage.getItem('userRole');
        if (prev !== role) localStorage.setItem('userRole', role);

        document.querySelectorAll(".guest-only").forEach(btn => btn.style.display = "none");
        document.querySelectorAll(".logged-only").forEach(btn => btn.style.display = "block");

        if (role === 'admin') {
            document.querySelectorAll(".admin-only").forEach(btn => btn.style.display = "block");
        } else {
            document.querySelectorAll(".admin-only").forEach(btn => btn.style.display = "none");
        }
    }).catch(err => {
        console.error('Erro ao ler role do Firestore:', err);
    });
}

auth.onAuthStateChanged((user) => {
    showLoggedOptions(user);
});

// logout
const logout = document.querySelector('#btn-logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
});
