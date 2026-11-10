/* InternTrack – shared logic: data, auth guard, navbar/footer, page renderers */

// Demo data
const DEMO_APPS=[
 {id:1,company:'Petronas Digital',role:'Web Developer Intern',status:'Interview',date:'2026-07-03',city:'Kuala Lumpur'},
 {id:2,company:'Maybank Tech',role:'UI/UX Intern',status:'Applied',date:'2026-07-15',city:'Kuala Lumpur'},
 {id:3,company:'Grab Malaysia',role:'Frontend Intern',status:'Offer',date:'2026-06-20',city:'Petaling Jaya'},
 {id:4,company:'AirAsia Digital',role:'Data Analyst Intern',status:'Rejected',date:'2026-06-11',city:'Sepang'},
 {id:5,company:'Telekom Malaysia',role:'Systems Intern',status:'Applied',date:'2026-08-02',city:'Cyberjaya'},
 {id:6,company:'Shopee MY',role:'Content Management Intern',status:'Interview',date:'2026-08-09',city:'Kuala Lumpur'},
 {id:7,company:'Axiata',role:'Web Design Intern',status:'Rejected',date:'2026-05-28',city:'Kuala Lumpur'},
 {id:8,company:'MIMOS',role:'Software Intern',status:'Applied',date:'2026-08-21',city:'Kuala Lumpur'},
 {id:9,company:'Intel Malaysia',role:'QA Intern',status:'Offer',date:'2026-07-25',city:'Bayan Lepas'}
];
let APPS=[];
const COMPANIES=[
 {name:'Petronas Digital',industry:'Energy',city:'Kuala Lumpur',allowance:1500,open:3},
 {name:'Grab Malaysia',industry:'Tech',city:'Petaling Jaya',allowance:1800,open:5},
 {name:'Telekom Malaysia',industry:'Telecom',city:'Cyberjaya',allowance:1200,open:2},
 {name:'Intel Malaysia',industry:'Semiconductor',city:'Bayan Lepas',allowance:2000,open:4},
 {name:'Maybank Tech',industry:'Finance',city:'Kuala Lumpur',allowance:1400,open:2},
 {name:'Shopee MY',industry:'E-commerce',city:'Kuala Lumpur',allowance:1700,open:6}
];
const COLORS={Applied:'#3D5963',Interview:'#E4B23C',Offer:'#18764F',Rejected:'#B13D48'};
const BADGE={Applied:'status-applied',Interview:'status-interview',Offer:'status-offer',Rejected:'status-rejected'};

// Auth
const DEMO_USER={user:'NurFatihah',pass:'ims566',name:'NurFatihah'};
const USERS=[DEMO_USER];
const getUsers=()=>USERS.concat(JSON.parse(localStorage.getItem('it_users')||'[]')); // registered users persist in browser
const session=()=>{
 const stored=JSON.parse(sessionStorage.getItem('it_session')||'null');
 if(stored&&(stored.user==='student'||stored.name==='Aina Sofea')){
  const migrated={user:DEMO_USER.user,name:DEMO_USER.name};
  sessionStorage.setItem('it_session',JSON.stringify(migrated));
  return migrated;
 }
 return stored;
};
const applicationStorageKey=user=>`it_applications_${encodeURIComponent(user)}`;
function loadApplications(){
 const me=session();
 if(!me)return APPS=[];
 const saved=localStorage.getItem(applicationStorageKey(me.user));
 if(saved!==null)APPS=JSON.parse(saved);
 else APPS=me.user===DEMO_USER.user?DEMO_APPS.map(app=>({...app})):[];
 return APPS;
}
function saveApplications(){
 const me=session();
 if(me)localStorage.setItem(applicationStorageKey(me.user),JSON.stringify(APPS));
}
const logout=()=>{sessionStorage.removeItem('it_session');location.href='index.html'};

// Shared layout 
function layout(active){
 const me=session(); if(!me){location.href='index.html';return;}
 const links=[['dashboard.html','Dashboard'],['applications.html','Applications'],['companies.html','Companies']];
 const nameParts=me.name.trim().split(/\s+/);
 const initials=nameParts.map(part=>part[0]).join('').slice(0,2).toUpperCase();
 const current=links.find(link=>link[0]===active)?.[1]||'Dashboard';
 document.getElementById('nav').innerHTML=`
 <nav class="navbar navbar-expand-md navbar-dark" aria-label="Main navigation"><div class="container">
  <a class="navbar-brand fw-bold" href="dashboard.html"><span class="brand-mark" aria-hidden="true">&#9670;</span> InternTrack</a>
  <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu" aria-controls="menu" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
  <div class="collapse navbar-collapse" id="menu">
   <ul class="navbar-nav me-auto">${links.map(l=>`<li class="nav-item"><a class="nav-link ${l[0]===active?'active':''}" ${l[0]===active?'aria-current="page"':''} href="${l[0]}">${l[1]}</a></li>`).join('')}</ul>
   <div class="profile-area me-md-3"><span class="profile-avatar" aria-hidden="true">${initials}</span><span class="small">${me.name}</span></div>
   <button class="btn btn-outline-light btn-sm mt-3 mt-md-0" type="button" onclick="logout()"><i class="bi bi-box-arrow-right" aria-hidden="true"></i> Log out</button>
  </div></div></nav>
 <div class="breadcrumbs-wrap"><div class="container"><nav aria-label="Breadcrumb"><ol class="breadcrumb"><li class="breadcrumb-item"><a href="dashboard.html">Home</a></li><li class="breadcrumb-item active" aria-current="page">${current}</li></ol></nav></div></div>`;
 document.getElementById('footer').innerHTML=`
 <footer class="site-footer"><div class="container d-flex flex-wrap justify-content-between align-items-center gap-2">
  <p>&copy; 2026 InternTrack &ndash; IMS566 Individual Assignment</p>
  <p>Built with Bootstrap 5 &amp; Chart.js &middot; <a href="https://github.com/" target="_blank" rel="noopener">GitHub</a></p></div></footer>
 <div class="toast-container position-fixed bottom-0 end-0 p-3"><div id="appToast" class="toast border-0" role="status" aria-live="polite" aria-atomic="true"><div class="toast-body d-flex align-items-center gap-2"><i class="bi bi-check-circle-fill text-success" aria-hidden="true"></i><span id="toastMessage"></span></div></div></div>`;
}
const countBy=k=>APPS.reduce((o,a)=>(o[a[k]]=(o[a[k]]||0)+1,o),{});
function showToast(message){
 const toast=document.getElementById('appToast');
 if(!toast)return;
 document.getElementById('toastMessage').textContent=message;
 bootstrap.Toast.getOrCreateInstance(toast).show();
}

// Login / Register Page
function initLogin(){
 if(session()){location.href='dashboard.html';return;}
 const err=document.getElementById('err'), show=m=>{err.textContent=m;err.classList.remove('d-none')};
 document.querySelectorAll('.password-toggle').forEach(button=>button.addEventListener('click',()=>{
  const field=document.getElementById(button.dataset.passwordTarget);
  const visible=field.type==='password';
  field.type=visible?'text':'password';
  button.setAttribute('aria-pressed',String(visible));
  button.setAttribute('aria-label',visible?'Hide password':'Show password');
  button.innerHTML=`<i class="bi bi-eye${visible?'-slash':''}" aria-hidden="true"></i>`;
 }));
 document.getElementById('loginForm').addEventListener('submit',e=>{
  e.preventDefault();
  const u=document.getElementById('lu').value.trim(),p=document.getElementById('lp').value;
  if(!u||!p) return show('Enter both username and password.');
  const found=getUsers().find(x=>x.user===u&&x.pass===p);
  if(!found) return show('Incorrect username or password. Try the demo login shown on this page.');
  sessionStorage.setItem('it_session',JSON.stringify({user:found.user,name:found.name}));
  location.href='dashboard.html';
 });
 document.getElementById('regForm').addEventListener('submit',e=>{
  e.preventDefault();
  const list=JSON.parse(localStorage.getItem('it_users')||'[]');
  const name=document.getElementById('rn').value.trim();
  const username=document.getElementById('ru').value.trim();
  const password=document.getElementById('rp').value;
  if(!name||!username) return show('Fill in your name and a username.');
  if(password.length<6) return show('Password needs at least 6 characters.');
  if(getUsers().some(x=>x.user.toLowerCase()===username.toLowerCase())) return show('That username is taken. Choose another.');
  list.push({user:username,pass:password,name});
  localStorage.setItem('it_users',JSON.stringify(list));
  localStorage.setItem(applicationStorageKey(username),'[]');
  err.classList.add('d-none');
  document.getElementById('ok').classList.remove('d-none');
  document.querySelector('[data-bs-target="#tabLogin"]').click();
 });
}

// Dashboard 
function initDashboard(){
 layout('dashboard.html');
 const me=session();
 loadApplications();
 const now=new Date();
 const greeting=now.getHours()<12?'Good morning':now.getHours()<18?'Good afternoon':'Good evening';
 document.getElementById('dashboardName').textContent=me.name;
 document.getElementById('dashboardGreeting').textContent=greeting+',';
 document.getElementById('dashboardDate').textContent=now.toLocaleDateString('en-MY',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
 const c=countBy('status');
 document.getElementById('stats').innerHTML=[
  ['All','Total applications',APPS.length,'','bi-briefcase'],['Applied','Pending',c.Applied||0,'s2','bi-hourglass-split'],['Interview','Interviews',c.Interview||0,'s3','bi-calendar2-check'],['Offer','Offers',c.Offer||0,'s4','bi-award']
 ].map(s=>`<a class="panel stat stat-link ${s[3]}" href="applications.html${s[0]==='All'?'':'?status='+s[0]}" aria-label="View ${s[1].toLowerCase()}"><span class="stat-icon"><i class="bi ${s[4]}" aria-hidden="true"></i></span><span><span class="num">${s[2]}</span><span class="stat-label">${s[1]}</span><span class="stat-hint">View details <i class="bi bi-arrow-right" aria-hidden="true"></i></span></span></a>`).join('');
 const recentFilter=document.getElementById('recentFilter');
 const renderRecent=()=>{
  const filtered=APPS.filter(app=>recentFilter.value==='All'||app.status===recentFilter.value)
   .sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5);
  document.getElementById('recentCount').textContent=`Showing ${filtered.length} ${filtered.length===1?'application':'applications'}`;
  document.getElementById('recentBody').innerHTML=filtered.length?filtered.map(app=>`<tr><td class="fw-bold">${app.company}</td><td>${app.role}</td><td><span class="badge-st ${BADGE[app.status]}">${app.status}</span></td></tr>`).join(''):'<tr><td colspan="3"><div class="empty-state"><i class="bi bi-inbox" aria-hidden="true"></i>No applications in this stage yet.</div></td></tr>';
 };
 recentFilter.addEventListener('change',renderRecent);
 renderRecent();
 const interviews=APPS.filter(app=>app.status==='Interview');
 document.getElementById('upcomingList').innerHTML=interviews.length?interviews.map(app=>`<div class="tracker-item"><i class="bi bi-calendar-event" aria-hidden="true"></i><div><strong>${app.company}</strong><div class="small text-muted">Interview status recorded; no meeting date is listed.</div></div></div>`).join(''):'<div class="empty-state"><i class="bi bi-calendar2-x" aria-hidden="true"></i>No upcoming deadlines are tracked yet.</div>';
 const progress=document.getElementById('progressOverview');
 const completed=(c.Interview||0)+(c.Offer||0);
 const progressItems=[['Applications submitted',APPS.length,APPS.length],['Interview stage',c.Interview||0,APPS.length],['Offers received',c.Offer||0,APPS.length]];
 progress.innerHTML=progressItems.map(item=>`<div class="mb-3"><div class="d-flex justify-content-between gap-2 mb-2"><span>${item[0]}</span><strong>${item[1]}${item[2]===APPS.length&&item[0]==='Applications submitted'?'':' / '+item[2]}</strong></div><div class="progress" role="progressbar" aria-label="${item[0]}" aria-valuenow="${item[1]}" aria-valuemin="0" aria-valuemax="${Math.max(item[2],1)}"><div class="progress-bar" style="width:${Math.min(100,item[1]/Math.max(item[2],1)*100)}%"></div></div></div>`).join('')+`<p class="small mb-0">${completed} application${completed===1?' has':'s have'} progressed beyond the pending stage.</p>`;
 new Chart(document.getElementById('statusChart'),{type:'doughnut',
  data:{labels:Object.keys(c),datasets:[{data:Object.values(c),backgroundColor:Object.keys(c).map(k=>COLORS[k])}]},
  options:{maintainAspectRatio:false,plugins:{legend:{position:'bottom'}},onClick:(event,elements,chart)=>{
   if(elements.length)location.href=`applications.html?status=${encodeURIComponent(chart.data.labels[elements[0].index])}`;
  }}});
 const m={};APPS.forEach(a=>{const k=a.date.slice(0,7);m[k]=(m[k]||0)+1});
 const keys=Object.keys(m).sort();
 new Chart(document.getElementById('monthChart'),{type:'bar',
  data:{labels:keys,datasets:[{label:'Applications sent',data:keys.map(k=>m[k]),backgroundColor:'#173F37'}]},
  options:{maintainAspectRatio:false,scales:{y:{beginAtZero:true,ticks:{stepSize:1}}}}});
}

// Applications
function initApplications(){
 layout('applications.html');
 loadApplications();
 const searchInput=document.getElementById('search');
 const statusFilter=document.getElementById('filter');
 const companyFilter=document.getElementById('companyFilter');
 const dateFilter=document.getElementById('dateFilter');
 const sortSelect=document.getElementById('sort');
 const tbody=document.getElementById('tbody');
 const count=document.getElementById('count');
 const refreshFilters=()=>{
  const selectedCompany=companyFilter.value, selectedYear=dateFilter.value;
  companyFilter.innerHTML='<option value="All">All companies</option>';
  dateFilter.innerHTML='<option value="All">All dates</option>';
  [...new Set(APPS.map(app=>app.company))].sort().forEach(name=>companyFilter.add(new Option(name,name)));
  [...new Set(APPS.map(app=>app.date.slice(0,4)))].sort().reverse().forEach(year=>dateFilter.add(new Option(year,year)));
  if([...companyFilter.options].some(option=>option.value===selectedCompany))companyFilter.value=selectedCompany;
  if([...dateFilter.options].some(option=>option.value===selectedYear))dateFilter.value=selectedYear;
 };
 refreshFilters();
 const params=new URLSearchParams(location.search);
 const requestedCompany=params.get('company');
 if(requestedCompany)searchInput.value=requestedCompany;
 const requestedStatus=params.get('status');
 if(['Applied','Interview','Offer','Rejected'].includes(requestedStatus))statusFilter.value=requestedStatus;
 const modal=new bootstrap.Modal(document.getElementById('applicationModal'));
 const statusClass=status=>BADGE[status]||BADGE.Applied;
 const draw=()=>{
  const q=searchInput.value.trim().toLowerCase();
  const rows=APPS.filter(app=>(statusFilter.value==='All'||app.status===statusFilter.value)
    &&(companyFilter.value==='All'||app.company===companyFilter.value)
    &&(dateFilter.value==='All'||app.date.startsWith(dateFilter.value))
    &&(app.company+' '+app.role+' '+app.city).toLowerCase().includes(q));
  if(sortSelect.value==='oldest')rows.sort((a,b)=>a.date.localeCompare(b.date));
  else if(sortSelect.value==='company')rows.sort((a,b)=>a.company.localeCompare(b.company));
  else rows.sort((a,b)=>b.date.localeCompare(a.date));
  tbody.innerHTML=rows.length?rows.map(app=>`<tr><td class="fw-bold">${app.company}</td><td>${app.role}</td><td>${app.city}</td><td>${app.date}</td>
   <td><span class="badge-st ${statusClass(app.status)}">${app.status}</span></td><td><div class="application-actions"><button class="btn btn-outline-secondary" type="button" data-action="view" data-id="${app.id}" aria-label="View ${app.company} application"><i class="bi bi-eye" aria-hidden="true"></i> View</button><button class="btn btn-outline-primary" type="button" data-action="edit" data-id="${app.id}" aria-label="Edit ${app.company} application"><i class="bi bi-pencil" aria-hidden="true"></i> Edit</button><button class="btn btn-outline-danger" type="button" data-action="delete" data-id="${app.id}" aria-label="Delete ${app.company} application"><i class="bi bi-trash" aria-hidden="true"></i> Delete</button></div></td></tr>`).join('')
   :`<tr><td colspan="6"><div class="empty-state"><i class="bi bi-${APPS.length?'search':'briefcase'}" aria-hidden="true"></i>${APPS.length?'No applications match. Clear the search or filter.':'No applications yet. Add your first application to get started.'}</div></td></tr>`;
  count.textContent=rows.length+' of '+APPS.length+' shown';
 };
 const openApplication=(app,editing)=>{
  const creating=!app;
  const details=app||{company:'',role:'',city:'',date:'',status:'Applied'};
  document.getElementById('applicationModalTitle').textContent=creating?'Add application':editing?'Edit application':'Application details';
  document.getElementById('appId').value=app?app.id:'';
  document.getElementById('appCompany').value=details.company;
  document.getElementById('appRole').value=details.role;
  document.getElementById('appCity').value=details.city;
  document.getElementById('appDate').value=details.date;
  document.getElementById('appStatus').value=details.status;
  document.getElementById('appCompany').readOnly=!creating;
  document.getElementById('appRole').readOnly=!editing;
  document.getElementById('appCity').readOnly=!editing;
  document.getElementById('appDate').readOnly=!editing;
  document.getElementById('appStatus').disabled=!editing;
  document.getElementById('saveApplication').classList.toggle('d-none',!editing);
  document.getElementById('saveApplication').textContent=creating?'Add application':'Save changes';
  modal.show();
 };
 document.getElementById('addApplication').addEventListener('click',()=>openApplication(null,true));
 [searchInput,statusFilter,companyFilter,dateFilter,sortSelect].forEach(control=>control.addEventListener(control===searchInput?'input':'change',draw));
 tbody.addEventListener('click',event=>{
  const button=event.target.closest('button[data-action]');
  if(!button)return;
  const index=APPS.findIndex(app=>app.id===Number(button.dataset.id));
  if(index<0)return;
  const app=APPS[index];
  if(button.dataset.action==='view')openApplication(app,false);
  if(button.dataset.action==='edit')openApplication(app,true);
  if(button.dataset.action==='delete'&&confirm(`Delete the ${app.company} application?`)){
   APPS.splice(index,1);
   saveApplications();
   draw();
   showToast('Application deleted.');
  }
 });
 document.getElementById('applicationForm').addEventListener('submit',event=>{
  event.preventDefault();
  const id=document.getElementById('appId').value;
  let app=APPS.find(item=>item.id===Number(id));
  const creating=!id;
  if(creating)app={id:APPS.reduce((max,item)=>Math.max(max,item.id),0)+1};
  if(!app)return;
  app.company=document.getElementById('appCompany').value.trim();
  app.role=document.getElementById('appRole').value.trim();
  app.city=document.getElementById('appCity').value.trim();
  app.date=document.getElementById('appDate').value;
  app.status=document.getElementById('appStatus').value;
  if(creating){
   APPS.push(app);
   searchInput.value='';
   statusFilter.value='All';
   companyFilter.value='All';
   dateFilter.value='All';
   refreshFilters();
  }
  saveApplications();
  modal.hide();
  draw();
  showToast('Application updated.');
 });
 draw();
}

// Companies
function initCompanies(){
 layout('companies.html');
 const searchInput=document.getElementById('companySearch');
 const industryFilter=document.getElementById('industryFilter');
 [...new Set(COMPANIES.map(company=>company.industry))].sort().forEach(industry=>industryFilter.add(new Option(industry,industry)));
 const render=()=>{
  const query=searchInput.value.trim().toLowerCase();
  const companies=COMPANIES.filter(company=>(industryFilter.value==='All'||company.industry===industryFilter.value)
   &&(company.name+' '+company.industry+' '+company.city).toLowerCase().includes(query));
  document.getElementById('grid').innerHTML=companies.length?companies.map(company=>`<article class="panel company-card">
   <div class="company-card-top"><span class="company-avatar" aria-hidden="true">${company.name.charAt(0)}</span><div><h2>${company.name}</h2><p>${company.industry} &middot; ${company.city}</p></div></div>
   <div class="d-flex justify-content-between align-items-center"><span class="badge-st status-offer"><i class="bi bi-check-circle me-1" aria-hidden="true"></i>${company.open} open roles</span></div>
   <div class="company-meta"><span>Monthly allowance</span><strong>RM ${company.allowance.toLocaleString()}</strong></div>
   <div class="company-meta"><span>Location</span><strong>${company.city}</strong></div>
   <a class="btn btn-outline-primary mt-auto" href="applications.html?company=${encodeURIComponent(company.name)}"><i class="bi bi-briefcase" aria-hidden="true"></i> View applications</a>
  </article>`).join(''):'<div class="panel empty-state"><i class="bi bi-buildings" aria-hidden="true"></i>No companies match your search.</div>';
 };
 searchInput.addEventListener('input',render);
 industryFilter.addEventListener('change',render);
 render();
 new Chart(document.getElementById('allowChart'),{type:'bar',
  data:{labels:COMPANIES.map(c=>c.name),datasets:[{label:'Monthly allowance (RM)',data:COMPANIES.map(c=>c.allowance),backgroundColor:'#2A9D8F'}]},
  options:{maintainAspectRatio:false,indexAxis:'y',plugins:{legend:{display:false}}}});
}
