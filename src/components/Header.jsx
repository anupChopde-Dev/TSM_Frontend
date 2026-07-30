import React, { useEffect, useState, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProjectOptions, fetchProjectTasks, setSelectedProjectId } from '../store/projectSlice'
import Select from 'react-select'

const Header = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { projectOptions } = useSelector((state) => state.project)
  const [selectedProjectId, setSelectedProjectIdLocal] = useState(null)
  const lastFetchedProjectIdRef = useRef(null)

  const userId = useMemo(() => user?.id || (() => {
    try { return JSON.parse(localStorage.getItem('userData'))?.id } catch { return null }
  })(), [user])

  useEffect(() => {
    if (userId && projectOptions.length === 0) {
      dispatch(fetchProjectOptions(userId))
    }
  }, [dispatch, userId, projectOptions.length])

  const selectedProject = useMemo(
    () => projectOptions.find((p) => p.value === selectedProjectId) || null,
    [projectOptions, selectedProjectId]
  )

  const handleProjectChange = (selectedOption) => {
    const nextProjectId = selectedOption?.value || null
    setSelectedProjectIdLocal(nextProjectId)
    if (nextProjectId) {
      localStorage.setItem('selectedProjectId', nextProjectId)
    } else {
      localStorage.removeItem('selectedProjectId')
    }
    if (selectedOption && lastFetchedProjectIdRef.current !== nextProjectId) {
      lastFetchedProjectIdRef.current = nextProjectId
      dispatch(setSelectedProjectId(nextProjectId))
      dispatch(fetchProjectTasks(nextProjectId))
    }
  }

  useEffect(() => {
    const savedProjectId = localStorage.getItem('selectedProjectId')
    if (savedProjectId && projectOptions.length > 0 && !selectedProjectId) {
      const matchedOption = projectOptions.find((p) => p.value === savedProjectId)
      if (matchedOption) {
        handleProjectChange(matchedOption)
      }
    }
  }, [projectOptions.length, selectedProjectId])

  return (
    <header className="w-full border border-slate-800 bg-slate-900/90 shadow-xl shadow-slate-950/20 backdrop-blur-xl transition-all duration-300 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-400">Dashboard</p>
          <h1 className="mt-1 text-xl font-semibold text-white sm:text-2xl">Project Tasks</h1>
        </div>

        <div className="flex items-center gap-3">
          <Select
            options={projectOptions}
            placeholder="Select a project"
            onChange={handleProjectChange}
            value={selectedProject}
            isClearable
            className="text-sm min-w-[220px]"
            classNamePrefix="react-select"
            blurInputOnSelect
            hideSelectedOptions={false}
            styles={{
              control: (base, state) => ({
                ...base,
                backgroundColor: '#020617',
                borderColor: state.isFocused ? '#22d3ee' : '#334155',
                borderRadius: '0.75rem',
                minHeight: '42px',
                boxShadow: state.isFocused ? '0 0 0 2px rgba(34,211,238,0.2)' : 'none',
                '&:hover': { borderColor: '#22d3ee' },
              }),
              menu: (base) => ({ ...base, backgroundColor: '#020617' }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused ? '#0f172a' : state.isSelected ? '#164e63' : '#020617',
                color: '#fff',
                cursor: 'pointer',
              }),
              singleValue: (base) => ({ ...base, color: '#fff' }),
              placeholder: (base) => ({ ...base, color: '#94a3b8' }),
              input: (base) => ({ ...base, color: '#fff' }),
            }}
          />
        </div>
      </div>
    </header>
  )
}

export default Header