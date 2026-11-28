// ========================================
// BRJ EMPIRE - ADMIN AUTHENTICATION
// ========================================

(function () {
"use strict";

const DASHBOARD_PAGE = "admin-dashboard.html";
const ALLOWED_ROLES = ["admin", "main_admin"];

const supabase = window.brjSupabase || window.supabaseClient;

const form = document.getElementById("adminLoginForm");
const emailInput = document.getElementById("adminEmail");
const passwordInput = document.getElementById("adminPassword");
const loginButton = document.getElementById("loginButton");
const messageBox = document.getElementById("message");
const togglePassword = document.getElementById("togglePassword");
const rememberEmail = document.getElementById("rememberEmail");

let processing = false;

function showMessage(message, type = "error") {
    messageBox.textContent = message;
    messageBox.className = type;
    messageBox.style.display = "block";
}

function setLoading(value) {
    loginButton.disabled = value;
    loginButton.textContent = value
        ? "VERIFYING ACCESS..."
        : "ACCESS ADMIN PANEL →";
}

if (togglePassword) {
    togglePassword.addEventListener("click", function () {
        const visible = passwordInput.type === "password";
        passwordInput.type = visible ? "text" : "password";
        togglePassword.textContent = visible ? "HIDE" : "SHOW";
    });
}

try {
    const savedEmail = localStorage.getItem("brj_admin_email");

    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberEmail.checked = true;
    }
} catch (e) {}

async function verifyAdmin(userId) {
    const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();

    if (error) throw error;

    if (!data || !ALLOWED_ROLES.includes(data.role)) {
        throw new Error("Access denied. Unauthorized administrator.");
    }

    return true;
}

async function adminLogin(event) {
    event.preventDefault();

    if (processing) return;

    if (!supabase || !supabase.auth) {
        showMessage("Supabase connection unavailable.");
        return;
    }

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    if (!email || !password) {
        showMessage("Enter email and password.");
        return;
    }

    processing = true;
    setLoading(true);

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            throw error;
        }

        if (!data.user) {
            throw new Error("Authentication failed.");
        }

        await verifyAdmin(data.user.id);

        if (rememberEmail.checked) {
            localStorage.setItem("brj_admin_email", email);
        } else {
            localStorage.removeItem("brj_admin_email");
        }

        showMessage("Admin verified. Redirecting...", "success");

        window.location.replace(DASHBOARD_PAGE);

    } catch (error) {
        console.error("BRJ LOGIN ERROR:", error);

        showMessage(error.message || "Login failed.");

        // Sign out only if authentication succeeded.
        // A role verification failure must not leave an unauthorized session.
        if (supabase.auth.getSession) {
            const { data } = await supabase.auth.getSession();

            if (data && data.session) {
                await supabase.auth.signOut();
            }
        }

    } finally {
        processing = false;
        setLoading(false);
    }
}

async function checkExistingSession() {
    if (!supabase || !supabase.auth) {
        showMessage("Supabase connection unavailable.");
        return;
    }

    try {
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (!data.session) return;

        await verifyAdmin(data.session.user.id);

        window.location.replace(DASHBOARD_PAGE);

    } catch (error) {
        console.error("SESSION ERROR:", error);
        showMessage("Session verification failed: " + error.message);
    }
}

form.addEventListener("submit", adminLogin);

checkExistingSession();

console.log("BRJ ADMIN AUTH READY");

})();
