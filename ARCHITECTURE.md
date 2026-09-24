# Architecture

## Status
Implemented — static GitHub Pages ecosystem using HTML, CSS and browser JavaScript. The existing repository did not contain a Vite/React application, so the first production version stays within the existing static architecture rather than introducing an unnecessary framework migration.

## Layers
- GitHub Profile — abla86/abla86/README.md is the visual portal and links to the Pages experience.
- Pages application — index.html provides the interactive swarm ecosystem, modes, capability worlds, project constellation and traceability view.
- Data — data/ecosystem.json is the central project/world data source used by the Pages application.
- Existing worlds — evidence-lab.html, cloud-badges.html and open-source.html remain available.

## Interaction model
The central swarm uses accessible SVG nodes. Hash navigation provides stable deep links such as #recruiter, #technical, #research, #projects and capability filters.

The profile README does not claim to execute JavaScript inside GitHub's renderer. The actual interaction lives on GitHub Pages.

## Evidence model
Project descriptions are sourced from the existing portfolio/project registry and known repository links. No self-assessed skill percentages are used.
