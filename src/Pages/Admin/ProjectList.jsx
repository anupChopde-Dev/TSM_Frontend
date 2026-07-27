import React, { useState } from 'react'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table'
import ProjectModal from '../../components/ProjectModal'

const initialProjects = [
  {
    id: 1,
    name: 'Dashboard Redesign',
    user: 'John Doe',
    timeline: '2026-07-12 - 2026-07-25',
  },
  {
    id: 2,
    name: 'CRM Development',
    user: 'Sarah Smith',
    timeline: '2026-07-15 - 2026-08-10',
  },
]

const sampleUsers = [
  { id: 'u1', name: 'Alicia Reed' },
  { id: 'u2', name: 'Devon Clarke' },
  { id: 'u3', name: 'Priya Singh' },
  { id: 'u4', name: 'Jorge Martinez' },
]

const ProjectList = () => {
  const [projects, setProjects] = useState(initialProjects)
  const [open, setOpen] = useState(false)

  function handleCreateProject(data) {
    const id = projects.length ? projects[projects.length - 1].id + 1 : 1
    const timeline = `${data.startDate} - ${data.endDate}`
    const newProject = {
      id,
      name: data.projectName,
      user: data.users?.map((u) => u.name).join(', ') || '—',
      timeline,
      tasks: data.tasks || [],
    }
    setProjects((p) => [...p, newProject])
    setOpen(false)
    console.log('Created project', data)
  }

  return (
    <>
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Project list</h2>
            <p className="mt-2 text-sm text-slate-400">Manage active projects and track progress.</p>
          </div>
          <Button onClick={() => setOpen(true)}>+ Add Project</Button>
        </div>

        <div className="mt-6 overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950/80">
          <Table>
            <TableHeader>
              <tr className="border-b border-slate-800">
                <TableHead>Sr</TableHead>
                <TableHead>Project Name</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Timeline</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="text-slate-300">{project.id}</TableCell>
                  <TableCell className="font-medium text-white">{project.name}</TableCell>
                  <TableCell>{project.user}</TableCell>
                  <TableCell className="text-slate-400">{project.timeline}</TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <Button variant="secondary" size="sm">
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <ProjectModal
        open={open}
        onClose={() => setOpen(false)}
        users={sampleUsers}
        onCreate={handleCreateProject}
      />
    </>
  )
}

export default ProjectList
