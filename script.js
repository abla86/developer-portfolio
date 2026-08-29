document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const popover = document.getElementById("skill-popover");
  const nodes = document.querySelectorAll(".yg-node");
  const details = {
    React: ["React", "Component-driven UI and reusable application interfaces.", "Vaktklar · EvidenceFlow"],
    "C#/.NET": ["C# / .NET", "Backend APIs, domain logic, validation and full-stack application work.", "Vaktklar · HealthTech Platform · CloudForge"],
    Python: ["Python", "Data quality, analysis, automation and API work.", "HealthData Quality Lab · CloudForge"],
    SQL: ["SQL", "Relational modelling, constraints, views, procedures and workforce analysis.", "Vaktklar + Workforce SQL data layer"],
    Cloud: ["Cloud", "Docker, Kubernetes, Azure, infrastructure as code and delivery pipelines.", "CloudForge"],
    Security: ["Security", "Security-aware development, scanning, resilience and controlled verification.", "WPWW War Room · CloudForge · Vaktklar"],
    Evidence: ["Evidence", "Research-support workflows, provenance and methodology-aware software.", "EvidenceFlow"]
  };
  const show = (node) => {
    const item = details[node.dataset.skill];
    if (!item || !popover) return;
    popover.innerHTML = `<strong>${item[0]}</strong><span>${item[1]}</span><small>${item[2]}</small>`;
    nodes.forEach((n) => n.classList.toggle("active", n === node));
  };
  nodes.forEach((node) => {
    if (!details[node.dataset.skill]) return;
    node.addEventListener("mouseenter", () => show(node));
    node.addEventListener("focus", () => show(node));
    node.addEventListener("click", (event) => {
      event.preventDefault();
      show(node);
      const target = document.getElementById("projects");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
});
