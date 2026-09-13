import React from "react";

export function ConceptVisual({ visualKey, accent = "teal" }) {
  const fg = accent === "teal" ? "var(--cc-teal, #4FD8C4)" : "var(--cc-coral, #FF7A5C)";
  const pale = "var(--cc-off, #EAF6F5)";
  const sand = "var(--cc-sand, #F2D9A8)";
  const sea = "var(--cc-sea, #2A9C90)";
  const soft = "rgba(234,246,245,.18)";

  const common = { width: 86, height: 86, viewBox: "0 0 120 120", role: "img", "aria-hidden": true };

  switch (visualKey) {
    case "chloroplast":
      return <svg {...common}>
        <ellipse cx="60" cy="60" rx="43" ry="30" fill={fg} opacity=".9" stroke={pale} strokeWidth="3"/>
        <ellipse cx="60" cy="60" rx="35" ry="22" fill="rgba(255,255,255,.08)" stroke={soft} strokeWidth="1.5"/>
        {[48,57,66,75].map((y) => <path key={y} d={`M35 ${y}c5 4 11 6 18 6s13-2 18-6`} fill="none" stroke={pale} strokeWidth="2" strokeLinecap="round"/>)}
        <circle cx="40" cy="41" r="3" fill={pale}/><circle cx="79" cy="72" r="2.8" fill={pale}/><circle cx="71" cy="45" r="2.4" fill={pale}/>
      </svg>;
    case "mitochondrion":
      return <svg {...common}>
        <path d="M22 63c0-21 18-33 40-33 22 0 36 13 36 30 0 18-16 33-39 33-22 0-37-12-37-30z" fill={fg} opacity=".92" stroke={pale} strokeWidth="3"/>
        <path d="M30 58c11-14 23-18 44-17M30 68c12-13 24-15 48-12M35 78c9-6 18-8 30-8 8 0 14 1 20 4" fill="none" stroke={pale} strokeWidth="3" strokeLinecap="round"/>
      </svg>;
    case "seagrass":
      return <svg {...common}>
        <path d="M18 88H102" stroke={sand} strokeWidth="12" strokeLinecap="round"/>
        <path d="M32 88C34 65 30 42 42 23M51 88C55 60 55 38 65 19M69 88C72 62 78 47 88 30" stroke={fg} strokeWidth="7" fill="none" strokeLinecap="round"/>
        <path d="M28 91C39 84 50 85 61 91M53 92C67 85 80 85 94 92" stroke={sea} strokeWidth="4" fill="none"/>
        <path d="M41 91v14M60 92v15M80 92v12" stroke={sand} strokeWidth="3"/>
        <circle cx="72" cy="43" r="5" fill="var(--cc-coral,#FF7A5C)"/>
      </svg>;
    case "kelp":
      return <svg {...common}>
        <path d="M55 96C58 70 59 48 60 20" stroke={sand} strokeWidth="5" fill="none" strokeLinecap="round"/>
        <path d="M60 31C46 29 34 19 28 12M61 41C77 37 89 25 94 16M60 53C44 54 31 65 25 77M60 64C75 64 89 75 97 86" stroke={fg} strokeWidth="10" fill="none" strokeLinecap="round"/>
        {[31,41,53,64].map((y,i)=><circle key={y} cx={i%2===0?56:65} cy={y} r="5" fill="var(--cc-teal,#4FD8C4)"/>)}
        <path d="M42 99c10-10 28-10 38 0M50 103c7-7 16-7 23 0" stroke={sand} strokeWidth="5" fill="none" strokeLinecap="round"/>
      </svg>;
    case "dinoflagellate":
      return <svg {...common}>
        <path d="M32 50c0-20 14-31 29-31 18 0 31 15 31 33 0 20-14 35-31 35-18 0-29-15-29-37z" fill={fg} opacity=".85" stroke={pale} strokeWidth="3"/>
        <path d="M34 45c18 8 39 8 56 0" fill="none" stroke={pale} strokeWidth="2"/>
        <path d="M83 76c18 11 25 21 18 30M35 68c-19 8-27 17-25 28" fill="none" stroke={fg} strokeWidth="3" strokeLinecap="round"/>
        <circle cx="57" cy="49" r="8" fill={sea}/><circle cx="72" cy="65" r="6" fill={sea}/>
      </svg>;
    case "diatom":
      return <svg {...common}>
        <ellipse cx="60" cy="60" rx="38" ry="27" fill="rgba(255,255,255,.035)" stroke={fg} strokeWidth="4"/>
        <ellipse cx="60" cy="60" rx="31" ry="20" fill="none" stroke={pale} strokeWidth="2"/>
        {[35,45,55,65,75,85].map((x)=><path key={x} d={`M${x} 41v38`} stroke={fg} strokeWidth="1.8" opacity=".75"/>)}
        <path d="M26 60h68M34 49h52M34 71h52" stroke={pale} strokeWidth="1.5" opacity=".7"/>
      </svg>;
    case "sonar":
      return <svg {...common}>
        <path d="M18 35h84v18H18z" fill={sand} opacity=".9"/><path d="M28 53h64l-9 17H37z" fill={fg} opacity=".85"/>
        <path d="M60 72c-22 9-30 17-34 33M60 72c22 9 30 17 34 33" stroke={fg} strokeWidth="3" fill="none" strokeLinecap="round"/>
        <path d="M41 92c13 7 25 7 38 0" stroke={pale} strokeWidth="2" fill="none" opacity=".75"/>
      </svg>;
    case "radar":
      return <svg {...common}>
        <path d="M60 92V55" stroke={sand} strokeWidth="5"/><path d="M31 42c17-17 43-17 60 0L60 62 31 42z" fill={fg} opacity=".85" stroke={pale} strokeWidth="2"/>
        <path d="M60 62c13-2 26-9 37-20M60 62c18 1 34 6 47 14M60 62c9-13 13-28 11-43" stroke={fg} strokeWidth="2.6" fill="none" strokeLinecap="round"/>
      </svg>;
    case "sand":
      return <svg {...common}>
        {[ [25,35,13],[56,29,14],[88,39,12],[39,66,14],[73,68,15],[99,75,10],[23,91,11],[55,94,12],[86,98,10] ].map(([x,y,r],i)=><circle key={i} cx={x} cy={y} r={r} fill={sand} opacity=".92" stroke={pale} strokeWidth="1.5"/>)}
        <circle cx="44" cy="47" r="4" fill="var(--cc-teal,#4FD8C4)"/><circle cx="74" cy="49" r="4" fill="var(--cc-teal,#4FD8C4)"/>
      </svg>;
    case "mud":
      return <svg {...common}>
        {Array.from({length:38}).map((_,i)=>{
          const x=18+(i%8)*12+(i%2)*2, y=28+Math.floor(i/8)*14;
          return <circle key={i} cx={x} cy={y} r="6.5" fill={i%3===0?sea:sand} opacity=".82"/>;
        })}
        <path d="M18 84c21 10 42 10 84 0" stroke={fg} strokeWidth="5" opacity=".45"/>
      </svg>;
    case "fossil":
      return <svg {...common}>
        <path d="M45 19h31v17H45zM51 36h19v55H51z" fill={fg} opacity=".9"/>
        <path d="M30 92h62M38 71h45M37 56h47" stroke={sand} strokeWidth="5" strokeLinecap="round"/>
        <path d="M77 31c13 3 22 11 27 23" stroke={pale} strokeWidth="3" fill="none"/>
        <circle cx="60" cy="101" r="8" fill="var(--cc-coral,#FF7A5C)" opacity=".9"/>
      </svg>;
    case "renewable":
      return <svg {...common}>
        <path d="M60 43v51" stroke={sand} strokeWidth="5"/>
        <circle cx="60" cy="39" r="5" fill={pale}/>
        <path d="M60 39L32 20M60 39l28-15M60 39l3 33" stroke={fg} strokeWidth="6" strokeLinecap="round"/>
        <path d="M16 100c15-9 29-9 44 0 15-9 29-9 44 0" stroke="var(--cc-teal,#4FD8C4)" strokeWidth="4" fill="none"/>
      </svg>;
    case "openAquaculture":
      return <svg {...common}>
        <path d="M15 44h90M15 82h90" stroke={fg} strokeWidth="4"/>
        <path d="M25 44v39M42 44v39M60 44v39M78 44v39M95 44v39" stroke={pale} strokeWidth="1.8" opacity=".75"/>
        {[ [35,60],[59,68],[80,57] ].map(([x,y],i)=><g key={i}><ellipse cx={x} cy={y} rx="9" ry="5" fill={sand}/><path d={`M${x+8} ${y}l7-5v10z`} fill={sand}/></g>)}
        <path d="M14 97c15-7 30-7 45 0 15-7 30-7 46 0" stroke="var(--cc-teal,#4FD8C4)" strokeWidth="4" fill="none"/>
      </svg>;
    case "closedAquaculture":
      return <svg {...common}>
        <path d="M18 38h68v53H18z" fill="rgba(255,255,255,.03)" stroke={fg} strokeWidth="4"/>
        <path d="M20 63h64" stroke="var(--cc-teal,#4FD8C4)" strokeWidth="4"/>
        {[ [37,51],[57,76] ].map(([x,y],i)=><g key={i}><ellipse cx={x} cy={y} rx="9" ry="5" fill={sand}/><path d={`M${x+8} ${y}l7-5v10z`} fill={sand}/></g>)}
        <path d="M87 48h14v25H87M101 60h9" stroke={pale} strokeWidth="4" fill="none" strokeLinecap="round"/>
        <circle cx="105" cy="60" r="7" fill={fg} opacity=".85"/>
      </svg>;
    default:
      return <svg {...common}><circle cx="60" cy="60" r="34" fill={fg} opacity=".2" stroke={fg} strokeWidth="3"/><circle cx="60" cy="60" r="8" fill={fg}/></svg>;
  }
}
