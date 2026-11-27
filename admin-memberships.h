<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#080a10">

<title>BRJ EMPIRE | Membership Management</title>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="supabase.js"></script>

<style>
*{
margin:0;
padding:0;
box-sizing:border-box;
font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;
}

:root{
--bg:#080a10;
--card:#111823;
--gold:#e6bb58;
--light:#ffe29a;
--text:#f5f6f8;
--muted:#8994a6;
--border:#222d3b;
--green:#4cda9a;
--red:#ff6d78;
--blue:#66aaff;
}

body{
background:var(--bg);
color:var(--text);
min-height:100vh;
}

button,input,select{font-family:inherit}

.topbar{
min-height:75px;
padding:15px 25px;
background:#0c111a;
border-bottom:1px solid var(--border);
display:flex;
align-items:center;
justify-content:space-between;
gap:15px;
}

.brand{
display:flex;
align-items:center;
gap:12px;
}

.logo{
width:43px;
height:43px;
border-radius:13px;
background:linear-gradient(145deg,#ffe7a9,#b9872c);
display:flex;
align-items:center;
justify-content:center;
font-weight:1000;
color:#17120a;
}

.brand-name{
font-size:17px;
font-weight:950;
}

.brand-name span{color:var(--gold)}

.brand-sub{
font-size:9px;
color:var(--muted);
letter-spacing:2px;
margin-top:4px;
}

.top-actions{
display:flex;
gap:10px;
}

.btn{
border:1px solid var(--border);
background:#ffffff08;
color:white;
padding:10px 14px;
border-radius:9px;
font-size:11px;
font-weight:800;
cursor:pointer;
text-decoration:none;
}

.btn.gold-btn{
background:#e6bb5815;
border-color:#e6bb5840;
color:var(--gold);
}

.container{
max-width:1450px;
margin:auto;
padding:28px 22px;
}

.heading{
display:flex;
justify-content:space-between;
align-items:center;
gap:15px;
margin-bottom:23px;
}

.heading h1{
font-size:25px;
font-weight:900;
}

.heading h1 span{color:var(--gold)}

.heading p{
font-size:11px;
color:var(--muted);
margin-top:7px;
}

.stats{
display:grid;
grid-template-columns:repeat(3,1fr);
gap:16px;
margin-bottom:22px;
}

.stat{
background:linear-gradient(145deg,#141d2a,#0e141e);
border:1px solid var(--border);
border-radius:15px;
padding:20px;
}

.stat-label{
font-size:10px;
color:var(--muted);
font-weight:800;
}

.stat-value{
font-size:29px;
font-weight:950;
margin-top:15px;
}

.gold{color:var(--gold)}
.green{color:var(--green)}
.red{color:var(--red)}

.panel{
background:linear-gradient(145deg,#121a26,#0d131d);
border:1px solid var(--border);
border-radius:16px;
overflow:hidden;
}

.panel-header{
padding:19px;
border-bottom:1px solid var(--border);
}

.panel-title{
font-size:14px;
font-weight:900;
}

.panel-sub{
font-size:10px;
color:var(--muted);
margin-top:5px;
}

.filters{
padding:18px;
display:flex;
gap:10px;
flex-wrap:wrap;
border-bottom:1px solid var(--border);
}

.input,.select{
min-height:42px;
padding:0 13px;
background:#080d15;
border:1px solid var(--border);
border-radius:9px;
color:white;
outline:none;
font-size:11px;
}

.input{
flex:1;
min-width:180px;
}

.select{min-width:145px}

.input:focus,.select:focus{
border-color:var(--gold);
}

.table-wrap{overflow-x:auto}

table{
width:100%;
border-collapse:collapse;
min-width:850px;
}

th{
text-align:left;
padding:15px;
font-size:9px;
letter-spacing:.8px;
color:var(--muted);
border-bottom:1px solid var(--border);
white-space:nowrap;
}

td{
padding:15px;
font-size:11px;
border-bottom:1px solid #ffffff08;
white-space:nowrap;
}

tr:last-child td{border-bottom:0}

.member-id{
color:var(--gold);
font-weight:900;
}

.package{
color:var(--light);
font-weight:800;
}

.amount{
color:var(--green);
font-weight:900;
}

.badge{
display:inline-block;
padding:6px 9px;
border-radius:7px;
font-size:9px;
font-weight:900;
}

.active{
background:#56d59b15;
color:var(--green);
}

.cancelled{
background:#ff6d7815;
color:var(--red);
}

.empty{
text-align:center;
padding:35px;
color:var(--muted);
}

.pagination{
display:flex;
justify-content:space-between;
align-items:center;
padding:16px 19px;
border-top:1px solid var(--border);
gap:10px;
}

.page-info{
font-size:10px;
color:var(--muted);
}

.page-buttons{
display:flex;
gap:8px;
}

#notice{
display:none;
padding:13px 15px;
margin-bottom:17px;
border-radius:9px;
font-size:11px;
line-height:1.5;
}

#notice.error{
display:block;
background:#ff6d7812;
border:1px solid #ff6d7840;
color:#ff929a;
}

#notice.success{
display:block;
background:#56d59b12;
border:1px solid #56d59b40;
color:var(--green);
}

.footer{
text-align:center;
padding:25px;
font-size:10px;
color:#566174;
}

@media(max-width:650px){

.topbar{
padding:13px;
}

.brand-name{font-size:14px}

.top-actions{
gap:5px;
}

.btn{
padding:9px;
font-size:9px;
}

.container{
padding:20px 12px;
}

.heading h1{font-size:21px}

.stats{
grid-template-columns:1fr;
gap:10px;
}

.stat{
padding:16px;
}

.stat-value{
font-size:25px;
}

.filters{
padding:13px;
}

.input,.select{
width:100%;
}

.pagination{
align-items:flex-start;
flex-direction:column;
}

}
</style>
</head>

<body>

<header class="topbar">

<div class="brand">

<div class="logo">BRJ</div>

<div>
<div class="brand-name">BRJ <span>EMPIRE</span></div>
<div class="brand-sub">MEMBERSHIP MANAGEMENT</div>
</div>

</div>

<div class="top-actions">

<a href="admin-dashboard.html" class="btn">← DASHBOARD</a>

<button class="btn gold-btn" id="logoutBtn">LOGOUT ↗</button>

</div>

</header>

<main class="container">

<div id="notice"></div>

<div class="heading">

<div>
<h1>Membership <span>Management</span></h1>
<p>Monitor member purchases and membership activity.</p>
</div>

<button class="btn gold-btn" id="refreshBtn">↻ REFRESH</button>

</div>

<!-- STATISTICS -->

<div class="stats">

<div class="stat">
<div class="stat-label">TOTAL MEMBERSHIPS</div>
<div class="stat-value gold" id="totalCount">—</div>
</div>

<div class="stat">
<div class="stat-label">ACTIVE MEMBERSHIPS</div>
<div class="stat-value green" id="activeCount">—</div>
</div>

<div class="stat">
<div class="stat-label">CANCELLED MEMBERSHIPS</div>
<div class="stat-value red" id="cancelledCount">—</div>
</div>

</div>

<!-- MEMBERSHIP TABLE -->

<section class="panel">

<div class="panel-header">

<div class="panel-title">All Membership Purchases</div>

<div class="panel-sub">
Official Member IDs · Purchase History · Activation · Expiry
</div>

</div>

<div class="filters">

<input
type="text"
class="input"
id="searchInput"
placeholder="Search Member ID or Package..."
>

<select class="select" id="statusFilter">

<option value="">All Statuses</option>
<option value="ACTIVE">Active</option>
<option value="CANCELLED">Cancelled</option>

</select>

<button class="btn gold-btn" id="searchBtn">SEARCH</button>

</div>

<div class="table-wrap">

<table>

<thead>

<tr>
<th>MEMBER ID</th>
<th>PACKAGE</th>
<th>AMOUNT</th>
<th>STATUS</th>
<th>ACTIVATED</th>
<th>EXPIRES</th>
<th>PURCHASE DATE</th>
</tr>

</thead>

<tbody id="membershipRows">

<tr>
<td colspan="7" class="empty">Loading memberships...</td>
</tr>

</tbody>

</table>

</div>

<div class="pagination">

<div class="page-info" id="pageInfo">
Loading records...
</div>

<div class="page-buttons">

<button class="btn" id="prevBtn">← PREVIOUS</button>

<button class="btn gold-btn" id="nextBtn">NEXT →</button>

</div>

</div>

</section>

<div class="footer">
BRJ EMPIRE © 2026 · MEMBERSHIP MANAGEMENT
</div>

</main>

<script>

/* BRJ MEMBERSHIP MANAGEMENT */

const DB=window.supabaseClient;

const $=id=>document.getElementById(id);

const PAGE_SIZE=50;

let currentPage=0;
let totalRecords=0;
let searchValue="";
let statusValue="";

/* HELPERS */

function escapeHTML(value){

return String(value??"").replace(/[&<>"']/g,char=>({
"&":"&amp;",
"<":"&lt;",
">":"&gt;",
'"':"&quot;",
"'":"&#39;"
}[char]));

}

function formatNumber(value){

return Number(value||0).toLocaleString("en-IN");

}

function formatDate(value){

if(!value) return "—";

const date=new Date(value);

if(isNaN(date.getTime())) return "—";

return date.toLocaleDateString("en-IN",{
day:"2-digit",
month:"short",
year:"numeric"
});

}

function notice(message,type="error"){

$("notice").textContent=message;
$("notice").className=type;
$("notice").style.display="block";

}

function clearNotice(){

$("notice").style.display="none";

}

/* AUTHENTICATION */

async function verifyAdmin(){

if(!DB||!DB.auth){

throw new Error("Supabase client not configured.");

}

const {data,error}=await DB.auth.getSession();

if(error) throw error;

if(!data.session){

location.replace("admin.login.html");
return false;

}

const user=data.session.user;

const {data:roles,error:roleError}=await DB
.from("user_roles")
.select("role")
.eq("user_id",user.id);

if(roleError){

throw new Error("Admin verification failed: "+roleError.message);

}

const roleList=(roles||[]).map(item=>
String(item.role||"").toLowerCase()
);

const allowed=
roleList.includes("admin")||
roleList.includes("main_admin")||
roleList.includes("sub_admin")||
roleList.includes("subadmin");

if(!allowed){

await DB.auth.signOut();
location.replace("admin.login.html");

return false;

}

return true;

}

/* STATISTICS */

async function loadStats(){

const [
total,
active,
cancelled
]=await Promise.all([

DB.from("member_package_purchases")
.select("*",{count:"exact",head:true}),

DB.from("member_package_purchases")
.select("*",{count:"exact",head:true})
.eq("purchase_status","ACTIVE"),

DB.from("member_package_purchases")
.select("*",{count:"exact",head:true})
.eq("purchase_status","CANCELLED")

]);

if(total.error) throw total.error;
if(active.error) throw active.error;
if(cancelled.error) throw cancelled.error;

$("totalCount").textContent=formatNumber(total.count);
$("activeCount").textContent=formatNumber(active.count);
$("cancelledCount").textContent=formatNumber(cancelled.count);

}

/* LOAD MEMBERSHIPS */

async function loadMemberships(){

clearNotice();

$("membershipRows").innerHTML=
'<tr><td colspan="7" class="empty">Loading records...</td></tr>';

let query=DB
.from("member_package_purchases")
.select(`
id,
member_id,
package_name,
purchase_amount,
purchase_status,
activated_at,
expires_at,
created_at
`,{count:"exact"});

/* STATUS FILTER */

if(statusValue){

query=query.eq("purchase_status",statusValue);

}

/* SEARCH FILTER */

if(searchValue){

if(/^\d+$/.test(searchValue)){

query=query.eq("member_id",Number(searchValue));

}else{

query=query.ilike("package_name","%"+searchValue+"%");

}

}

const from=currentPage*PAGE_SIZE;
const to=from+PAGE_SIZE-1;

const {data,error,count}=await query
.order("created_at",{ascending:false})
.range(from,to);

if(error) throw error;

totalRecords=count||0;

const rows=data||[];

if(rows.length===0){

$("membershipRows").innerHTML=
'<tr><td colspan="7" class="empty">No membership records found.</td></tr>';

}else{

$("membershipRows").innerHTML=rows.map(item=>{

const status=String(item.purchase_status||"").toUpperCase();

const badge=status==="ACTIVE"?"active":"cancelled";

return `

<tr>

<td class="member-id">
${escapeHTML(item.member_id)}
</td>

<td class="package">
${escapeHTML(item.package_name)}
</td>

<td class="amount">
₹${Number(item.purchase_amount||0).toLocaleString("en-IN",{
minimumFractionDigits:2,
maximumFractionDigits:2
})}
</td>

<td>
<span class="badge ${badge}">
${escapeHTML(status)}
</span>
</td>

<td>${escapeHTML(formatDate(item.activated_at))}</td>

<td>${escapeHTML(formatDate(item.expires_at))}</td>

<td>${escapeHTML(formatDate(item.created_at))}</td>

</tr>

`;

}).join("");

}

const start=totalRecords===0?0:from+1;
const end=Math.min(from+rows.length,totalRecords);

$("pageInfo").textContent=
"Showing "+start+"–"+end+" of "+formatNumber(totalRecords)+" records";

$("prevBtn").disabled=currentPage===0;
$("nextBtn").disabled=end>=totalRecords;

$("prevBtn").style.opacity=currentPage===0?".4":"1";
$("nextBtn").style.opacity=end>=totalRecords?".4":"1";

}

/* REFRESH EVERYTHING */

async function refreshAll(){

$("refreshBtn").textContent="↻ LOADING...";

try{

await Promise.all([
loadStats(),
loadMemberships()
]);

}catch(error){

console.error(error);

notice("Membership data error: "+error.message);

}

$("refreshBtn").textContent="↻ REFRESH";

}

/* SEARCH */

$("searchBtn").addEventListener("click",async()=>{

searchValue=$("searchInput").value.trim();
statusValue=$("statusFilter").value;

currentPage=0;

try{

await loadMemberships();

}catch(error){

notice(error.message);

}

});

$("searchInput").addEventListener("keydown",event=>{

if(event.key==="Enter"){

$("searchBtn").click();

}

});

$("statusFilter").addEventListener("change",async()=>{

statusValue=$("statusFilter").value;
currentPage=0;

try{

await loadMemberships();

}catch(error){

notice(error.message);

}

});

/* PAGINATION */

$("prevBtn").addEventListener("click",async()=>{

if(currentPage===0) return;

currentPage--;

try{

await loadMemberships();

}catch(error){

notice(error.message);

}

});

$("nextBtn").addEventListener("click",async()=>{

if((currentPage+1)*PAGE_SIZE>=totalRecords) return;

currentPage++;

try{

await loadMemberships();

}catch(error){

notice(error.message);

}

});

/* REFRESH */

$("refreshBtn").addEventListener("click",refreshAll);

/* LOGOUT */

$("logoutBtn").addEventListener("click",async()=>{

if(!confirm("Are you sure you want to logout?")) return;

const {error}=await DB.auth.signOut();

if(error){

notice(error.message);
return;

}

location.replace("admin.login.html");

});

/* START */

(async()=>{

try{

const verified=await verifyAdmin();

if(!verified) return;

await refreshAll();

}catch(error){

console.error(error);

notice(error.message);

}

})();

</script>

</body>
</html>
