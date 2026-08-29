document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const popover = document.getElementById("skill-popover");
  const nodes = document.querySelectorAll(".yg-node");
  const details = {
    React: ["React", "Component-driven UI and reusable application interfaces.", "See projects →"],
    "C#/.NET": ["C# / .NET", "Backend APIs, domain logic, validation and full-stack application work.", "See Workforce / HealthTech →"],
    Python: ["Python", "Data quality, analysis, automation and API work.", "See HealthData →"],
    SQL: ["SQL", "Relational modelling, constraints, views, procedures and staffing analysis.", "See Workforce →"],
    Cloud: ["Cloud", "Docker, Kubernetes, Azure, infrastructure as code and delivery pipelines.", "See CloudForge →"],
    Security: ["Security", "Security-aware development, scanning, resilience and controlled verification.", "See War Room →"],
    Evidence: ["Evidence", "Research-support workflows, provenance and methodology-aware software.", "See EvidenceFlow →"]
  };
  nodes.forEach((node) => {
    const key = node.dataset.skill;
    const item = details[key];
    if (!item || !popover) return;
    const show = () => {
      popover.innerHTML = `<strong>${item[0]}</strong><span>${item[1]}</span>`;
      nodes.forEach((n) => n.classList.toggle("active", n === node));
    };
    node.addEventListener("mouseenter", show);
    node.addEventListener("focus", show);
    node.addEventListener("click", show);
  });
});
