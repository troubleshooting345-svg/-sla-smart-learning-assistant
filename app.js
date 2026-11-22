const subjects = {
  "Biology": {icon:"🧬", topics:["Cell structure","Biomolecules"], questions:[
    {topic:"Cell structure",q:"Which organelle is primarily responsible for ATP production in eukaryotic cells?",o:["Ribosome","Mitochondrion","Golgi apparatus","Lysosome"],a:1,why:"Mitochondria are the main site of aerobic cellular respiration and ATP production."},
    {topic:"Cell structure",q:"Which structure controls the movement of substances into and out of a cell?",o:["Cell membrane","Nucleolus","Cell wall","Chromosome"],a:0,why:"The cell membrane is selectively permeable and regulates exchange."},
    {topic:"Cell structure",q:"Ribosomes are mainly involved in:",o:["Lipid storage","Protein synthesis","Photosynthesis","Cell movement"],a:1,why:"Ribosomes translate mRNA to build polypeptides."},
    {topic:"Biomolecules",q:"Which type of bond joins amino acids in a protein?",o:["Glycosidic","Peptide","Hydrogen","Phosphodiester"],a:1,why:"A peptide bond links the carboxyl group of one amino acid to the amino group of another."}
  ]},
  "Chemistry": {icon:"⚗️", topics:["Atomic structure","Chemical bonding"], questions:[
    {topic:"Atomic structure",q:"The atomic number of an element is equal to the number of:",o:["Neutrons","Protons","Protons + neutrons","Electron shells"],a:1,why:"Atomic number is the number of protons in the nucleus."},
    {topic:"Atomic structure",q:"Isotopes of an element have the same number of:",o:["Neutrons","Nucleons","Protons","Mass number"],a:2,why:"Isotopes have the same proton number but different neutron numbers."},
    {topic:"Chemical bonding",q:"An ionic bond is formed mainly by:",o:["Sharing electrons equally","Transfer of electrons","Sharing protons","Overlap of nuclei"],a:1,why:"Ionic bonding follows electron transfer and electrostatic attraction between ions."}
  ]},
  "Physics": {icon:"⚡", topics:["Motion","Waves"], questions:[
    {topic:"Motion",q:"The SI unit of acceleration is:",o:["m/s","m/s²","km/h","N"],a:1,why:"Acceleration is change in velocity per unit time, so its SI unit is m/s²."},
    {topic:"Motion",q:"Which quantity is a vector?",o:["Distance","Speed","Displacement","Time"],a:2,why:"Displacement has both magnitude and direction."},
    {topic:"Waves",q:"The number of complete oscillations per second is called:",o:["Amplitude","Wavelength","Frequency","Period"],a:2,why:"Frequency is the number of cycles per second and is measured in hertz."}
  ]},
  "Mathematics": {icon:"∑", topics:["Algebra","Functions"], questions:[
    {topic:"Algebra",q:"What is the value of 3² + 4²?",o:["12","25","49","7"],a:1,why:"3² + 4² = 9 + 16 = 25."},
    {topic:"Functions",q:"If f(x) = 2x + 1, what is f(3)?",o:["5","6","7","8"],a:2,why:"Substitute x = 3: f(3) = 2(3) + 1 = 7."}
  ]}
};
const $ = id => document.getElementById(id);
let profile = JSON.parse(localStorage.getItem("sla_profile") || "null");
let results = JSON.parse(localStorage.getItem("sla_results") || "[]");
let current = [], qIndex = 0, answers = [], selected = null, activeSubject = "Biology";

function save(){localStorage.setItem("sla_profile",JSON.stringify(profile));localStorage.setItem("sla_results",JSON.stringify(results))}
function show(view){
  document.querySelectorAll(".view").forEach(v=>v.classList.add("hidden"));
  $(view+"View").classList.remove("hidden");
  $("authView").classList.add("hidden");
  const titles={dashboard:"Dashboard",practice:"Practice quiz",results:"My results",assistant:"AI assistant"};
  $("pageTitle").textContent=titles[view];
  document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.view===view));
  document.querySelector(".sidebar").classList.remove("open");
  if(view==="dashboard")renderDashboard(); if(view==="results")renderResults();
}
function enter(){
  if(!profile){$("authView").classList.remove("hidden");document.querySelectorAll(".view").forEach(v=>v.classList.add("hidden"));$("logoutBtn").classList.add("hidden");return}
  $("authView").classList.add("hidden");$("logoutBtn").classList.remove("hidden");
  $("studentName").textContent=profile.name;$("classPill").textContent=profile.class;$("avatar").textContent=profile.name[0].toUpperCase();
  show("dashboard");
}
$("startBtn").onclick=()=>{const name=$("nameInput").value.trim();if(!name){alert("Please enter your name.");return}profile={name,class:$("classInput").value};save();enter()};
$("logoutBtn").onclick=()=>{profile=null;localStorage.removeItem("sla_profile");enter()};
document.querySelectorAll(".nav-btn").forEach(b=>b.onclick=()=>show(b.dataset.view));
document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>show(b.dataset.go));
$("menuBtn").onclick=()=>document.querySelector(".sidebar").classList.toggle("open");

function renderDashboard(){
  $("quizCount").textContent=results.length;
  const avg=results.length?Math.round(results.reduce((s,r)=>s+r.percent,0)/results.length)+"%":"—";
  $("averageScore").textContent=avg;
  $("bestScore").textContent=results.length?Math.max(...results.map(r=>r.percent))+"%":"—";
  $("subjectGrid").innerHTML=Object.entries(subjects).map(([name,s])=>`<button class="subject-card" data-subject="${name}"><span class="subject-emoji">${s.icon}</span><b>${name}</b><small>${s.topics.length} practice topics</small></button>`).join("");
  document.querySelectorAll("[data-subject]").forEach(b=>b.onclick=()=>{activeSubject=b.dataset.subject;show("practice");$("subjectSelect").value=activeSubject;updateTopics()});
  $("recentResults").innerHTML=results.slice(0,3).map(r=>`<div class="recent-item"><span>${r.subject} · ${r.topic}</span><span class="score">${r.percent}%</span></div>`).join("")||'<p class="muted">Your completed quizzes will appear here.</p>';
}
function fillSubjects(){
  $("subjectSelect").innerHTML=Object.keys(subjects).map(s=>`<option>${s}</option>`).join("");
  $("subjectSelect").value=activeSubject;updateTopics();
}
function updateTopics(){
  const s=subjects[$("subjectSelect").value];$("topicSelect").innerHTML=s.topics.map(t=>`<option>${t}</option>`).join("");
}
$("subjectSelect").onchange=()=>{activeSubject=$("subjectSelect").value;updateTopics()};
function startQuiz(){
  const subject=$("subjectSelect").value,topic=$("topicSelect").value,n=Number($("countSelect").value);
  const pool=subjects[subject].questions.filter(q=>q.topic===topic);
  if(!pool.length){alert("No sample questions for this topic yet.");return}
  current=[...pool].sort(()=>Math.random()-.5).slice(0,Math.min(n,pool.length));
  qIndex=0;answers=Array(current.length).fill(null);$("quizArea").classList.remove("hidden");renderQuestion();
}
$("beginQuiz").onclick=startQuiz;
function renderQuestion(){
  selected=answers[qIndex];
  const q=current[qIndex],progress=((qIndex)/current.length)*100;
  $("quizArea").innerHTML=`<div class="question-top"><span>QUESTION ${qIndex+1} OF ${current.length}</span><span>${Math.round(progress)}% completed</span></div><div class="progress"><span style="width:${progress}%"></span></div><div class="question">${q.q}</div><div class="options">${q.o.map((o,i)=>`<button class="option ${selected===i?"selected":""}" data-opt="${i}">${String.fromCharCode(65+i)}. &nbsp;${o}</button>`).join("")}</div><div class="quiz-actions"><button id="nextQuestion" class="primary" ${selected===null?"disabled":""}>${qIndex===current.length-1?"Submit quiz":"Next question →"}</button></div>`;
  document.querySelectorAll("[data-opt]").forEach(b=>b.onclick=()=>{selected=Number(b.dataset.opt);answers[qIndex]=selected;renderQuestion()});
  $("nextQuestion").onclick=()=>{if(selected===null)return;if(qIndex<current.length-1){qIndex++;renderQuestion()}else finishQuiz()};
}
function finishQuiz(){
  const correct=current.reduce((s,q,i)=>s+(answers[i]===q.a?1:0),0),percent=Math.round(correct/current.length*100);
  const subject=$("subjectSelect").value,topic=$("topicSelect").value;
  results.unshift({date:new Date().toLocaleDateString(),subject,topic,correct,total:current.length,percent,review:current.map((q,i)=>({q:q.q,chosen:answers[i],answer:q.a,why:q.why,options:q.o}))});
  save();
  $("quizArea").innerHTML=`<div class="result-hero"><div class="eyebrow">QUIZ COMPLETED</div><div class="result-number">${percent}%</div><h3>${correct} out of ${current.length} correct</h3><p>${percent>=80?"Excellent work! Keep it up.":percent>=50?"Good effort. Review the explanations below.":"Keep practising. Every attempt helps you improve."}</p><button id="backDash" class="primary">Back to dashboard →</button></div><hr style="border:0;border-top:1px solid #edf0f5;margin:20px 0"><h3>Answer review</h3>${current.map((q,i)=>`<div style="padding:14px 0;border-bottom:1px solid #edf0f5"><b style="font-size:13px">${i+1}. ${q.q}</b><p class="muted">Your answer: ${answers[i]===null?"Not answered":q.o[answers[i]]}</p><p class="score" style="font-size:12px">Correct answer: ${q.o[q.a]}</p><p class="muted">${q.why}</p></div>`).join("")}`;
  $("backDash").onclick=()=>show("dashboard");
}
function renderResults(){
  $("allResults").innerHTML=results.length?`<table><thead><tr><th>DATE</th><th>SUBJECT</th><th>TOPIC</th><th>SCORE</th><th>RESULT</th></tr></thead><tbody>${results.map(r=>`<tr><td>${r.date}</td><td>${r.subject}</td><td>${r.topic}</td><td>${r.correct}/${r.total}</td><td class="score">${r.percent}%</td></tr>`).join("")}</tbody></table>`:'<p class="muted">No quiz attempts yet. Complete a practice quiz to see your results.</p>';
}
$("clearResults").onclick=()=>{if(confirm("Clear all saved demo quiz results on this device?")){results=[];save();renderResults();renderDashboard()}};
$("chatForm").onsubmit=e=>{e.preventDefault();const val=$("chatInput").value.trim();if(!val)return;const box=$("chatMessages");box.insertAdjacentHTML("beforeend",`<div class="bubble user"></div>`);box.lastElementChild.textContent=val;box.insertAdjacentHTML("beforeend",'<div class="bubble bot">Thanks for your question! Live AI responses are not connected in this starter build. The next setup step is to connect a secure AI endpoint so your API key is never exposed in the app.</div>');$("chatInput").value="";box.scrollTop=box.scrollHeight};
fillSubjects();enter();
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));
