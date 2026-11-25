// ==========================================
// BRJ EMPIRE - ADMIN AUTHENTICATION
// MAIN ADMIN SECURITY SYSTEM
// ==========================================

(function () {

"use strict";

const supabase = window.brjSupabase;

const LOGIN_PAGE = "admin-login.html";

const DASHBOARD_PAGE = "admin-dashboard.html";

const ALLOWED_ROLE = "admin";

let isProcessing = false;


// ==========================================
// ELEMENTS
// ==========================================

const form = document.getElementById("adminLoginForm");

const emailInput = document.getElementById("adminEmail");

const passwordInput = document.getElementById("adminPassword");

const loginButton = document.getElementById("loginButton");

const messageBox = document.getElementById("message");

const togglePassword = document.getElementById("togglePassword");


// ==========================================
// MESSAGE SYSTEM
// ==========================================

function showMessage(message, type = "error") {

    if (!messageBox) return;

    messageBox.textContent = message;

    messageBox.className = "message " + type;

}


// ==========================================
// BUTTON LOADING
// ==========================================

function setLoading(loading) {

    if (!loginButton) return;

    loginButton.disabled = loading;

    loginButton.textContent = loading
        ? "VERIFYING ACCESS..."
        : "ACCESS ADMIN PANEL →";

}


// ==========================================
// ROLE VERIFICATION
// ==========================================

async function verifyAdmin(userId) {

    const { data, error } = await supabase

        .from("user_roles")

        .select("role")

        .eq("user_id", userId)

        .maybeSingle();

    if (error) {

        console.error("ADMIN ROLE ERROR:", error);

        throw new Error(
            "Administrator verification failed. Check user_roles permissions."
        );

    }

    if (!data || data.role !== ALLOWED_ROLE) {

        throw new Error(
            "Access denied. This account is not an authorized Main Admin."
        );

    }

    return true;

}


// ==========================================
// LOGIN
// ==========================================

async function adminLogin(event) {

    event.preventDefault();

    if (isProcessing) return;

    if (!supabase) {

        showMessage("Supabase connection unavailable.");

        return;

    }

    const email = emailInput.value.trim();

    const password = passwordInput.value;

    if (!email || !password) {

        showMessage("Please enter your email and password.");

        return;

    }

    isProcessing = true;

    setLoading(true);

    showMessage("Verifying administrator credentials...", "success");

    let authenticatedUserId = null;

    try {

        // STEP 1: AUTHENTICATION

        const { data, error } = await supabase.auth.signInWithPassword({

            email: email,

            password: password

        });

        if (error) throw error;

        if (!data.user) {

            throw new Error("Authentication failed.");

        }

        authenticatedUserId = data.user.id;

        // STEP 2: ROLE VERIFICATION

        await verifyAdmin(data.user.id);

        // STEP 3: SAVE EMAIL PREFERENCE

        if (document.getElementById("rememberEmail").checked) {

            localStorage.setItem("brj_admin_email", email);

        } else {

            localStorage.removeItem("brj_admin_email");

        }

        // STEP 4: SUCCESS

        showMessage(
            "Administrator verified. Opening control center...",
            "success"
        );

        console.log("BRJ ADMIN AUTHENTICATED:", data.user.id);

        // STEP 5: DASHBOARD REDIRECT

        setTimeout(function () {

            window.location.replace(DASHBOARD_PAGE);

        }, 1000);

    } catch (error) {

        console.error("ADMIN LOGIN ERROR:", error);

        // SIGN OUT IF ROLE VERIFICATION FAILS

        if (authenticatedUserId) {

            await supabase.auth.signOut();

        }

        showMessage(error.message || "Admin login failed.");

    } finally {

        isProcessing = false;

        setLoading(false);

    }

}


// ==========================================
// CHECK EXISTING SESSION
// ==========================================

async function checkExistingAdminSession() {

    if (!supabase) {

        showMessage("Supabase connection failed.");

        return;

    }

    try {

        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (!data.session) return;

        await verifyAdmin(data.session.user.id);

        window.location.replace(DASHBOARD_PAGE);

    } catch (error) {

        console.error("ADMIN SESSION ERROR:", error);

        await supabase.auth.signOut();

    }

}


// ==========================================
// PASSWORD VISIBILITY
// ==========================================

if (togglePassword) {

    togglePassword.addEventListener("click", function () {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            togglePassword.textContent = "HIDE";

        } else {

            passwordInput.type = "password";

            togglePassword.textContent = "SHOW";

        }

    });

}


// ==========================================
// REMEMBER EMAIL
// ==========================================

const savedEmail = localStorage.getItem("brj_admin_email");

if (savedEmail) {

    emailInput.value = savedEmail;

    document.getElementById("rememberEmail").checked = true;

}


// ==========================================
// FORM SUBMISSION
// ==========================================

if (form) {

    form.addEventListener("submit", adminLogin);

}


// ==========================================
// INITIALIZE
// ==========================================

checkExistingAdminSession();

console.log("BRJ ADMIN AUTHENTICATION INITIALIZED");

})();
