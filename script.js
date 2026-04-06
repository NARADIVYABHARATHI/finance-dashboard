// ==========================
// DEFAULT DATA
// ==========================
let transactions = JSON.parse(localStorage.getItem("transactions")) || [
  {id:1,desc:"Salary",amount:100000,type:"income"},
  {id:2,desc:"Rent",amount:25000,type:"expense"},
  {id:3,desc:"Food",amount:12000,type:"expense"},
  {id:4,desc:"Transport",amount:5000,type:"expense"},
  {id:5,desc:"Shopping",amount:8000,type:"expense"},
  {id:6,desc:"Entertainment",amount:5000,type:"expense"}
];

const categoryColors = {
  Rent:"#6366F1",
  Food:"#F59E0B",
  Transport:"#06B6D4",
  Shopping:"#EC4899",
  Entertainment:"#10B981"
};

// ==========================
// FORMAT INR
// ==========================
function formatCurrency(a){
  return new Intl.NumberFormat('en-IN',{
    style:'currency',
    currency:'INR'
  }).format(a);
}

// ==========================
// PAGE SWITCH (FIXED 🔥)
// ==========================
function showPage(p){
  document.getElementById("dashboardPage").style.display="none";
  document.getElementById("transactionsPage").style.display="none";
  document.getElementById("analyticsPage").style.display="none";
  document.getElementById("reportsPage").style.display="none";
  document.getElementById("goalsPage").style.display="none";

  document.getElementById(p+"Page").style.display="block";
}

// ==========================
// ADD TRANSACTION (FIXED INPUT 🔥)
// ==========================
function addTransaction(){
  const descVal = document.getElementById("desc").value;
  const amountVal = +document.getElementById("amount").value;
  const typeVal = document.getElementById("type").value;

  if(!descVal || !amountVal) return;

  transactions.push({
    id: Date.now(),
    desc: descVal,
    amount: amountVal,
    type: typeVal
  });

  save(); render(); update();

  // clear fields
  document.getElementById("desc").value = "";
  document.getElementById("amount").value = "";
}

// ==========================
// DELETE
// ==========================
function deleteTransaction(id){
  transactions = transactions.filter(t=>t.id!==id);
  save(); render(); update();
}

// ==========================
// SAVE
// ==========================
function save(){
  localStorage.setItem("transactions",JSON.stringify(transactions));
}

// ==========================
// RENDER LIST
// ==========================
function render(){
  const list = document.getElementById("transactionList");
  list.innerHTML="";

  transactions.forEach(t=>{
    const li=document.createElement("li");
    li.innerHTML=`${t.desc} - ₹${t.amount}
    <button onclick="deleteTransaction(${t.id})">❌</button>`;
    list.appendChild(li);
  });
}

// ==========================
// CHARTS
// ==========================
const pieChart=new Chart(document.getElementById("pieChart"),{
  type:"doughnut",
  data:{labels:[],datasets:[{data:[],backgroundColor:[]}]}
});

const barChart=new Chart(document.getElementById("barChart"),{
  type:"bar",
  data:{
    labels:["March"],
    datasets:[
      {label:"Income",data:[0],backgroundColor:"#6366F1"},
      {label:"Expense",data:[0],backgroundColor:"#EF4444"}
    ]
  }
});

// ==========================
// ANALYTICS
// ==========================
const lineChart=new Chart(document.getElementById("lineChart"),{
  type:"line",
  data:{
    labels:["W1","W2","W3","W4"],
    datasets:[
      {label:"Income",data:[25000,25000,25000,25000],borderColor:"#6366F1"},
      {label:"Expense",data:[15000,12000,14000,14000],borderColor:"#EF4444"}
    ]
  }
});

const analyticsPie=new Chart(document.getElementById("analyticsPie"),{
  type:"doughnut",
  data:{
    labels:Object.keys(categoryColors),
    datasets:[{
      data:[25000,12000,5000,8000,5000],
      backgroundColor:Object.values(categoryColors)
    }]
  }
});

// ==========================
// REPORTS
// ==========================
const reportsPie = new Chart(document.getElementById("reportsPie"), {
  type: "doughnut",
  data: {
    labels: Object.keys(categoryColors),
    datasets: [{
      data: [25000,12000,5000,8000,5000],
      backgroundColor: Object.values(categoryColors)
    }]
  }
});

const reportsBar = new Chart(document.getElementById("reportsBar"), {
  type: "bar",
  data: {
    labels: ["March"],
    datasets: [
      { label: "Income", data: [100000], backgroundColor: "#6366F1" },
      { label: "Expense", data: [55000], backgroundColor: "#EF4444" }
    ]
  }
});

// ==========================
// UPDATE DASHBOARD
// ==========================
function update(){
  let income=0,expense=0,cat={};

  transactions.forEach(t=>{
    if(t.type==="income") income+=t.amount;
    else{
      expense+=t.amount;
      cat[t.desc]=(cat[t.desc]||0)+t.amount;
    }
  });

  // cards
  document.querySelectorAll(".amount")[0].textContent=formatCurrency(income-expense);
  document.querySelectorAll(".amount")[1].textContent=formatCurrency(income);
  document.querySelectorAll(".amount")[2].textContent=formatCurrency(expense);

  document.getElementById("savingsRate").textContent=
    income ? ((income-expense)/income*100).toFixed(1)+"%" : "0%";

  // bar
  barChart.data.datasets[0].data=[income];
  barChart.data.datasets[1].data=[expense];
  barChart.update();

  // pie
  pieChart.data.labels=Object.keys(cat);
  pieChart.data.datasets[0].data=Object.values(cat);
  pieChart.data.datasets[0].backgroundColor=
    Object.keys(cat).map(c=>categoryColors[c]||"#94a3b8");

  pieChart.update();

  // 🔥 update savings goal
  updateGoal(income, expense);
}

// ==========================
// GOAL FUNCTION
// ==========================
function updateGoal(income, expense){
  const savings = income - expense;
  const goal = 50000;

  const percent = Math.min((savings / goal) * 100, 100);

  document.getElementById("goalProgress").style.width = percent + "%";
  document.getElementById("goalText").textContent =
    `Saved ₹${savings} / ₹${goal}`;
}

// ==========================
// INIT
// ==========================
render();
update();

// ==========================
// DARK MODE
// ==========================
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("dark");
};
// ==========================
// 📤 EXPORT DATA (CSV)
// ==========================
function exportData() {

  if (transactions.length === 0) {
    alert("No data to export");
    return;
  }

  // CSV headers
  let csv = "Description,Amount,Type\n";

  // Add rows
  transactions.forEach(t => {
    csv += `${t.desc},${t.amount},${t.type}\n`;
  });

  // Create file
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  // Download
  const a = document.createElement("a");
  a.href = url;
  a.download = "finance_data.csv";
  a.click();

  window.URL.revokeObjectURL(url);
}
// ==========================
// PROFILE MODAL
// ==========================
function toggleProfile(){
  const modal = document.getElementById("profileModal");

  if(modal.style.display === "flex"){
    modal.style.display = "none";
  } else {
    modal.style.display = "flex";
  }
}