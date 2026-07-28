import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table'
import ProjectModal from '../../components/ProjectModal'
import api from '../../api/axiosClient'

const normalizeProjects = (rawProjects = []) =>
  (Array.isArray(rawProjects) ? rawProjects : rawProjects?.projects || []).map((project, index) => {
    const users = Array.isArray(project.users)
      ? project.users.map((u) => (u && (u.name || u.username)) || u).filter(Boolean).join(', ')
      : project.users || '—'

    const startDate = project.startDate ? project.startDate.slice(0, 10) : project.startDate
    const endDate = project.endDate ? project.endDate.slice(0, 10) : project.endDate
    const timeline = startDate && endDate ? `${startDate} - ${endDate}` : project.timeline || '—'

    return {
      id: project.id || project._id || index + 1,
      name: project.projectName || project.name || `Project ${index + 1}`,
      user: users || '—',
      taskCount:project.taskCount || 0,
      timeline,
      tasks: Array.isArray(project.selectedTaskIds)
        ? project.selectedTaskIds
        : Array.isArray(project.tasks)
        ? project.tasks
        : [],
    }
  })



const ProjectList = () => {
  const [projects, setProjects] = useState([])
  const [open, setOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [usersError, setUsersError] = useState(null)
  const [loadingProjects, setLoadingProjects] = useState(false)
  const [projectsError, setProjectsError] = useState(null)
  const authToken = useSelector((state) => state.auth.token)
  const authStatus = useSelector((state) => state.auth.status)

  const fetchUsers = async () => {
    setLoadingUsers(true)
    setUsersError(null)
    try {
      const res = await api.get('/api/users', {
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      })
      setUsers(Array.isArray(res.data) ? res.data : res.data?.users || [])
    } catch (err) {
      setUsersError(err)
      console.error('Failed to fetch users', err)
    } finally {
      setLoadingUsers(false)
    }
  }

  const fetchProjects = async () => {
    setLoadingProjects(true)
    setProjectsError(null)
    try {
      const res = await api.get('/api/projects', {
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      })
      const rawProjects = Array.isArray(res.data) ? res.data : res.data?.projects || []
      setProjects(rawProjects)
    } catch (err) {
      setProjectsError(err)
      console.error('Failed to fetch projects', err)
    } finally {
      setLoadingProjects(false)
    }
  }

  useEffect(() => {
    fetchUsers()
    fetchProjects()
  }, [authStatus, authToken])

  async function handleSaveProject(data) {
    const payload = {
      projectName: data.projectName,
      users: data.users || [],
      startDate: data.startDate,
      endDate: data.endDate,
      selectedTaskIds: data.selectedTaskIds || [],
    }

    try {
      if (editingProject?.id || editingProject?._id) {
        const id = editingProject.id || editingProject._id
        await api.put(`/api/projects/${id}`, payload)
        toast.success('Project updated successfully')
      } else {
        await api.post('/api/projects', payload)
        toast.success('Project created successfully')
      }

      setOpen(false)
      setEditingProject(null)
      await fetchProjects()
    } catch (err) {
      toast.error('Could not save project')
      console.error('Project save failed', err)
    }
  }

  // users, loadingUsers, usersError are managed locally

  return (
    <>
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Project list</h2>
            <p className="mt-2 text-sm text-slate-400">Manage active projects and track progress.</p>
          </div>
          <Button onClick={() => { setEditingProject(null); setOpen(true) }}>+ Add Project</Button>
        </div>

        {loadingProjects ? (
          <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-950/80 p-6 text-center text-slate-400">Loading projects...</div>
        ) : projectsError ? (
          <div className="mt-6 rounded-3xl border border-rose-700 bg-rose-950/20 p-6 text-center text-rose-300">Failed to load projects.</div>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950/80">
            <Table>
              <TableHeader>
                <tr className="border-b border-slate-800">
                  <TableHead>Sr</TableHead>
                  <TableHead>Project Name</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Total Tasks</TableHead>
                  <TableHead>Timeline</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </tr>
              </TableHeader>
              <TableBody>
                {normalizeProjects(projects).map((project, index) => (
                  <TableRow key={project.id}>
                    <TableCell className="text-slate-300">{index + 1}</TableCell>
                    <TableCell className="font-medium text-white">{project.name}</TableCell>
                    <TableCell>{project.user}</TableCell>
                    <TableCell>{project.taskCount}</TableCell>
                    <TableCell className="text-slate-400">{project.timeline}</TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            const rawProject = projects.find((item) => item.id === project.id || item._id === project.id)
                            setEditingProject(rawProject || project)
                            setOpen(true)
                          }}
                        >
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
        )}
      </Card>

      <ProjectModal
        open={open}
        onClose={() => { setOpen(false); setEditingProject(null) }}
        users={users}
        project={editingProject}
        onSave={handleSaveProject}
      />
    </>
  )
}

export default ProjectList
