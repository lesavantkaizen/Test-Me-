/* =========================================================================
   Launch To Wellness — Header  (VELO-READY Custom Element)
   -------------------------------------------------------------------------
   SETUP IN WIX (Velo file method):

   1. Turn ON Dev Mode (top bar of the Wix Editor). This reveals the code
      sidebar with a "Public" folder.
   2. In the Public folder, click (+) -> New File -> name it:
        ltw-header.js
      Open it, DELETE any starter content, and PASTE this entire file.
   3. Click Save / Publish the code (Velo autosaves).
   4. Add the element: Add (+) -> Embed Code -> Custom Element.
      In the element's settings:
        • Choose "Velo file"
        • Select  public/ltw-header.js
        • Tag name / Server tag name:  ltw-header
   5. Stretch the element full-width and drop it at the very top.
      It auto-sizes: just the bar when closed (no empty space),
      expands when a menu opens. Optional: Pin to Screen -> Top for sticky.

   NOTE: This file registers a <ltw-header> custom element. It runs in the
   browser (front-end) only. No imports are needed. Do not add `export`.
   ========================================================================= */

class LTWHeader extends HTMLElement {
  connectedCallback() {
    if (this._mounted) return;
    this._mounted = true;

    const shadow = this.attachShadow({ mode: 'open' });

    // ---- fonts (injected into the document head; shadow DOM can't load <link> reliably) ----
    if (!document.getElementById('ltw-fonts')) {
      const f = document.createElement('link');
      f.id = 'ltw-fonts';
      f.rel = 'stylesheet';
      f.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..700&family=Nunito+Sans:opsz,wght@6..12,200..900&display=swap';
      document.head.appendChild(f);
    }

    shadow.innerHTML = `
<style>
  :host{ all:initial; display:block; position:relative; z-index:9999; font-family:"Nunito Sans",system-ui,sans-serif; }
  *{box-sizing:border-box;margin:0;padding:0}
  :host{
    --blue:#2782B2;--blue-deep:#1B5C80;--blue-ink:#0E2C3D;
    --orange:#E8A15B;--cream:#FAF9F5;--ink:#13242E;
    --glass-light-bd:rgba(255,255,255,.7);
    --shadow-soft:0 8px 30px -12px rgba(14,44,61,.22);
    --shadow-lift:0 24px 60px -24px rgba(14,44,61,.5);
    --serif:"Fraunces",Georgia,serif;--sans:"Nunito Sans",system-ui,sans-serif;
    --ease:cubic-bezier(.22,1,.36,1);
  }
  a{text-decoration:none;color:inherit}
  .root{position:relative}
  .wrap{max-width:1340px;margin:0 auto;padding:0 24px}

  .topbar{font-size:12.5px;letter-spacing:.03em;color:var(--blue-ink);font-weight:700;
    display:flex;justify-content:center;padding:7px 0;}
  .topbar .wrap{display:flex;justify-content:space-between;align-items:center;gap:16px;width:100%}
  .topbar .left{display:flex;align-items:center;opacity:.85}
  .topbar .dot{width:6px;height:6px;border-radius:50%;background:var(--orange);display:inline-block;margin-right:8px;box-shadow:0 0 0 4px rgba(232,161,91,.22)}
  .topbar .right{display:flex;gap:18px;align-items:center}
  .topbar .right a{transition:color .2s var(--ease);white-space:nowrap}
  .topbar .right a:hover{color:var(--blue)}
  .topbar .right .tel{color:var(--blue-deep)}
  .topbar .right .vsep{width:1px;height:13px;background:rgba(14,44,61,.2)}

  .bar{padding:8px 0 0}
  .nav-shell{position:relative;z-index:20;margin:0 auto;max-width:1340px;
    background:linear-gradient(135deg,rgba(255,255,255,.92),rgba(255,255,255,.74));
    backdrop-filter:blur(20px) saturate(160%);-webkit-backdrop-filter:blur(20px) saturate(160%);
    border:1px solid var(--glass-light-bd);border-radius:20px;
    box-shadow:var(--shadow-soft),inset 0 1px 0 rgba(255,255,255,.9);
    display:flex;align-items:center;justify-content:space-between;padding:11px 14px 11px 18px;gap:10px;}

  .brand{display:flex;align-items:center;gap:11px;flex-shrink:1;min-width:0}
  .brand .logo{width:46px;height:46px;border-radius:11px;flex-shrink:0;object-fit:contain;background:#fff;padding:4px;box-shadow:0 8px 20px -8px rgba(39,130,178,.4),inset 0 1px 0 rgba(255,255,255,.6)}
  .brand .txt{line-height:1;min-width:0}
  .brand .name{font-family:var(--serif);font-weight:600;font-size:19px;letter-spacing:-.012em;color:var(--blue-ink);white-space:nowrap}
  .brand .name b{color:var(--blue);font-weight:600}
  .brand .sub{font-size:7.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--orange);font-weight:800;margin-top:3px;white-space:nowrap}

  nav.primary{display:flex;align-items:center;gap:0}
  .navbtn{display:flex;align-items:center;gap:5px;padding:10px 13px;border-radius:10px;background:none;border:0;cursor:pointer;
    font-family:var(--sans);font-weight:700;font-size:14px;color:var(--blue-ink);white-space:nowrap;transition:background .22s var(--ease),color .22s var(--ease)}
  .navbtn .chev{width:9px;height:9px;opacity:.5;transition:transform .3s var(--ease)}
  .navbtn:hover{background:rgba(39,130,178,.10);color:var(--blue-deep)}
  .navbtn.active{background:rgba(39,130,178,.12);color:var(--blue-deep)}
  .navbtn.active .chev{transform:rotate(180deg)}

  .cta-group{display:flex;align-items:center;gap:8px;flex-shrink:0}
  .ghost{padding:10px 14px;border-radius:11px;font-weight:800;font-size:13px;color:var(--blue-deep);border:1.5px solid rgba(39,130,178,.3);transition:.25s var(--ease);white-space:nowrap}
  .ghost:hover{background:rgba(39,130,178,.10);border-color:var(--blue)}
  .solid{padding:11px 16px;border-radius:11px;font-weight:800;font-size:13px;color:#fff;white-space:nowrap;flex-shrink:0;
    background:linear-gradient(135deg,var(--orange),#DD8F45);box-shadow:0 12px 26px -10px rgba(232,161,91,.85),inset 0 1px 0 rgba(255,255,255,.5);transition:.25s var(--ease)}
  .solid:hover{transform:translateY(-2px);box-shadow:0 18px 34px -10px rgba(232,161,91,.95)}
  .burger{display:none;width:42px;height:42px;border-radius:11px;border:1px solid var(--glass-light-bd);background:rgba(255,255,255,.6);place-items:center;cursor:pointer;flex-shrink:0}
  .burger span{display:block;width:20px;height:2px;background:var(--blue-ink);position:relative;border-radius:2px;transition:transform .3s var(--ease),background .3s var(--ease)}
  .burger span::before,.burger span::after{content:"";position:absolute;left:0;width:20px;height:2px;background:var(--blue-ink);border-radius:2px;transition:.3s var(--ease)}
  .burger span::before{top:-6px}.burger span::after{top:6px}
  .root.menu-open .burger span{background:transparent}
  .root.menu-open .burger span::before{top:0;transform:rotate(45deg)}
  .root.menu-open .burger span::after{top:0;transform:rotate(-45deg)}

  /* panels: absolute overlay so they float above the page (and the section
     below) instead of pushing layout or spilling into the next section. */
  .panelzone{position:absolute;left:0;right:0;top:100%;z-index:60}
  .panel{display:none;padding:10px 0 0}
  .panel.show{display:block;animation:drop .28s var(--ease) both}
  @keyframes drop{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
  .panel-card{margin:0 auto;max-width:1340px;
    background:linear-gradient(150deg,rgba(255,255,255,.97),rgba(250,249,245,.94));
    backdrop-filter:blur(22px) saturate(160%);-webkit-backdrop-filter:blur(22px) saturate(160%);
    border:1px solid var(--glass-light-bd);border-radius:18px;
    box-shadow:var(--shadow-lift),inset 0 1px 0 rgba(255,255,255,.9);padding:18px;}

  .overview{display:block;padding:14px 16px;border-radius:13px;margin-bottom:12px;
    background:linear-gradient(135deg,rgba(39,130,178,.12),rgba(232,161,91,.10));border:1px solid rgba(39,130,178,.16);transition:.24s var(--ease)}
  .overview:hover{transform:translateY(-1px);box-shadow:0 10px 24px -12px rgba(39,130,178,.5);border-color:rgba(39,130,178,.32)}
  .overview .ot{display:flex;align-items:center;gap:7px;font-family:var(--serif);font-weight:600;font-size:17px;color:var(--blue-ink)}
  .overview .ot svg{width:13px;height:13px;transition:transform .3s var(--ease)}
  .overview:hover .ot svg{transform:translateX(4px)}
  .overview .od{font-size:12.5px;color:#5b6e78;font-weight:500;margin-top:3px;line-height:1.4}

  .grid{display:grid;gap:3px 14px}
  .grid.c2{grid-template-columns:1fr 1fr}
  .grid.c4{grid-template-columns:1fr 1fr 1fr 1fr}
  .gcol .h5{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--orange);font-weight:800;padding:8px 12px 5px}
  .gcol{border-left:1px solid rgba(39,130,178,.12);padding-left:6px}
  .gcol:first-child{border-left:0;padding-left:0}
  .plink{display:flex;flex-direction:column;gap:1px;padding:9px 12px;border-radius:11px;transition:background .2s var(--ease),transform .2s var(--ease)}
  .plink:hover{background:rgba(39,130,178,.10);transform:translateX(3px)}
  .plink .t{font-weight:700;font-size:14px;color:var(--blue-ink)}
  .plink .d{font-size:11.5px;color:#5b6e78;font-weight:500;line-height:1.3}
  .plink:hover .t{color:var(--blue-deep)}

  /* mobile */
  .mobile-menu{display:none;position:absolute;left:0;right:0;top:100%;z-index:60}
  @keyframes glideDown{from{opacity:0;transform:translateY(-14px)}to{opacity:1;transform:translateY(0)}}
  .nav-shell{animation:glideDown .55s var(--ease) both}

  @media (max-width:1180px){ .navbtn{padding:10px 9px;font-size:13px} }
  @media (max-width:1040px){
    nav.primary{display:none}
    .burger{display:grid}
    .cta-group .ghost{display:none}
    .panelzone{display:none}
    .mobile-menu{display:none;padding:10px 0 0}
    .mobile-menu.show{display:block;animation:drop .28s var(--ease) both}
    .mm-card{margin:0 auto;max-width:1340px;
      background:linear-gradient(160deg,rgba(255,255,255,.98),rgba(250,249,245,.95));
      backdrop-filter:blur(22px) saturate(160%);-webkit-backdrop-filter:blur(22px) saturate(160%);
      border:1px solid var(--glass-light-bd);border-radius:18px;box-shadow:var(--shadow-lift);padding:6px 16px 16px}
    .mnav{list-style:none}
    .mnav>li{border-bottom:1px solid rgba(39,130,178,.12)}
    .macc{width:100%;display:flex;align-items:center;justify-content:space-between;gap:10px;background:none;border:0;cursor:pointer;
      padding:14px 4px;font-family:var(--sans);font-weight:800;font-size:16px;color:var(--blue-ink);text-align:left}
    .macc .micon{width:11px;height:11px;color:var(--blue);transition:transform .3s var(--ease)}
    .macc[aria-expanded="true"] .micon{transform:rotate(180deg)}
    .msub{max-height:0;overflow:hidden;transition:max-height .35s var(--ease)}
    .msub-inner{padding:2px 4px 12px}
    .msub a{display:block;padding:9px 12px;border-radius:9px;font-weight:700;font-size:14.5px;color:var(--blue-deep)}
    .msub a:hover{background:rgba(39,130,178,.10)}
    .msub .mh{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--orange);font-weight:800;padding:11px 12px 3px}
    .mcta{display:flex;flex-direction:column;gap:10px;padding:14px 4px 6px}
    .mcta a{text-align:center}
    .mutil{display:flex;flex-direction:column;gap:2px;padding:12px 4px 4px;border-top:1px solid rgba(39,130,178,.12);margin-top:6px}
    .mutil a{padding:11px 4px;font-weight:700;font-size:15px;color:var(--blue-ink)}
    .mutil .mtel{color:var(--blue-deep);font-weight:800}
  }
  @media (max-width:600px){
    .topbar .right .util{display:none}
    .wrap{padding:0 14px}
    .nav-shell{border-radius:16px;padding:9px 10px 9px 12px}
    .brand .logo{width:38px;height:38px}.brand .name{font-size:15px}.brand .sub{font-size:6px}
    .cta-group .solid{padding:9px 12px;font-size:12px}
  }
  @media (max-width:360px){ .cta-group .solid{display:none} }
</style>

<div class="root">
  <div class="topbar">
    <div class="wrap">
      <div class="left"><span class="dot"></span>Joint Commission Accredited &nbsp;·&nbsp; Woodland Hills, CA</div>
      <div class="right">
        <a class="util" href="/admissions/professional-referrals">For Referrals</a>
        <span class="vsep util"></span>
        <a class="util" href="/for-families">For Families</a>
        <span class="vsep"></span>
        <a class="tel" href="tel:14243274040">Call (424) 327-4040</a>
      </div>
    </div>
  </div>

  <div class="bar">
    <div class="wrap">
      <div class="nav-shell">
        <a class="brand" href="https://www.launchtowellness.com/" aria-label="Launch To Wellness home">
          <img class="logo" src="https://static.wixstatic.com/media/1b3be5_fbde30efe12e4a6c976526f817d913d5~mv2.png" alt="Launch To Wellness">
          <span class="txt">
            <span class="name">Launch <b>To Wellness</b></span>
            <span class="sub">Mental Health &amp; Substance Use Recovery</span>
          </span>
        </a>
        <nav class="primary">
          <button class="navbtn" data-panel="about">About <svg class="chev" viewBox="0 0 12 12"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg></button>
          <button class="navbtn" data-panel="programs">Programs <svg class="chev" viewBox="0 0 12 12"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg></button>
          <button class="navbtn" data-panel="treat">What We Treat <svg class="chev" viewBox="0 0 12 12"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg></button>
          <button class="navbtn" data-panel="services">Services <svg class="chev" viewBox="0 0 12 12"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg></button>
          <button class="navbtn" data-panel="admissions">Admissions <svg class="chev" viewBox="0 0 12 12"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg></button>
        </nav>
        <div class="cta-group">
          <a class="ghost" href="/admissions/verify-insurance">Verify Insurance</a>
          <a class="solid" href="/admissions">Get Help Now</a>
          <button class="burger" aria-label="Menu" aria-expanded="false"><span></span></button>
        </div>
      </div>
    </div>
  </div>

  <div class="panelzone">
    <div class="wrap">
      <div class="panel" data-for="about"><div class="panel-card">
        <a class="overview" href="/about"><span class="ot">About Overview <svg viewBox="0 0 16 16"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span class="od">Our mission, clinical team, and trauma-informed approach to care.</span></a>
        <div class="grid c2">
          <a class="plink" href="/about/ourstory-mission"><span class="t">Our Story &amp; Mission</span><span class="d">Why we exist</span></a>
          <a class="plink" href="/about/meet-the-clinical-team"><span class="t">Clinical Team</span><span class="d">Meet our experts</span></a>
          <a class="plink" href="/about/treatment-philosophy-approach"><span class="t">Our Approach</span><span class="d">Treatment philosophy</span></a>
          <a class="plink" href="/about/accreditation-licensing"><span class="t">Accreditation</span><span class="d">Licensing &amp; standards</span></a>
        </div>
      </div></div>

      <div class="panel" data-for="programs"><div class="panel-card">
        <a class="overview" href="/programs"><span class="ot">Programs Overview <svg viewBox="0 0 16 16"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span class="od">Levels of care tailored to where you are in recovery.</span></a>
        <div class="grid c2">
          <a class="plink" href="/programs/partial-hospitalization-program-php"><span class="t">PHP</span><span class="d">Partial hospitalization</span></a>
          <a class="plink" href="/programs/intensive-outpatient-program-iop"><span class="t">IOP</span><span class="d">Intensive outpatient</span></a>
          <a class="plink" href="/programs/outpatient-program"><span class="t">Outpatient</span><span class="d">Flexible OP care</span></a>
          <a class="plink" href="/programs/virtual-iop-california"><span class="t">Virtual IOP</span><span class="d">Telehealth, CA-wide</span></a>
          <a class="plink" href="/programs/mental-health-diversion"><span class="t">MH Diversion</span><span class="d">Court-involved care</span></a>
        </div>
      </div></div>

      <div class="panel" data-for="treat"><div class="panel-card">
        <a class="overview" href="/what-we-treat"><span class="ot">What We Treat Overview <svg viewBox="0 0 16 16"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span class="od">Specialized care for mental health, substance use, eating disorders &amp; co-occurring conditions.</span></a>
        <div class="grid c4">
          <div class="gcol">
            <div class="h5">Mental Health</div>
            <a class="plink" href="/what-we-treat/mental-health-treatment/anxiety-treatment-los-angeles"><span class="t">Anxiety</span></a>
            <a class="plink" href="/what-we-treat/mental-health-treatment/depression-treatment-los-angeles"><span class="t">Depression</span></a>
            <a class="plink" href="/what-we-treat/mental-health-treatment/ptsd-treatment"><span class="t">PTSD</span></a>
            <a class="plink" href="/what-we-treat/mental-health-treatment/adhd-treatment"><span class="t">ADHD</span></a>
            <a class="plink" href="/what-we-treat/mental-health-treatment/bipolar-disorder-treatment"><span class="t">Bipolar</span></a>
            <a class="plink" href="/what-we-treat/mental-health-treatment/what-is-ocd"><span class="t">OCD</span></a>
          </div>
          <div class="gcol">
            <div class="h5">Substance Use</div>
            <a class="plink" href="/what-we-treat/substance-use-treatment/alcohol-addiction-treatment"><span class="t">Alcohol</span></a>
            <a class="plink" href="/what-we-treat/substance-use-treatment/opioid-addiction-treatment"><span class="t">Opioids</span></a>
            <a class="plink" href="/what-we-treat/substance-use-treatment/stimulant-addiction-treatment"><span class="t">Stimulants</span></a>
            <a class="plink" href="/what-we-treat/substance-use-treatment/cocaine-crack-addiction-treatment"><span class="t">Cocaine &amp; Crack</span></a>
            <a class="plink" href="/what-we-treat/substance-use-treatment/prescription-drug-addiction-treatment"><span class="t">Prescription Drugs</span></a>
            <a class="plink" href="/what-we-treat/substance-use-treatment"><span class="t">View All →</span></a>
          </div>
          <div class="gcol">
            <div class="h5">Eating Disorders</div>
            <a class="plink" href="/what-we-treat/eating-disorders"><span class="t">Overview</span></a>
            <a class="plink" href="/what-we-treat/eating-disorders/anorexia"><span class="t">Anorexia</span></a>
            <a class="plink" href="/what-we-treat/eating-disorders/binge-eating-disorder"><span class="t">Binge Eating</span></a>
          </div>
          <div class="gcol">
            <div class="h5">Dual Diagnosis</div>
            <a class="plink" href="/what-we-treat/dual-diagnosis-treatment"><span class="t">Overview</span><span class="d">Co-occurring care</span></a>
          </div>
        </div>
      </div></div>

      <div class="panel" data-for="services"><div class="panel-card">
        <a class="overview" href="/therapies-services"><span class="ot">Services Overview <svg viewBox="0 0 16 16"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span class="od">Therapies and wraparound support across your whole recovery.</span></a>
        <div class="grid c2">
          <a class="plink" href="/therapies-services/individual-therapy"><span class="t">Individual Therapy</span><span class="d">1:1 sessions</span></a>
          <a class="plink" href="/therapies-services/group-therapy"><span class="t">Group Therapy</span><span class="d">Peer healing</span></a>
          <a class="plink" href="/therapies-services/family-therapy"><span class="t">Family Therapy</span><span class="d">Whole-system care</span></a>
          <a class="plink" href="/therapies-services/psychiatry-medication-management"><span class="t">Psychiatry</span><span class="d">Medication support</span></a>
          <a class="plink" href="/therapies-services/sober-living-support"><span class="t">Sober Living</span><span class="d">Structured housing</span></a>
          <a class="plink" href="/therapies-services/aftercare-continuing-care"><span class="t">Aftercare</span><span class="d">Continuing care</span></a>
        </div>
      </div></div>

      <div class="panel" data-for="admissions"><div class="panel-card">
        <a class="overview" href="/admissions"><span class="ot">Admissions Overview <svg viewBox="0 0 16 16"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span class="od">Start the process — most clients begin within 24–48 hours.</span></a>
        <div class="grid c2">
          <a class="plink" href="/admissions/how-admissions-works"><span class="t">How Admissions Works</span><span class="d">Step by step</span></a>
          <a class="plink" href="/admissions/verify-insurance"><span class="t">Verify Insurance</span><span class="d">Free benefits check</span></a>
          <a class="plink" href="/admissions/what-to-expect"><span class="t">What to Expect</span><span class="d">Your first days</span></a>
          <a class="plink" href="/admissions/professional-referrals"><span class="t">Professional Referrals</span><span class="d">Attorneys, therapists, case mgrs</span></a>
        </div>
      </div></div>
    </div>
  </div>

  <div class="mobile-menu">
    <div class="wrap"><div class="mm-card">
      <ul class="mnav">
        <li><button class="macc" aria-expanded="false">About <svg class="micon" viewBox="0 0 12 12"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round"/></svg></button>
          <div class="msub"><div class="msub-inner">
            <a href="/about" style="color:var(--blue);font-weight:800">About Overview →</a>
            <a href="/about/ourstory-mission">Our Story &amp; Mission</a>
            <a href="/about/meet-the-clinical-team">Clinical Team</a>
            <a href="/about/treatment-philosophy-approach">Our Approach</a>
            <a href="/about/accreditation-licensing">Accreditation</a>
          </div></div></li>
        <li><button class="macc" aria-expanded="false">Programs <svg class="micon" viewBox="0 0 12 12"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round"/></svg></button>
          <div class="msub"><div class="msub-inner">
            <a href="/programs" style="color:var(--blue);font-weight:800">Programs Overview →</a>
            <a href="/programs/partial-hospitalization-program-php">PHP</a>
            <a href="/programs/intensive-outpatient-program-iop">IOP</a>
            <a href="/programs/outpatient-program">Outpatient</a>
            <a href="/programs/virtual-iop-california">Virtual IOP</a>
            <a href="/programs/mental-health-diversion">MH Diversion</a>
          </div></div></li>
        <li><button class="macc" aria-expanded="false">What We Treat <svg class="micon" viewBox="0 0 12 12"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round"/></svg></button>
          <div class="msub"><div class="msub-inner">
            <a href="/what-we-treat" style="color:var(--blue);font-weight:800">What We Treat Overview →</a>
            <div class="mh">Mental Health</div>
            <a href="/what-we-treat/mental-health-treatment/anxiety-treatment-los-angeles">Anxiety</a>
            <a href="/what-we-treat/mental-health-treatment/depression-treatment-los-angeles">Depression</a>
            <a href="/what-we-treat/mental-health-treatment/ptsd-treatment">PTSD</a>
            <a href="/what-we-treat/mental-health-treatment/adhd-treatment">ADHD</a>
            <a href="/what-we-treat/mental-health-treatment/bipolar-disorder-treatment">Bipolar</a>
            <a href="/what-we-treat/mental-health-treatment/what-is-ocd">OCD</a>
            <div class="mh">Substance Use</div>
            <a href="/what-we-treat/substance-use-treatment/alcohol-addiction-treatment">Alcohol</a>
            <a href="/what-we-treat/substance-use-treatment/opioid-addiction-treatment">Opioids</a>
            <a href="/what-we-treat/substance-use-treatment/stimulant-addiction-treatment">Stimulants</a>
            <a href="/what-we-treat/substance-use-treatment/cocaine-crack-addiction-treatment">Cocaine &amp; Crack</a>
            <a href="/what-we-treat/substance-use-treatment/prescription-drug-addiction-treatment">Prescription Drugs</a>
            <a href="/what-we-treat/substance-use-treatment">View All →</a>
            <div class="mh">Eating Disorders</div>
            <a href="/what-we-treat/eating-disorders">Overview</a>
            <a href="/what-we-treat/eating-disorders/anorexia">Anorexia</a>
            <a href="/what-we-treat/eating-disorders/binge-eating-disorder">Binge Eating</a>
            <div class="mh">Dual Diagnosis</div>
            <a href="/what-we-treat/dual-diagnosis-treatment">Overview</a>
          </div></div></li>
        <li><button class="macc" aria-expanded="false">Services <svg class="micon" viewBox="0 0 12 12"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round"/></svg></button>
          <div class="msub"><div class="msub-inner">
            <a href="/therapies-services" style="color:var(--blue);font-weight:800">Services Overview →</a>
            <a href="/therapies-services/individual-therapy">Individual Therapy</a>
            <a href="/therapies-services/group-therapy">Group Therapy</a>
            <a href="/therapies-services/family-therapy">Family Therapy</a>
            <a href="/therapies-services/psychiatry-medication-management">Psychiatry</a>
            <a href="/therapies-services/sober-living-support">Sober Living</a>
            <a href="/therapies-services/aftercare-continuing-care">Aftercare</a>
          </div></div></li>
        <li><button class="macc" aria-expanded="false">Admissions <svg class="micon" viewBox="0 0 12 12"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round"/></svg></button>
          <div class="msub"><div class="msub-inner">
            <a href="/admissions" style="color:var(--blue);font-weight:800">Admissions Overview →</a>
            <a href="/admissions/how-admissions-works">How Admissions Works</a>
            <a href="/admissions/verify-insurance">Verify Insurance</a>
            <a href="/admissions/what-to-expect">What to Expect</a>
            <a href="/admissions/professional-referrals">Professional Referrals</a>
          </div></div></li>
      </ul>
      <div class="mcta">
        <a class="ghost" href="/admissions/verify-insurance">Verify Insurance</a>
        <a class="solid" href="/admissions">Get Help Now</a>
      </div>
      <div class="mutil">
        <a href="/admissions/professional-referrals">For Referrals</a>
        <a href="/for-families">For Families</a>
        <a class="mtel" href="tel:14243274040">Call (424) 327-4040</a>
      </div>
    </div></div>
  </div>
</div>`;

    // ---------- behavior ----------
    // Make every link navigate the top-level window directly. Without this,
    // links can open inside an iframe/popup context (instead of going straight
    // to the page) when the header is embedded.
    shadow.querySelectorAll('a[href]').forEach(a => a.setAttribute('target', '_top'));

    const root = shadow.querySelector('.root');
    const btns = Array.from(shadow.querySelectorAll('.navbtn'));
    const panels = Array.from(shadow.querySelectorAll('.panel'));
    const burger = shadow.querySelector('.burger');
    const mobile = shadow.querySelector('.mobile-menu');
    let current = null;

    const openPanel = (key) => {
      panels.forEach(p => p.classList.toggle('show', p.getAttribute('data-for') === key));
      btns.forEach(b => b.classList.toggle('active', b.getAttribute('data-panel') === key));
      current = key;
    };
    const closePanel = () => {
      panels.forEach(p => p.classList.remove('show'));
      btns.forEach(b => b.classList.remove('active'));
      current = null;
    };

    btns.forEach(b => b.addEventListener('click', (e) => {
      e.stopPropagation();
      const key = b.getAttribute('data-panel');
      (current === key) ? closePanel() : openPanel(key);
    }));

    // close when clicking anywhere outside an open panel/button
    document.addEventListener('click', (e) => {
      if (!current) return;
      const path = e.composedPath ? e.composedPath() : [];
      const inside = path.some(n => n.classList && (n.classList.contains('panel-card') || n.classList.contains('navbtn')));
      if (!inside) closePanel();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePanel(); });

    // mobile
    if (burger && mobile) {
      burger.addEventListener('click', () => {
        const open = root.classList.toggle('menu-open');
        mobile.classList.toggle('show', open);
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) closePanel();
      });
      shadow.querySelectorAll('.macc').forEach(btn => {
        btn.addEventListener('click', () => {
          const sub = btn.nextElementSibling;
          const isOpen = btn.getAttribute('aria-expanded') === 'true';
          shadow.querySelectorAll('.macc').forEach(b => { b.setAttribute('aria-expanded', 'false'); b.nextElementSibling.style.maxHeight = null; });
          if (!isOpen) { btn.setAttribute('aria-expanded', 'true'); sub.style.maxHeight = sub.scrollHeight + 'px'; }
        });
      });
      shadow.querySelectorAll('.mobile-menu a').forEach(a => {
        a.addEventListener('click', () => {
          root.classList.remove('menu-open');
          mobile.classList.remove('show');
          burger.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }
}

if (!customElements.get('ltw-header')) {
  customElements.define('ltw-header', LTWHeader);
}
