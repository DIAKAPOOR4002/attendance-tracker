let courses = JSON.parse(localStorage.getItem("courses")) || [];

const creditData = {
  5: { total: 27, leaves: 5 },
  4: { total: 20, leaves: 4 },
  3: { total: 14, leaves: 3 },
  2: { total: 14, leaves: 2 }
};

function addCourse() {
  const sem = semester.value;
  const name = courseName.value;
  const credit = credits.value;

  if (!sem || !name || !credit) {
    alert("Fill all fields");
    return;
  }

  courses.push({ sem, name, credit, attended: 0 });
  saveAndRender();
}

function calculate(course) {
  const { total, leaves } = creditData[course.credit];
  const attended = course.attended;
  const percentage = (attended / total) * 100;
  const minClasses = total - leaves;

  let extraMissed = Math.max(0, minClasses - attended);
  let deduction = extraMissed > 0 ? Math.ceil(extraMissed / leaves) * 0.5 : 0;

  return { percentage, deduction };
}

function render() {
  const div = document.getElementById("courses");
  div.innerHTML = "";

  courses.forEach((c, i) => {
    const stats = calculate(c);
    div.innerHTML += `
      <div class="course-card">
        <h3>${c.name} (${c.credit} credits)</h3>
        <p>Semester: ${c.sem}</p>
        <input type="number" value="${c.attended}" 
          onchange="updateAttendance(${i}, this.value)">
        <p>Attendance: ${stats.percentage.toFixed(1)}%</p>
        <p>GPA Deduction: ${stats.deduction}</p>
      </div>`;
  });
}

function updateAttendance(i, value) {
  courses[i].attended = Number(value);
  saveAndRender();
}

function saveAndRender() {
  localStorage.setItem("courses", JSON.stringify(courses));
  render();
}

render();
