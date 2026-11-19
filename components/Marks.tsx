export function Monogram() {
  return <svg className="monogram" aria-hidden="true" viewBox="0 0 52 32" fill="currentColor"><path d="M0 30 17 2h9l-4 28h-8l1-6H10l-4 6zm14-12h3l1-7zm9 12L40 2h10l-4 28h-9l1-6h-5l-4 6zm14-12h3l1-7z"/></svg>
}

export function Signal({className = ''}: {className?: string}) {
  return <svg className={className} viewBox="0 0 104 32" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">{Array.from({length: 37}, (_, i) => {
    const height = 2 + 24 * Math.pow(Math.abs(Math.sin(i * .35) * Math.cos(i * .09)),1.45)
    return <path key={i} d={`M${2+i*2.75} ${16-height/2}v${height}`}/>
  })}</svg>
}

export function Icon({name, size = 18}: {name: 'grid'|'wave'|'previous'|'next'|'pin'|'mail'|'menu'|'close'|'play'|'pause'|'save'|'reset'|'expand'|'disc'|'link'|'file'|'arrow'|'github'|'linkedin'|'send', size?:number}) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
    wave: <path d="M2 12h3l2-7 4 15 3-17 3 13 2-4h3"/>,
    previous: <path d="m14.5 5-7 7 7 7"/>, next: <path d="m9.5 5 7 7-7 7"/>,
    pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    mail: <><rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="m3 6 9 7 9-7"/></>,
    menu: <path d="M3 7h18M3 12h18M3 17h18"/>, close:<path d="m5 5 14 14M19 5 5 19"/>,
    play:<path d="m8 4 12 8-12 8z"/>,pause:<path d="M8 4v16M16 4v16"/>,
    save:<><path d="M12 3v12m-5-5 5 5 5-5M4 15v5h16v-5"/></>,
    reset:<><path d="M3 4v6h6M3.5 10a8 8 0 1 1 1 7"/></>,
    expand:<path d="M3 9V3h6m6 0h6v6m0 6v6h-6m-6 0H3v-6"/>,
    disc:<><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/><path d="M6 11a6 6 0 0 1 5-5"/></>,
    link:<><path d="m10 13 4-4m-6 1-2 2a4 4 0 0 0 6 6l2-2m-1-8 2-2a4 4 0 0 1 6 6l-2 2"/></>,
    file:<><path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4M9 13h6M9 17h6"/></>,
    arrow:<path d="M5 12h14m-6-6 6 6-6 6"/>,
    github:<path d="M9 19c-4 1.5-4-2-6-2.5m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>,
    send:<path d="M21 3 3 10.5l7 2.5 2.5 7L21 3Zm-11 10 5-5"/>,
    linkedin:<><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/></>
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.65" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

