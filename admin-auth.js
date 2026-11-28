// ========================================
// BRJ EMPIRE - MAIN ADMIN AUTHENTICATION
// ========================================

(function(){

"use strict";

const DASHBOARD_PAGE = "admin-dashboard.html";

const ALLOWED_ROLES = ["admin","main_admin"];

const MAIN_ADMIN_EMAIL = "rajeshkhant77612@gmail.com";

const supabase =
window.brjSupabase || window.supabaseClient;

const form = document.getElementById("adminLoginForm");
const emailInput = document.getElementById("adminEmail");
const passwordInput = document.getElementById("adminPassword");
const loginButton = document.getElementById("loginButton");
const messageBox = document.getElementById("message");
const togglePassword = document.getElementById("togglePassword");
const rememberEmail = document.getElementById("rememberEmail");

let processing = false;

function showMessage(message,type="error"){

messageBox.textContent = message;
messageBox.className = type;
messageBox.style.display = "block";

}

function setLoading(value){

loginButton.disabled = value;

loginButton.textContent = value
? "VERIFYING ACCESS..."
: "ACCESS ADMIN PANEL →";

}

// PASSWORD TOGGLE

togglePassword.addEventListener("click",function(){

const visible = passwordInput.type === "password";

passwordInput.type = visible ? "text" : "password";

togglePassword.textContent = visible ? "HIDE" : "SHOW";

});

// REMEMBER EMAIL

try{

const saved = localStorage.getItem("brj_admin_email");

if(saved){

emailInput.value = saved;
rememberEmail.checked = true;

}

}catch(e){}

// ROLE VERIFICATION

async function verifyAdmin(user){

if(!user){

throw new Error("Authenticated user not found.");

}

const email = (user.email || "").trim().toLowerCase();

const {data,error} = await supabase
.from("user_roles")
.select("role")
.eq("user_id",user.id)
.maybeSingle();

if(error){

console.error("ROLE DATABASE ERROR:",error);

throw new Error(
"Role database error: " + error.message
);

}

if(!data){

throw new Error(
"Admin role record not found for this account."
);

}

const role = String(data.role || "")
.trim()
.toLowerCase();

console.log("BRJ AUTH EMAIL:",email);
console.log("BRJ AUTH ROLE:",role);

if(!ALLOWED_ROLES.includes(role)){

throw new Error(
"Unauthorized role: " + role
);

}

// Main Admin email protection

if(role === "main_admin" && email !== MAIN_ADMIN_EMAIL){

throw new Error(
"Main Admin email verification failed."
);

}

return true;

}

// LOGIN

async function adminLogin(event){

event.preventDefault();

if(processing)return;

if(!supabase || !supabase.auth){

showMessage("Supabase connection unavailable.");

return;

}

const email = emailInput.value.trim().toLowerCase();
const password = passwordInput.value;

if(!email || !password){

showMessage("Enter email and password.");

return;

}

processing = true;
setLoading(true);

let loginSucceeded = false;

try{

// AUTHENTICATION

const {data,error} = await supabase.auth.signInWithPassword({

email:email,
password:password

});

if(error)throw error;

if(!data.user){

throw new Error("User authentication failed.");

}

loginSucceeded = true;

// VERIFY ROLE

await verifyAdmin(data.user);

// SAVE EMAIL

try{

if(rememberEmail.checked){

localStorage.setItem("brj_admin_email",email);

}else{

localStorage.removeItem("brj_admin_email");

}

}catch(e){}

// SUCCESS

showMessage(
"Admin verified. Opening control center...",
"success"
);

console.log("BRJ ADMIN LOGIN SUCCESS");

window.location.replace(DASHBOARD_PAGE);

}catch(error){

console.error("BRJ ADMIN LOGIN ERROR:",error);

if(loginSucceeded){

await supabase.auth.signOut();

}

showMessage(error.message || "Login failed.");

}finally{

processing = false;
setLoading(false);

}

}

// EXISTING SESSION

async function checkExistingSession(){

if(!supabase || !supabase.auth){

showMessage("Supabase connection unavailable.");

return;

}

try{

const {data,error} = await supabase.auth.getSession();

if(error)throw error;

if(!data.session)return;

await verifyAdmin(data.session.user);

window.location.replace(DASHBOARD_PAGE);

}catch(error){

console.error("BRJ SESSION ERROR:",error);

showMessage(
"Session verification failed: " + error.message
);

}

}

// EVENTS

form.addEventListener("submit",adminLogin);

// START

console.log("BRJ ADMIN AUTH VERSION: 20261128");

checkExistingSession();

})();
