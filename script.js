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

/* Portfolio interactive engineering lab: polished, browser-native, dependency-free. */
document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style");
  style.textContent = `
    .engineering-intro{margin:18px 0 0;color:var(--accent);font:600 .72rem/1.6 ui-monospace,SFMono-Regular,Consolas,monospace;min-height:1.7em;letter-spacing:.04em}
    .engineering-intro::before{content:"▸ ";opacity:.7}
    .project{transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease}
    .project:hover{transform:translateY(-3px);box-shadow:0 18px 48px rgba(0,0,0,.14)}

    .interactive-lab{padding:88px 0;border-top:1px solid rgba(255,255,255,.07);background:linear-gradient(180deg,rgba(16,29,48,.34),rgba(7,16,29,.08))}
    .interactive-lab-grid{display:grid;grid-template-columns:1.12fr .88fr;gap:18px;align-items:stretch}
    .lab-panel{border:1px solid var(--border);border-radius:16px;background:rgba(255,255,255,.025);overflow:hidden;box-shadow:0 18px 50px rgba(0,0,0,.12)}
    .lab-panel-head{display:flex;justify-content:space-between;gap:12px;align-items:center;padding:16px 18px;border-bottom:1px solid var(--border)}
    .lab-panel-head strong{font-size:.86rem}.lab-status{color:var(--accent);font:700 .68rem ui-monospace,SFMono-Regular,Consolas,monospace;letter-spacing:.08em}
    #agent-lab,#network-lab{display:block;width:100%;height:310px;background:radial-gradient(circle at 50% 45%,rgba(112,224,177,.06),transparent 48%),#07101d}
    .lab-controls{display:flex;gap:8px;flex-wrap:wrap;padding:13px 16px;border-top:1px solid var(--border)}
    .lab-btn{border:1px solid var(--border);background:rgba(255,255,255,.035);color:var(--text);border-radius:8px;padding:8px 11px;font:700 .74rem ui-sans-serif,system-ui;cursor:pointer}
    .lab-btn:hover,.lab-btn:focus-visible{border-color:var(--accent);outline:none;transform:translateY(-1px)}
    .lab-btn.primary{background:var(--accent);border-color:var(--accent);color:#07120d}
    .lab-metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;padding:16px}
    .lab-metric{padding:13px;border:1px solid var(--border);border-radius:11px;background:rgba(255,255,255,.02)}
    .lab-metric span{display:block;color:var(--muted);font-size:.68rem}.lab-metric strong{display:block;margin-top:3px;font-size:1.15rem}
    .lab-copy{padding:21px}.lab-copy h3{margin:0 0 7px;font-size:1.18rem}.lab-copy p{margin:0;color:var(--muted);font-size:.84rem;line-height:1.65}
    .lab-log{margin-top:14px;padding:12px;border:1px solid var(--border);border-radius:10px;background:#060c15;color:#b9c8da;font:500 .7rem/1.6 ui-monospace,SFMono-Regular,Consolas,monospace;min-height:110px}
    .lab-log div{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.lab-log .ok{color:#bff4da}.lab-log .warn{color:#ffd78a}
    .lab-hint{padding:0 16px 15px;color:var(--muted);font-size:.7rem}
    .lab-legend{display:flex;gap:14px;flex-wrap:wrap;padding:0 16px 4px;color:var(--muted);font-size:.68rem}.lab-legend span{display:inline-flex;align-items:center;gap:6px}.lab-dot{width:7px;height:7px;border-radius:50%;display:inline-block}.lab-dot.normal{background:#70e0b1}.lab-dot.threat{background:#ffbd69}.lab-dot.contained{background:#7da7ff}
    .skill-focus{box-shadow:0 0 0 1px rgba(112,224,177,.38),0 18px 50px rgba(0,0,0,.14)!important;transform:translateY(-2px)}
    @media(max-width:900px){.interactive-lab-grid{grid-template-columns:1fr}}
    @media(max-width:700px){.lab-metrics{grid-template-columns:repeat(2,1fr)}}
    @media(prefers-reduced-motion:reduce){.lab-btn:hover{transform:none}.skill-focus{transform:none}}
  `;
  document.head.appendChild(style);



  /* Small technical status line: subtle enough for a professional portfolio. */
  const heroLead=document.querySelector(".hero-copy .lead");
  if(heroLead&&!document.querySelector(".engineering-intro")){
    const intro=document.createElement("div");
    intro.className="engineering-intro";
    intro.setAttribute("aria-label","Engineering status");
    heroLead.insertAdjacentElement("afterend",intro);
    const lines=["Structured systems. Inspectable code.","Build → test → document → validate.","Healthcare × software × research."];
    let line=0,index=0,erasing=false;
    const type=()=>{
      const value=lines[line];
      if(!erasing){
        intro.textContent=value.slice(0,index++);
        if(index>value.length){erasing=true;setTimeout(type,1300);return;}
      }else{
        intro.textContent=value.slice(0,--index);
        if(index===0){erasing=false;line=(line+1)%lines.length;}
      }
      setTimeout(type,erasing?22:34);
    };
    if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches) type();
    else intro.textContent=lines[0];
  }

  const projects=document.getElementById("projects");
  if(!projects||document.getElementById("interactive-engineering-lab")) return;

  const section=document.createElement("section");
  section.id="interactive-engineering-lab";
  section.className="interactive-lab";
  section.innerHTML=`
    <div class="container">
      <div class="section-heading">
        <p class="eyebrow">INTERACTIVE ENGINEERING LAB</p>
        <h2>Make the engineering visible.</h2>
        <p>A deliberately bounded browser simulation showing event detection, containment and network state. It demonstrates the engineering pattern without pretending to be a live security system.</p>
      </div>
      <div class="interactive-lab-grid">
        <article class="lab-panel">
          <div class="lab-panel-head"><strong>Agent detection &amp; defence</strong><span class="lab-status" id="agent-status">READY</span></div>
          <canvas id="agent-lab" aria-label="Interactive simulation showing agents and a contained simulated threat"></canvas>
          <div class="lab-legend"><span><i class="lab-dot normal"></i>normal</span><span><i class="lab-dot threat"></i>detected</span><span><i class="lab-dot contained"></i>contained</span></div>
          <div class="lab-controls">
            <button class="lab-btn primary" id="agent-start" type="button">Run monitoring</button>
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
        <article class="lab-panel">
          <div class="lab-panel-head"><strong>Network state</strong><span class="lab-status">LOCAL SIMULATION</span></div>
          <canvas id="network-lab" aria-label="Animated network node visualization"></canvas>
          <div class="lab-copy">
            <h3>Telemetry → decision → response</h3>
            <p>Abstract services move through a lightweight event-driven model. The visualization is intentionally local and deterministic in scope: no network requests, credentials or external systems are involved.</p>
            <div class="lab-log" id="lab-log" aria-live="polite">
              <div class="ok">[ready] simulation boundary established</div>
              <div>[info] waiting for an event</div>
            </div>
          </div>
          <div class="lab-hint">HTML Canvas + vanilla JavaScript · no external runtime dependency.</div>
        </article>
      </div>
    </div>`;
  projects.insertAdjacentElement("afterend",section);

  const agentCanvas=document.getElementById("agent-lab");
  const networkCanvas=document.getElementById("network-lab");
  const actx=agentCanvas.getContext("2d");
  const nctx=networkCanvas.getContext("2d");
  const status=document.getElementById("agent-status");
  const log=document.getElementById("lab-log");
  const metrics={
    agents:document.getElementById("metric-agents"),
    detected:document.getElementById("metric-detected"),
    contained:document.getElementById("metric-contained"),
    events:document.getElementById("metric-events")
  };

  const fit=(canvas,ctx)=>{
    const dpr=Math.min(window.devicePixelRatio||1,2);
    const rect=canvas.getBoundingClientRect();
    canvas.width=Math.max(1,Math.floor(rect.width*dpr));
    canvas.height=Math.max(1,Math.floor(rect.height*dpr));
    ctx.setTransform(dpr,0,0,dpr,0,0);
    return {w:rect.width,h:rect.height};
  };
  let aw=0,ah=0,nw=0,nh=0;
  const resize=()=>{
    ({w:aw,h:ah}=fit(agentCanvas,actx));
    ({w:nw,h:nh}=fit(networkCanvas,nctx));
  };
  resize();
  window.addEventListener("resize",resize);

  const agents=Array.from({length:12},(_,id)=>({
    id,x:.08+Math.random()*.84,y:.08+Math.random()*.84,
    vx:(Math.random()-.5)*.00065,vy:(Math.random()-.5)*.00065,
    threat:false,contained:false
  }));
  let running=false,detected=0,contained=0,events=0,last=performance.now(),lastContainment=0;
  const addLog=(message,kind="")=>{
    const row=document.createElement("div");
    if(kind)row.className=kind;
    row.textContent=`[${new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit",second:"2-digit"})}] ${message}`;
    log.prepend(row);
    while(log.children.length>5)log.removeChild(log.lastChild);
  };
  const updateMetrics=()=>{
    metrics.agents.textContent=agents.length;
    metrics.detected=metrics.detected||document.getElementById("metric-detected");
    metrics.detected.textContent=detected;
    metrics.contained.textContent=contained;
    metrics.events.textContent=events;
  };
  const injectThreat=()=>{
    const candidates=agents.filter(a=>!a.threat&&!a.contained);
    if(!candidates.length){addLog("no uncontained agent available","warn");return}
    const a=candidates[Math.floor(Math.random()*candidates.length)];
    a.threat=true;detected+=1;events+=1;status.textContent="THREAT DETECTED";
    addLog(`threat detected on agent ${a.id+1}`,"warn");
    updateMetrics();
  };
  const reset=()=>{
    agents.forEach(a=>{a.threat=false;a.contained=false;a.x=.08+Math.random()*.84;a.y=.08+Math.random()*.84});
    detected=0;contained=0;events=0;running=false;status.textContent="READY";lastContainment=0;
    addLog("simulation reset","ok");updateMetrics();
  };
  document.getElementById("agent-start").addEventListener("click",()=>{
    running=!running;
    status.textContent=running?"MONITORING":"PAUSED";
    events+=1;
    addLog(running?"monitoring loop started":"monitoring paused",running?"ok":"");
    updateMetrics();
  });
  document.getElementById("agent-threat").addEventListener("click",injectThreat);
  document.getElementById("agent-reset").addEventListener("click",reset);

  const containThreat=(time)=>{
    if(!running||time-lastContainment<850)return;
    const target=agents.find(a=>a.threat&&!a.contained);
    if(!target)return;
    target.contained=true;
    contained+=1;events+=1;lastContainment=time;
    status.textContent="THREAT CONTAINED";
    addLog(`containment action isolated agent ${target.id+1}`,"ok");
    updateMetrics();
  };

  const drawAgents=(time)=>{
    actx.clearRect(0,0,aw,ah);
    actx.fillStyle="rgba(112,224,177,.035)";actx.fillRect(0,0,aw,ah);
    actx.strokeStyle="rgba(125,167,255,.09)";actx.lineWidth=1;
    for(let x=20;x<aw;x+=40){actx.beginPath();actx.moveTo(x,0);actx.lineTo(x,ah);actx.stroke()}
    for(let y=20;y<ah;y+=40){actx.beginPath();actx.moveTo(0,y);actx.lineTo(aw,y);actx.stroke()}
    agents.forEach(a=>{
      if(running&&!a.contained){
        a.x+=a.vx*(time-last);a.y+=a.vy*(time-last);
        if(a.x<.035||a.x>.965)a.vx*=-1;
        if(a.y<.055||a.y>.945)a.vy*=-1;
      }
      const x=a.x*aw,y=a.y*ah;
      if(a.threat&&!a.contained){
        actx.strokeStyle="rgba(255,189,105,.45)";
        actx.beginPath();actx.arc(x,y,15+Math.sin(time/160)*3,0,Math.PI*2);actx.stroke();
      }
      actx.beginPath();actx.arc(x,y,a.threat?7:5,0,Math.PI*2);
      actx.fillStyle=a.contained?"#7da7ff":a.threat?"#ffbd69":"#70e0b1";actx.fill();
      if(a.contained){
        actx.strokeStyle="rgba(125,167,255,.42)";
        actx.strokeRect(x-11,y-11,22,22);
      }
    });
  };

  const networkNodes=Array.from({length:18},(_,i)=>({id:i,x:.05+Math.random()*.9,y:.1+Math.random()*.8,vx:(Math.random()-.5)*.00008,vy:(Math.random()-.5)*.00008}));
  const drawNetwork=(time)=>{
    nctx.clearRect(0,0,nw,nh);
    networkNodes.forEach(n=>{
      n.x+=n.vx*(time-last);n.y+=n.vy*(time-last);
      if(n.x<.03||n.x>.97)n.vx*=-1;if(n.y<.08||n.y>.92)n.vy*=-1;
    });
    networkNodes.forEach((a,i)=>networkNodes.slice(i+1).forEach(b=>{
      const d=Math.hypot((a.x-b.x)*nw,(a.y-b.y)*nh);
      if(d<100){
        nctx.strokeStyle=`rgba(125,167,255,${Math.max(.035,.16-d/650)})`;
        nctx.beginPath();nctx.moveTo(a.x*nw,a.y*nh);nctx.lineTo(b.x*nw,b.y*nh);nctx.stroke();
      }
    }));
    networkNodes.forEach((n,i)=>{
      const pulse=i%6===0?1.6+Math.sin(time/500+i)*.8:0;
      nctx.fillStyle=i%6===0?"#70e0b1":"#7da7ff";
      nctx.beginPath();nctx.arc(n.x*nw,n.y*nh,(i%6===0?4:3)+pulse,0,Math.PI*2);nctx.fill();
    });
  };

  const tick=time=>{
    containThreat(time);
    drawAgents(time);drawNetwork(time);
    last=time;requestAnimationFrame(tick);
  };
  updateMetrics();
  requestAnimationFrame(tick);
});
