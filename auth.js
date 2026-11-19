// ======================================
// BRJ EMPIRE - AUTHENTICATION SYSTEM
// ======================================

function showMessage(text) {
    const msg = document.getElementById("message");
    msg.innerText = text;
    msg.style.display = "block";
}

function showLogin() {
    document.getElementById("loginForm").classList.remove("hidden");
    document.getElementById("registerForm").classList.add("hidden");

    document.getElementById("loginTab").classList.add("active");
    document.getElementById("registerTab").classList.remove("active");

    document.getElementById("message").style.display = "none";
}

function showRegister() {
    document.getElementById("registerForm").classList.remove("hidden");
    document.getElementById("loginForm").classList.add("hidden");

    document.getElementById("registerTab").classList.add("active");
    document.getElementById("loginTab").classList.remove("active");

    document.getElementById("message").style.display = "none";
}

// REGISTER USER
async function register(event) {
    event.preventDefault();

    const name = document.getElementById("fullName").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;
    const confirm = document.getElementById("confirmPassword").value;

    if (password !== confirm) {
        showMessage("Passwords do not match.");
        return;
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
        showMessage("Enter a valid 10 digit mobile number.");
        return;
    }

    if (!window.brjSupabase) {
        showMessage("Database connection is not configured.");
        return;
    }

    const button = event.submitter;
    button.disabled = true;
    button.innerText = "CREATING ACCOUNT...";

    try {
        const { data, error } =
            await window.brjSupabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        full_name: name,
                        mobile: mobile
                    }
                }
            });

        if (error) throw error;

        if (data.session) {
            showMessage("Account created successfully!");
        } else {
            showMessage("Registration successful! Please verify your email.");
        }

        document.getElementById("registerForm").reset();

    } catch (error) {
        showMessage(error.message);
    } finally {
        button.disabled = false;
        button.innerText = "CREATE ACCOUNT";
    }
}

// LOGIN USER
async function login(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!window.brjSupabase) {
        showMessage("Database connection is not configured.");
        return;
    }

    const button = event.submitter;
    button.disabled = true;
    button.innerText = "SIGNING IN...";

    try {
        const { data, error } =
            await window.brjSupabase.auth.signInWithPassword({
                email: email,
                password: password
            });

        if (error) throw error;

        showMessage("Login successful! Welcome to BRJ EMPIRE.");

    } catch (error) {
        showMessage(error.message);
    } finally {
        button.disabled = false;
        button.innerText = "SIGN IN";
    }
}

// CHECK EXISTING SESSION
async function checkSession() {
    if (!window.brjSupabase) return;

    const { data, error } =
        await window.brjSupabase.auth.getSession();

    if (error) {
        console.error(error.message);
        return;
    }

    if (data.session) {
        console.log("BRJ EMPIRE: User session active.");
    }
}

document.addEventListener("DOMContentLoaded", checkSession);
