document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const popover = document.getElementById("skill-popover");
  const nodes = document.querySelectorAll(".yg-node");
  const details = {
    React: ["React", "Component-driven UI and reusable application interfaces.", "CloudForge"],
    "C#/.NET": ["C# / .NET", "Backend APIs, domain logic and validation.", "HealthTech Platform · CloudForge"],
    Python: ["Python", "Automation, data and platform tooling.", "CloudForge"],
    Cloud: ["Cloud", "Docker, Kubernetes, Azure, infrastructure as code and delivery pipelines.", "CloudForge"],
    Security: ["Security", "Application security, DevSecOps, supply-chain controls and resilience.", "HealthTech Platform · CloudForge"],
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

/* Portfolio interactive engineering lab: lightweight, job-safe, no dependencies. */
document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style");
  style.textContent = `
    .interactive-lab{padding:92px 0;border-top:1px solid rgba(255,255,255,.07);background:linear-gradient(180deg,rgba(16,29,48,.34),rgba(7,16,29,.08))}
    .interactive-lab-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:18px;align-items:stretch}
    .lab-panel{border:1px solid var(--border);border-radius:16px;background:rgba(255,255,255,.025);overflow:hidden}
    .lab-panel-head{display:flex;justify-content:space-between;gap:12px;align-items:center;padding:16px 18px;border-bottom:1px solid var(--border)}
    .lab-panel-head strong{font-size:.86rem}.lab-status{color:var(--accent);font:700 .68rem ui-monospace,SFMono-Regular,Consolas,monospace}
    #agent-lab{display:block;width:100%;height:310px;background:radial-gradient(circle at 50% 45%,rgba(112,224,177,.06),transparent 48%),#07101d}
    .lab-controls{display:flex;gap:8px;flex-wrap:wrap;padding:13px 16px;border-top:1px solid var(--border)}
    .lab-btn{border:1px solid var(--border);background:rgba(255,255,255,.035);color:var(--text);border-radius:8px;padding:8px 11px;font:700 .74rem ui-sans-serif,system-ui;cursor:pointer}
    .lab-btn:hover,.lab-btn:focus-visible{border-color:var(--accent);outline:none}
    .lab-btn.primary{background:var(--accent);border-color:var(--accent);color:#07120d}
    .lab-metrics{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;padding:16px}
    .lab-metric{padding:14px;border:1px solid var(--border);border-radius:11px;background:rgba(255,255,255,.02)}
    .lab-metric span{display:block;color:var(--muted);font-size:.7rem}.lab-metric strong{display:block;margin-top:3px;font-size:1.25rem}
    .lab-copy{padding:23px}.lab-copy h3{margin:0 0 8px;font-size:1.25rem}.lab-copy p{margin:0;color:var(--muted);font-size:.88rem}
    .lab-log{margin-top:16px;padding:13px;border:1px solid var(--border);border-radius:10px;background:#060c15;color:#b9c8da;font:500 .72rem/1.6 ui-monospace,SFMono-Regular,Consolas,monospace;min-height:110px}
    .lab-log div{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.lab-log .ok{color:#bff4da}.lab-log .warn{color:#ffd78a}
    .network-demo{position:relative;height:100%;min-height:310px}
    #network-lab{display:block;width:100%;height:100%;min-height:310px}
    .lab-hint{padding:0 16px 15px;color:var(--muted);font-size:.72rem}
    @media(max-width:900px){.interactive-lab-grid{grid-template-columns:1fr}.network-demo{min-height:280px}}
    @media(max-width:620px){.lab-metrics{grid-template-columns:1fr 1fr}.lab-panel-head{align-items:flex-start}}
    @media(prefers-reduced-motion:reduce){#agent-lab,#network-lab{animation:none}}
  `;
  document.head.appendChild(style);

  const projects = document.getElementById("projects");
  if (!projects || document.getElementById("interactive-engineering-lab")) return;

  const section = document.createElement("section");
  section.id = "interactive-engineering-lab";
  section.className = "interactive-lab";
  section.innerHTML = `
    <div class="container">
      <div class="section-heading">
        <p class="eyebrow">INTERACTIVE ENGINEERING LAB</p>
        <h2>See the engineering logic, not just the screenshots.</h2>
        <p>A small browser-native demonstration of event detection, defensive response and network state. It is deliberately a simulation: no real systems are contacted.</p>
      </div>
      <div class="interactive-lab-grid">
        <article class="lab-panel">
          <div class="lab-panel-head"><strong>Adaptive agent simulation</strong><span class="lab-status" id="agent-status">READY</span></div>
          <canvas id="agent-lab" aria-label="Interactive simulation of agents, detection and defence"></canvas>
          <div class="lab-controls">
            <button class="lab-btn primary" id="agent-start" type="button">Run simulation</button>
            <button class="lab-btn" id="agent-threat" type="button">Inject simulated threat</button>
            <button class="lab-btn" id="agent-reset" type="button">Reset</button>
          </div>
          <div class="lab-metrics">
            <div class="lab-metric"><span>Agents</span><strong id="metric-agents">12</strong></div>
            <div class="lab-metric"><span>Detected</span><strong id="metric-detected">0</strong></div>
            <div class="lab-metric"><span>Contained</span><strong id="metric-contained">0</strong></div>
            <div class="lab-metric"><span>Events</span><strong id="metric-events">0</strong></div>
          </div>
        </article>
        <article class="lab-panel network-demo">
          <div class="lab-panel-head"><strong>Network state</strong><span class="lab-status">LOCAL SIMULATION</span></div>
          <canvas id="network-lab" aria-label="Animated network node visualization"></canvas>
          <div class="lab-copy">
            <h3>Event-driven view</h3>
            <p>Nodes represent abstract services. Connections pulse when state changes, making the relationship between telemetry, detection and response visible without pretending to be a live security system.</p>
            <div class="lab-log" id="lab-log" aria-live="polite">
              <div class="ok">[ready] simulation boundary established</div>
              <div>[info] waiting for an event</div>
            </div>
          </div>
          <div class="lab-hint">Built with HTML Canvas + vanilla JavaScript. No framework or external service.</div>
        </article>
      </div>
    </div>`;

  projects.insertAdjacentElement("afterend", section);

  const agentCanvas = document.getElementById("agent-lab");
  const networkCanvas = document.getElementById("network-lab");
  const actx = agentCanvas.getContext("2d");
  const nctx = networkCanvas.getContext("2d");
  const status = document.getElementById("agent-status");
  const log = document.getElementById("lab-log");
  const metrics = {
    agents: document.getElementById("metric-agents"),
    detected: document.getElementById("metric-detected"),
    contained: document.getElementById("metric-contained"),
    events: document.getElementById("metric-events")
  };

  const fit = (canvas, ctx) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    ctx.setTransform(dpr,0,0,dpr,0,0);
    return {w:rect.width,h:rect.height};
  };

  let aw = 0, ah = 0, nw = 0, nh = 0;
  const resize = () => {
    ({w:aw,h:ah}=fit(agentCanvas,actx));
    ({w:nw,h:nh}=fit(networkCanvas,nctx));
  };
  resize();
  window.addEventListener("resize", resize);

  const agents = Array.from({length:12},(_,i)=>({id:i,x:Math.random(),y:Math.random(),vx:(Math.random()-.5)*.002,vy:(Math.random()-.5)*.002,threat:false,contained:false}));
  let running=false, detected=0, contained=0, events=0, threatIndex=-1, last=performance.now();

  const addLog = (message, kind="") => {
    const row=document.createElement("div");
    if(kind) row.className=kind;
    row.textContent=`[${new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit",second:"2-digit"})}] ${message}`;
    log.prepend(row);
    while(log.children.length>5) log.removeChild(log.lastChild);
  };

  const updateMetrics=()=>{
    metrics.agents.textContent=agents.length;
    metrics.detected.textContent=detected;
    metrics.contained.textContent=contained;
    metrics.events.textContent=events;
  };

  const injectThreat=()=>{
    const candidates=agents.filter(a=>!a.threat&&!a.contained);
    if(!candidates.length)return;
    const a=candidates[Math.floor(Math.random()*candidates.length)];
    a.threat=true; threatIndex=a.id; events++; status.textContent="THREAT DETECTED";
    addLog(`simulated threat entered agent ${a.id+1}`,"warn"); updateMetrics();
  };

  const reset=()=>{
    agents.forEach(a=>{a.threat=false;a.contained=false;a.x=Math.random();a.y=Math.random()});
    detected=0;contained=0;events=0;threatIndex=-1;running=false;status.textContent="READY";
    addLog("simulation reset","ok"); updateMetrics();
  };

  document.getElementById("agent-start").addEventListener("click",()=>{
    running=!running; status.textContent=running?"MONITORING":"PAUSED";
    if(running){events++;addLog("monitoring loop started","ok")}else addLog("monitoring paused");
    updateMetrics();
  });
  document.getElementById("agent-threat").addEventListener("click",injectThreat);
  document.getElementById("agent-reset").addEventListener("click",reset);

  const drawAgents=(time)=>{
    actx.clearRect(0,0,aw,ah);
    actx.fillStyle="rgba(112,224,177,.04)";actx.fillRect(0,0,aw,ah);
    actx.strokeStyle="rgba(125,167,255,.12)";actx.lineWidth=1;
    for(let x=20;x<aw;x+=40){actx.beginPath();actx.moveTo(x,0);actx.lineTo(x,ah);actx.stroke()}
    for(let y=20;y<ah;y+=40){actx.beginPath();actx.moveTo(0,y);actx.lineTo(aw,y);actx.stroke()}
    agents.forEach(a=>{
      if(running&&!a.contained){a.x+=a.vx*(time-last)*.08;a.y+=a.vy*(time-last)*.08;if(a.x<.03||a.x>.97)a.vx*=-1;if(a.y<.05||a.y>.95)a.vy*=-1}
      const x=a.x*aw,y=a.y*ah;
      actx.beginPath();actx.arc(x,y,a.threat?8:5,0,Math.PI*2);
      actx.fillStyle=a.contained?"#7da7ff":a.threat?"#ffbd69":"#70e0b1";actx.fill();
      if(a.threat){actx.strokeStyle="rgba(255,189,105,.5)";actx.beginPath();actx.arc(x,y,14+Math.sin(time/180)*3,0,Math.PI*2);actx.stroke()}
      if(a.contained){actx.strokeStyle="rgba(125,167,255,.35)";actx.strokeRect(x-11,y-11,22,22)}
    });
  };

  const networkNodes=Array.from({length:18},()=>({x:Math.random(),y:Math.random(),vx:(Math.random()-.5)*.0003,vy:(Math.random()-.5)*.0003}));
  const drawNetwork=(time)=>{
    nctx.clearRect(0,0,nw,nh);
    networkNodes.forEach(n=>{n.x+=n.vx*(time-last);n.y+=n.vy*(time-last);if(n.x<.04||n.x>.96)n.vx*=-1;if(n.y<.08||n.y>.92)n.vy*=-1});
    networkNodes.forEach((a,i)=>networkNodes.slice(i+1).forEach(b=>{
      const d=Math.hypot((a.x-b.x)*nw,(a.y-b.y)*nh);
      if(d<95){nctx.strokeStyle=`rgba(125,167,255,${Math.max(.04,.18-d/600)})`;nctx.beginPath();nctx.moveTo(a.x*nw,a.y*nh);nctx.lineTo(b.x*nw,b.y*nh);nctx.stroke()}
    }));
    networkNodes.forEach((n,i)=>{nctx.fillStyle=i%5===0?"#70e0b1":"#7da7ff";nctx.beginPath();nctx.arc(n.x*nw,n.y*nh,i%5===0?4:3,0,Math.PI*2);nctx.fill()});
  };

  const tick=(time)=>{
    drawAgents(time);drawNetwork(time);last=time;requestAnimationFrame(tick);
  };
  updateMetrics(); requestAnimationFrame(tick);
});
