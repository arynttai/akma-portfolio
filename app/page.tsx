import Nav from '@/components/Nav'
import Home from '@/components/Home'
import Projects from '@/components/Projects'
import Experience from '@/components/Experience'
import About, {Contact} from '@/components/About'
import ProjectSheet from '@/components/ProjectSheet'
import Guide from '@/components/Guide'
import Reveal from '@/components/Reveal'
import Cursor from '@/components/Cursor'

export default function Page() {
  return <>
    <Reveal/>
    <Nav/>
    <main id="main" tabIndex={-1}>
      <Home/>
      <Projects/>
      <Experience/>
      <About/>
      <Contact/>
    </main>
    <ProjectSheet/>
    <Guide/>
    <Cursor/>
  </>
}
