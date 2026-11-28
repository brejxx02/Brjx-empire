// ========================================
// BRJ EMPIRE - SECURE ADMIN AUTHENTICATION
// ========================================

(function(){

"use strict";

const LOGIN_PAGE = "admin.login.html";
const DASHBOARD_PAGE = "admin-dashboard.html";

const ALLOWED_ROLES = ["admin"];

const supabase = window.brjSupabase || window.supabaseClient;

const form = document.getElementById("adminLoginForm");
const emailInput = document.getElementById("adminEmail");
const passwordInput = document.getElementById("adminPassword");
const loginButton = document.getElementById("loginButton");
const messageBox = document.getElementById("message");
const togglePassword = document.getElementById("togglePassword");
const rememberEmail = document.getElementById("rememberEmail");

let processing = false;


// ========================================
// MESSAGE
// ========================================

function showMessage(message,type="error"){

    messageBox.textContent = message;
    messageBox.className = type;
    messageBox.style.display = "block";

}


// ========================================
// LOADING
// ========================================

function setLoading(value){

    loginButton.disabled = value;

    loginButton.textContent = value
        ? "VERIFYING ACCESS..."
        : "ACCESS ADMIN PANEL →";

}


// ========================================
// PASSWORD SHOW/HIDE
// ========================================

if(togglePassword){

    togglePassword.addEventListener("click",function(){

        const visible = passwordInput.type === "password";

        passwordInput.type = visible ? "text" : "password";

        togglePassword.textContent = visible ? "HIDE" : "SHOW";

    });

}


// ========================================
// REMEMBER EMAIL
// ========================================

try{

    const savedEmail = localStorage.getItem("brj_admin_email");

    if(savedEmail){

        emailInput.value = savedEmail;
        rememberEmail.checked = true;

    }

}catch(error){

    console.warn("Local storage unavailable.");

}


// ========================================
// ADMIN ROLE VERIFICATION
// ========================================

async function verifyAdmin(userId){

    const {data,error} = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id",userId)
        .maybeSingle();

    if(error){

        console.error("ROLE ERROR:",error);

        throw new Error(
            "Role verification failed: " + error.message
        );

    }

    if(!data || !ALLOWED_ROLES.includes(data.role)){

        throw new Error(
            "Access denied. This account is not an authorized Admin."
        );

    }

    return true;

}


// ========================================
// LOGIN
// ========================================

async function adminLogin(event){

    event.preventDefault();

    if(processing) return;

    if(!supabase || !supabase.auth){

        showMessage("Supabase connection unavailable. Check supabase.js.");

        return;

    }

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if(!email || !password){

        showMessage("Please enter email and password.");

        return;

    }

    processing = true;
    setLoading(true);

    showMessage("Checking administrator credentials...","success");

    let authenticated = false;

    try{

        // STEP 1: LOGIN

        const {data,error} = await supabase.auth.signInWithPassword({

            email: email,
            password: password

        });

        if(error) throw error;

        if(!data.user){

            throw new Error("Login failed. User not found.");

        }

        authenticated = true;

        // STEP 2: VERIFY ADMIN ROLE

        await verifyAdmin(data.user.id);

        // STEP 3: REMEMBER EMAIL

        if(rememberEmail.checked){

            localStorage.setItem("brj_admin_email",email);

        }else{

            localStorage.removeItem("brj_admin_email");

        }

        // STEP 4: SUCCESS

        showMessage(
            "Admin verified. Opening control center...",
            "success"
        );

        console.log("BRJ ADMIN LOGIN SUCCESS");

        // STEP 5: REDIRECT

        window.location.replace(DASHBOARD_PAGE);

    }catch(error){

        console.error("BRJ ADMIN LOGIN ERROR:",error);

        // Only sign out after successful authentication
        // followed by failed role verification.

        if(authenticated){

            await supabase.auth.signOut();

        }

        showMessage(
            error.message || "Unable to login. Please try again."
        );

    }finally{

        processing = false;
        setLoading(false);

    }

}


// ========================================
// EXISTING SESSION CHECK
// ========================================

async function checkExistingSession(){

    if(!supabase || !supabase.auth){

        showMessage("Supabase connection unavailable.");

        return;

    }

    try{

        const {data,error} = await supabase.auth.getSession();

        if(error) throw error;

        if(!data.session) return;

        await verifyAdmin(data.session.user.id);

        window.location.replace(DASHBOARD_PAGE);

    }catch(error){

        console.error("SESSION CHECK:",error);

        // Do not silently destroy a session on a
        // temporary network or permission error.

        showMessage(
            "Session verification failed: " + error.message
        );

    }

}


// ========================================
// FORM EVENT
// ========================================

if(form){

    form.addEventListener("submit",adminLogin);

}


// ========================================
// START
// ========================================

checkExistingSession();

console.log("BRJ ADMIN AUTH SYSTEM READY");

})();
