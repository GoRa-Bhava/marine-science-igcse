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

    case "saltDissolving":
      return <svg {...common}>
        <path d="M25 42h70l-7 56H32z" fill="rgba(132,187,243,.12)" stroke={pale} strokeWidth="2.5"/>
        <path d="M31 61h58" stroke="#84bbf3" strokeWidth="4" opacity=".8"/>
        <g fill={sand}>
          <rect x="42" y="67" width="8" height="8" rx="1"/><rect x="59" y="73" width="8" height="8" rx="1"/>
          <rect x="74" y="65" width="8" height="8" rx="1"/>
        </g>
        <g fill={fg}>
          <circle cx="45" cy="48" r="4"/><circle cx="61" cy="51" r="3.5"/><circle cx="77" cy="48" r="4"/>
        </g>
        <path d="M32 28c10-8 46-8 56 0" stroke={fg} strokeWidth="3" fill="none" strokeLinecap="round"/>
        <path d="M39 23l-7 5 7 5M81 23l7 5-7 5" stroke={fg} strokeWidth="3" fill="none" strokeLinecap="round"/>
      </svg>;
    case "gasEscaping":
      return <svg {...common}>
        <path d="M25 42h70l-7 56H32z" fill="rgba(132,187,243,.12)" stroke={pale} strokeWidth="2.5"/>
        <path d="M31 61h58" stroke="#84bbf3" strokeWidth="4" opacity=".8"/>
        <g fill={fg}>
          <circle cx="43" cy="77" r="5"/><circle cx="60" cy="70" r="4"/><circle cx="76" cy="81" r="4.5"/>
          <circle cx="48" cy="54" r="4"/><circle cx="66" cy="47" r="3.5"/>
          <circle cx="79" cy="36" r="3"/><circle cx="60" cy="27" r="3"/>
        </g>
        <path d="M80 48c8-7 10-14 8-21M62 41c4-7 4-13 2-20" stroke={fg} strokeWidth="2.8" fill="none" strokeLinecap="round"/>
        <path d="M83 27l5-1 1 5M59 21l5-1 1 5" stroke={fg} strokeWidth="2.5" fill="none"/>
      </svg>;
    case "sexualRepro":
      return <svg {...common}>
        <circle cx="37" cy="49" r="18" fill={fg} opacity=".8" stroke={pale} strokeWidth="2.5"/>
        <circle cx="83" cy="49" r="18" fill={fg} opacity=".45" stroke={pale} strokeWidth="2.5"/>
        <path d="M49 61l11 13M71 61L60 74" stroke={sand} strokeWidth="4" strokeLinecap="round"/>
        <circle cx="60" cy="87" r="14" fill={sand} opacity=".9" stroke={pale} strokeWidth="2"/>
        <path d="M52 88c5-6 11-6 16 0M60 79v16" stroke={fg} strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      </svg>;
    case "asexualRepro":
      return <svg {...common}>
        <circle cx="49" cy="60" r="25" fill={fg} opacity=".85" stroke={pale} strokeWidth="2.5"/>
        <circle cx="83" cy="45" r="13" fill={fg} opacity=".85" stroke={pale} strokeWidth="2.2"/>
        <path d="M67 51c5-4 8-7 10-11" stroke={pale} strokeWidth="3" fill="none" strokeLinecap="round"/>
        <path d="M39 57c8-7 16-7 24 0M74 43c4-4 8-4 12 0" stroke={sand} strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <text x="31" y="97" fill={pale} fontSize="12" fontWeight="800">1 → 2</text>
      </svg>;
    case "nares":
      return <svg {...common}>
        <path d="M18 61c20-22 50-29 82-10-8 21-35 34-62 27-10-3-17-8-20-17z" fill={fg} opacity=".48" stroke={pale} strokeWidth="2.5"/>
        <circle cx="41" cy="52" r="4" fill={pale}/>
        <circle cx="30" cy="58" r="3.8" fill={sand}/><circle cx="36" cy="61" r="3.8" fill={sand}/>
        <path d="M8 43c8 1 13 4 19 9M7 74c8-1 13-4 21-10" stroke={fg} strokeWidth="3" fill="none" strokeLinecap="round"/>
        <circle cx="13" cy="40" r="2.5" fill={fg}/><circle cx="10" cy="77" r="2.5" fill={fg}/>
      </svg>;
    case "lateralLine":
      return <svg {...common}>
        <path d="M15 60c18-20 49-28 79-8l12 8-12 8c-30 20-61 12-79-8z" fill={fg} opacity=".42" stroke={pale} strokeWidth="2.5"/>
        <circle cx="39" cy="52" r="4" fill={pale}/>
        <path d="M28 63c18-5 40-5 62 0" stroke={sand} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
        {[35,45,55,65,75,85].map((x)=><circle key={x} cx={x} cy="62.5" r="2.2" fill={sand}/>)}
        <path d="M8 37c7 4 10 8 12 14M8 83c7-4 10-8 12-14" stroke={fg} strokeWidth="2.5" fill="none"/>
      </svg>;
    case "detritivore":
      return <svg {...common}>
        <ellipse cx="60" cy="65" rx="27" ry="16" fill={fg} opacity=".82" stroke={pale} strokeWidth="2.5"/>
        <circle cx="42" cy="57" r="7" fill={fg} stroke={pale} strokeWidth="2"/>
        <path d="M36 49l-9-9M48 50l7-10M41 72l-8 15M55 76l-2 16M68 76l4 15M82 70l9 12" stroke={sand} strokeWidth="3" strokeLinecap="round"/>
        <g fill={sand} opacity=".85"><circle cx="24" cy="89" r="4"/><circle cx="35" cy="95" r="3"/><circle cx="47" cy="90" r="2.8"/></g>
        <path d="M31 85c10-8 17-10 24-7" stroke={pale} strokeWidth="2" fill="none"/>
      </svg>;
    case "decomposer":
      return <svg {...common}>
        <path d="M32 83c-12-10-10-26 3-34 12-8 22 0 30 7 11-9 26-7 31 6 6 15-7 29-22 28-17-1-25 4-42-7z" fill={fg} opacity=".5" stroke={pale} strokeWidth="2.5"/>
        <g fill={sand}><circle cx="39" cy="59" r="4"/><circle cx="57" cy="72" r="3.5"/><circle cx="78" cy="57" r="4"/><circle cx="83" cy="77" r="3"/></g>
        <path d="M22 32c10 7 15 13 17 22M54 28c5 8 7 16 6 27M92 31c-7 7-10 15-9 26" stroke={fg} strokeWidth="2.7" fill="none" strokeLinecap="round"/>
        <path d="M20 27l3 8 7-4M53 23l1 8 8-2M97 26l-7 4 3 7" stroke={fg} strokeWidth="2.2" fill="none"/>
      </svg>;
    case "respirationCell":
      return <svg {...common}>
        <circle cx="60" cy="60" r="42" fill="rgba(255,255,255,.035)" stroke={pale} strokeWidth="2.5"/>
        <circle cx="47" cy="48" r="11" fill={sea} opacity=".8"/>
        <path d="M53 68c0-13 11-20 24-20 13 0 21 8 21 18 0 11-10 21-23 21-13 0-22-7-22-19z" fill={fg} opacity=".85" stroke={pale} strokeWidth="2"/>
        <path d="M59 66c7-8 14-10 25-9M59 75c8-7 15-8 26-5" stroke={pale} strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M25 28l11 10M97 94L86 83" stroke={sand} strokeWidth="3" strokeLinecap="round"/>
      </svg>;
    case "gasExchange":
      return <svg {...common}>
        <path d="M26 28c18 8 30 17 36 31M26 44c17 7 29 14 36 26M26 60c15 5 27 10 36 19" stroke={fg} strokeWidth="5" fill="none" strokeLinecap="round"/>
        <path d="M67 28v58" stroke={pale} strokeWidth="3"/>
        <path d="M75 39h28M96 33l7 6-7 6" stroke="var(--cc-teal,#4FD8C4)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M103 72H75M82 66l-7 6 7 6" stroke="var(--cc-coral,#FF7A5C)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <text x="81" y="29" fill="var(--cc-teal,#4FD8C4)" fontSize="11" fontWeight="900">O₂</text>
        <text x="82" y="93" fill="var(--cc-coral,#FF7A5C)" fontSize="11" fontWeight="900">CO₂</text>
      </svg>;
    case "pelagic":
      return <svg {...common}>
        <path d="M14 25h92v71H14z" fill="rgba(132,187,243,.12)" stroke={pale} strokeWidth="2"/>
        <path d="M14 43h92" stroke="#84bbf3" strokeWidth="3" opacity=".7"/>
        <g fill={fg} opacity=".9">
          <ellipse cx="42" cy="62" rx="12" ry="6"/><path d="M52 62l9-6v12z"/>
          <ellipse cx="75" cy="78" rx="10" ry="5"/><path d="M84 78l8-5v10z"/>
        </g>
        <circle cx="70" cy="52" r="4" fill={sand}/><circle cx="77" cy="48" r="2.5" fill={sand}/><circle cx="64" cy="47" r="2.3" fill={sand}/>
        <path d="M18 92h84" stroke={sand} strokeWidth="5" opacity=".4"/>
      </svg>;
    case "benthic":
      return <svg {...common}>
        <path d="M14 25h92v71H14z" fill="rgba(132,187,243,.10)" stroke={pale} strokeWidth="2"/>
        <path d="M14 78c18-8 31-5 44 0 18-8 33-7 48 1v17H14z" fill={sand} opacity=".7"/>
        <path d="M43 77c-7-12-2-21 7-22 9-1 15 8 11 19" fill={fg} opacity=".75" stroke={pale} strokeWidth="2"/>
        <circle cx="47" cy="63" r="2.5" fill={pale}/><circle cx="56" cy="63" r="2.5" fill={pale}/>
        <path d="M75 78l6-14 6 14M78 71h6" stroke={fg} strokeWidth="3" fill="none" strokeLinecap="round"/>
      </svg>;
    case "pneumatophore":
      return <svg {...common}>
        <path d="M14 76h92v26H14z" fill={sand} opacity=".75"/>
        <path d="M14 72h92" stroke="#84bbf3" strokeWidth="5" opacity=".55"/>
        {[28,42,56,70,84,96].map((x,i)=><path key={x} d={`M${x} 79V${41+(i%3)*7}`} stroke={fg} strokeWidth="5" strokeLinecap="round"/>)}
        <path d="M26 38l3-8 3 8M54 31l3-8 3 8M82 38l3-8 3 8" stroke={pale} strokeWidth="2.5" fill="none"/>
      </svg>;
    case "propRoot":
      return <svg {...common}>
        <path d="M14 82h92v20H14z" fill={sand} opacity=".75"/>
        <path d="M60 20v37" stroke={fg} strokeWidth="12" strokeLinecap="round"/>
        <path d="M57 48C45 56 37 67 31 87M63 48C76 56 84 67 91 87M57 54C50 63 48 75 46 91M64 54C71 63 74 75 76 91" stroke={fg} strokeWidth="6" fill="none" strokeLinecap="round"/>
        <path d="M18 79h84" stroke="#84bbf3" strokeWidth="4" opacity=".55"/>
      </svg>;

    default:
      return <svg {...common}><circle cx="60" cy="60" r="34" fill={fg} opacity=".2" stroke={fg} strokeWidth="3"/><circle cx="60" cy="60" r="8" fill={fg}/></svg>;
  }
}
