// ======================================
// BRJ EMPIRE - AUTHENTICATION SYSTEM
// ======================================

function getSupabase() {
    return window.brjSupabase || window.supabaseClient || null;
}

// SHOW MESSAGE
function showMessage(text) {
    const msg = document.getElementById("message");
    msg.innerText = text;
    msg.style.display = "block";
}

// SHOW LOGIN
function showLogin() {
    document.getElementById("loginForm").classList.remove("hidden");
    document.getElementById("registerForm").classList.add("hidden");

    document.getElementById("loginTab").classList.add("active");
    document.getElementById("registerTab").classList.remove("active");

    document.getElementById("message").style.display = "none";
}

// SHOW REGISTER
function showRegister() {
    document.getElementById("registerForm").classList.remove("hidden");
    document.getElementById("loginForm").classList.add("hidden");

    document.getElementById("registerTab").classList.add("active");
    document.getElementById("loginTab").classList.remove("active");

    document.getElementById("message").style.display = "none";
}

// ======================================
// REGISTER USER
// ======================================
async function register(event) {
    event.preventDefault();

    const supabase = getSupabase();

    if (!supabase) {
        showMessage("Database connection failed. Please refresh.");
        console.error("Supabase client missing.");
        return;
    }

    const name = document.getElementById("fullName").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        showMessage("Passwords do not match.");
        return;
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
        showMessage("Enter a valid 10 digit mobile number.");
        return;
    }

    const button = event.submitter;
    button.disabled = true;
    button.innerText = "CREATING ACCOUNT...";

    try {
        const { data, error } = await supabase.auth.signUp({
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

        // FIX: Reset the actual form, not the div container
        const registerFormElement = document.querySelector("#registerForm form");
        if (registerFormElement) {
            registerFormElement.reset();
        }

    } catch (error) {
        console.error("Registration error:", error);
        showMessage(error.message || "Registration failed.");
    } finally {
        button.disabled = false;
        button.innerText = "CREATE ACCOUNT";
    }
}

// ======================================
// LOGIN USER
// ======================================
async function login(event) {
    event.preventDefault();

    const supabase = getSupabase();

    if (!supabase) {
        showMessage("Database connection failed. Please refresh.");
        console.error("Supabase client missing.");
        return;
    }

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    const button = event.submitter;
    button.disabled = true;
    button.innerText = "SIGNING IN...";

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;

        showMessage("Login successful! Welcome to BRJ EMPIRE.");
        console.log("Login successful:", data.user);

    } catch (error) {
        console.error("Login error:", error);
        showMessage(error.message || "Login failed.");
    } finally {
        button.disabled = false;
        button.innerText = "SIGN IN";
    }
}

// ======================================
// CHECK EXISTING SESSION
// ======================================
async function checkSession() {
    const supabase = getSupabase();

    if (!supabase) {
        console.error("Supabase client not initialized.");
        return;
    }

    try {
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (data.session) {
            console.log("BRJ EMPIRE: User session active.");
        }
    } catch (error) {
        console.error("Session error:", error.message);
    }
}

// INITIALIZE
document.addEventListener("DOMContentLoaded", checkSession);
