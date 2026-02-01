let courses = JSON.parse(localStorage.getItem("courses")) || [];

const creditData = {
  5: { total: 27, safe: 5 },
  4: { total: 20, safe: 4 },
  3: { total: 14, safe: 3 },
  2: { total: 14, safe: 2 }
};

// Roast pools by severity (NO slurs, but yes swearing)
const roasts = {
  mild: [
    "Skipping already? Damn, that was fast.",
    "Wow. First leave and you’re already testing fate.",
    "Bold move. Questionable, but bold.",
    "Nice. Attendance just sighed."
  ],
  medium: [
    "Again? Bro, this isn’t Netflix.",
    "You’re treating classes like optional DLC. Dumb.",
    "At this rate, even your alarm hates you.",
    "You sure this degree is what you want? Because your actions say otherwise."
  ],
  savage: [
    "Congratulations, dumbass. Attendance is bleeding.",
    "This is exactly how GPAs die. Slowly. Because of you.",
    "You’re not unlucky. You’re just irresponsible as hell.",
    "One more leave and future-you will want to slap present-you."
  ],
  nuclear: [
    "Holy shit. Stop skipping or just drop out already.",
    "This isn’t freedom, it’s you being lazy as fuck.",
    "Attendance is on life support. And you pulled the plug.",
    "If excuses were credits, you’d graduate with honors. Sadly, reality exists."
  ]
};

function addCourse() {
  if (!semester.value || !courseName.value || !credits.value) {
    alert("Fill all fields");
    return;
  }

  courses.push({
    sem: semester.value,
    name: courseName.value,
    credit: credits.value,
    leaves: 0
  });

  save();
}

function takeLeave(i) {
  courses[i].leaves++;
  showRoast(courses[i]);
  save();
}

function undoLeave(i) {
  if (courses[i].leaves > 0) {
    courses[i].leaves--;
    save();
  }
}

function calculate(c) {
  const { total, safe } = creditData[c.credit];
  const attended = total - c.leaves;
  const percent = (attended / total) * 100;
  const extra = Math.max(0, c.leaves - safe);
  const deduction = extra > 0 ? Math.ceil(extra / safe) * 0.5 : 0;

  return { percent, deduction, remaining: safe - c.leaves };
}

function pickRoast(severity) {
  const pool = roasts[severity];
  return pool[Math.floor(Math.random() * pool.length)];
}

function showRoast(course) {
  const s = calculate(course);
  let severity = "mild";

  if (s.percent < 85 && s.percent >= 80) severity = "medium";
  else if (s.percent < 80 && s.percent >= 70) severity = "savage";
  else if (s.percent < 70) severity = "nuclear";

  document.getElementById("emoji").textContent =
    severity === "nuclear" ? "💀" :
    severity === "savage" ? "😡" :
    severity === "medium" ? "😒" : "😔";

  document.getElementById("roastText").textContent = pickRoast(severity);
  document.getElementById("roastBox").classList.remove("hidden");
}

function closeRoast() {
  document.getElementById("roastBox").classList.add("hidden");
}

function render() {
  const div = document.getElementById("courses");
  div.innerHTML = "";

  courses.forEach((c, i) => {
    const s = calculate(c);
    const danger = s.percent < 80 ? "bad" : "";

    div.innerHTML += `
      <div class="course-card">
        <h3>${c.name} (${c.credit} credits)</h3>
        <p>${c.sem}</p>
        <p>Leaves taken: ${c.leaves}</p>
        <p class="${danger}">Attendance: ${s.percent.toFixed(1)}%</p>
        <p>Safe leaves left: ${Math.max(0, s.remaining)}</p>
        <p>GPA Deduction: ${s.deduction}</p>
        <div class="buttons">
          <button class="leave" onclick="takeLeave(${i})">➖ Took a Leave</button>
          <button class="undo" onclick="undoLeave(${i})">↩️ Undo</button>
        </div>
      </div>
    `;
  });

  renderSummary();
}

function renderSummary() {
  const sum = {};
  courses.forEach(c => {
    const s = calculate(c);
    sum[c.sem] = (sum[c.sem] || 0) + s.deduction;
  });

  document.getElementById("summary").innerHTML =
    "<h3>📊 Semester Damage Report</h3>" +
    Object.entries(sum)
      .map(([k,v]) => `<p>${k}: GPA loss <strong>${v}</strong></p>`)
      .join("");
}

function save() {
  localStorage.setItem("courses", JSON.stringify(courses));
  render();
}

render();
