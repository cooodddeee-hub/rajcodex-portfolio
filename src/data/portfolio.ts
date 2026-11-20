export type Project = { title: string; summary: string; stack: string[]; liveUrl: string; featured?: boolean; mark: string }

export const navigation = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Achievement', href: '#achievement' },
  { label: 'Contact', href: '#contact' },
]

export const projects: Project[] = [
  { title: 'MentorX', summary: 'A platform that helps people find teammates and collaborators for their projects.', stack: ['React', 'Node.js', 'MongoDB'], liveUrl: 'https://mentorx-alpha.vercel.app/', featured: true, mark: 'MX' },
  { title: 'SplitX', summary: 'A shared-expense app for organizing group spending and splitting bills.', stack: ['React', 'JavaScript'], liveUrl: 'https://splitxx.vercel.app/dashboard', mark: 'SX' },
  { title: 'VAHAK', summary: 'An application concept for sending parcels through Pune PMPML’s public transport network.', stack: ['JavaScript', 'Web app'], liveUrl: 'https://vahak-final.vercel.app', mark: 'VH' },
  { title: 'Invoax AI', summary: 'An AI-powered platform designed to automate and manage business operations.', stack: ['AI/ML', 'Web app'], liveUrl: 'https://innovex-ai-ops.vercel.app/', mark: 'IA' },
  { title: 'RELAY', summary: 'A project intelligence platform that brings documents and GitHub history together to help teams reconstruct context, verify evidence and carry decisions forward.', stack: ['HTML', 'JavaScript', 'Vite', 'Express', 'MongoDB'], liveUrl: 'https://relay-client-beta.vercel.app', mark: 'RL' },
]

export const technologies = [
  { name: 'HTML', mark: '5', color: 'orange' }, { name: 'CSS', mark: '3', color: 'blue' },
  { name: 'JavaScript', mark: 'JS', color: 'yellow' }, { name: 'React', mark: '⚛', color: 'cyan' },
  { name: 'Node.js', mark: '⬡', color: 'green' }, { name: 'Python', mark: 'Py', color: 'blue' },
  { name: 'MongoDB', mark: '◉', color: 'green' }, { name: 'AI / ML', mark: '✳', color: 'violet' },
]
