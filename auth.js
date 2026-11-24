// ======================================
// BRJ EMPIRE - AUTHENTICATION SYSTEM
// WITH AUTOMATIC MEMBER ID
// ======================================

function getSupabase() {
    return window.brjSupabase || window.supabaseClient || null;
}

// DASHBOARD REDIRECT
function goToDashboard() {
    window.location.href = "dashboard.html";
}

// SHOW MESSAGE
function showMessage(text) {
    const msg = document.getElementById("message");
    if (!msg) return;

    msg.innerText = text;
    msg.style.display = "block";
}

// ======================================
// GET MEMBER ID
// ======================================

async function getMemberID(userId) {

    const supabase = getSupabase();

    if (!supabase || !userId) {
        return null;
    }

    try {

        const { data, error } = await supabase
            .from("brj_member_ids")
            .select("member_id")
            .eq("user_id", userId)
            .maybeSingle();

        if (error) {
            console.error("Member ID error:", error);
            return null;
        }

        return data ? String(data.member_id) : null;

    } catch (error) {

        console.error("Member ID fetch failed:", error);

        return null;
    }
}

// ======================================
// SHOW LOGIN
// ======================================

function showLogin() {

    document.getElementById("loginForm").classList.remove("hidden");
    document.getElementById("registerForm").classList.add("hidden");

    document.getElementById("loginTab").classList.add("active");
    document.getElementById("registerTab").classList.remove("active");

    document.getElementById("message").style.display = "none";
}

// ======================================
// SHOW REGISTER
// ======================================

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

    if (button) {
        button.disabled = true;
        button.innerText = "CREATING ACCOUNT...";
    }

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

        // ======================================
        // REGISTRATION SUCCESS
        // ======================================

        if (data.session && data.user) {

            showMessage("Account created! Fetching your Member ID...");

            const memberID = await getMemberID(data.user.id);

            if (memberID) {

                showMessage(
                    "Registration Successful! Your BRJ Member ID: " + memberID
                );

            } else {

                showMessage(
                    "Account created successfully. Your Member ID will be available after database verification."
                );

            }

            setTimeout(goToDashboard, 2500);

        } else {

            showMessage(
                "Registration successful! Please verify your email, then sign in to view your Member ID."
            );

        }

        const registerFormElement =
            document.querySelector("#registerForm form");

        if (registerFormElement) {
            registerFormElement.reset();
        }

    } catch (error) {

        console.error("Registration error:", error);

        showMessage(error.message || "Registration failed.");

    } finally {

        if (button) {

            button.disabled = false;
            button.innerText = "CREATE ACCOUNT";

        }

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
        return;
    }

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    const button = event.submitter;

    if (button) {
        button.disabled = true;
        button.innerText = "SIGNING IN...";
    }

    try {

        const { data, error } = await supabase.auth.signInWithPassword({

            email: email,
            password: password

        });

        if (error) throw error;

        // FETCH MEMBER ID

        const memberID = await getMemberID(data.user.id);

        if (memberID) {

            showMessage(
                "Login successful! Your Member ID: " + memberID
            );

        } else {

            showMessage(
                "Login successful! Opening your account..."
            );

        }

        console.log("Login successful:", data.user);

        console.log("BRJ Member ID:", memberID);

        setTimeout(goToDashboard, 1800);

    } catch (error) {

        console.error("Login error:", error);

        showMessage(error.message || "Login failed.");

    } finally {

        if (button) {

            button.disabled = false;
            button.innerText = "SIGN IN";

        }

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

            const memberID = await getMemberID(
                data.session.user.id
            );

            console.log("BRJ Member ID:", memberID);

        }

    } catch (error) {

        console.error("Session error:", error.message);

    }

}

// ======================================
// INITIALIZE
// ======================================

document.addEventListener("DOMContentLoaded", checkSession);
