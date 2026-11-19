import {asset} from '@/lib/base'
/** Brand marks used to show where I work and study. Logos belong to their owners. */
export function FreedomLogo({className = ''}: {className?: string}) {
  return <span className={'logo-freedom ' + className}>
    <img className="on-light" src={asset('/media/logos/freedom-logo.svg')} alt="Freedom" width={1500} height={337}/>
    <img className="on-dark" src={asset('/media/logos/freedom-logo-dark.svg')} alt="" aria-hidden="true" width={1500} height={337}/>
  </span>
}
export function FreedomMark({size = 22}: {size?: number}) {
  return <img src={asset('/media/logos/freedom-mark.svg')} alt="" aria-hidden="true" width={size} height={size} className="mark"/>
}
export function AituLogo({className = ''}: {className?: string}) {
  return <img className={'logo-aitu ' + className} src={asset('/media/logos/aitu-logo.png')} alt="Astana IT University" width={230} height={141}/>
}

/** A clay-style staff badge on a lanyard. Swings when you hover it. */
export function FreedomBadge() {
  return <a className="badge" href="#experience" aria-label="Software Engineer at Freedom Cloud Holding Ltd. Jump to experience">
    <span className="lanyard" aria-hidden="true"/>
    <span className="badge-card">
      <span className="badge-clip" aria-hidden="true"/>
      <FreedomLogo className="badge-logo"/>
      <span className="badge-photo"><img src={asset('/media/portraits/profile-small.webp')} alt="" width={600} height={900}/></span>
      <span className="badge-text">
        <small>Freedom Cloud Holding Ltd.</small>
        <b>Akmaral Aryntay</b>
        <span>Software Engineer</span>
      </span>
      <span className="badge-strip" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/><i/></span>
    </span>
  </a>
}
