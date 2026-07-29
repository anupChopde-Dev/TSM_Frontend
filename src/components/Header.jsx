import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProjectOptions, fetchProjectTasks, setSelectedProjectId } from '../store/projectSlice'
import Select from "react-select";

const Header = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [selectedProject,setSelectedProject]=useState('')
  const { projectOptions, loading } = useSelector((state) => state.project)
  const userId = user?.id
  

  const getUSer = JSON.parse(localStorage.getItem('userData'))?.id
  useEffect(() => {
    if (getUSer) {
      dispatch(fetchProjectOptions(getUSer))
    }
  }, [dispatch])

  const handleProjectChange = (e) => {
    const data=
    {projectId:e.value,
      userId:getUSer
    }
    // const projectId = e.value
    if (e.value) {
      setSelectedProject(e.value)
      dispatch(fetchProjectTasks(data))
      dispatch(setSelectedProjectId(e.value))
    }
  }

  return (
    <header className="w-full border border-slate-800 bg-slate-900/90 shadow-xl shadow-slate-950/20 backdrop-blur-xl transition-all duration-300 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-400">Dashboard</p>
          <h1 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
            Project Tasks
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {loading ? (
            <span className="text-sm text-slate-400">Loading projects...</span>
          ) : (

            <Select
              options={projectOptions}
              placeholder="Select a project"
              onChange={(selectedOption) => handleProjectChange(selectedOption)}
              className="text-sm"
              value={selectedProject}
              classNamePrefix="react-select"
              styles={{
                control: (base, state) => ({
                  ...base,
                  backgroundColor: "#020617", // slate-950
                  borderColor: state.isFocused ? "#22d3ee" : "#334155", // cyan-400 : slate-700
                  borderRadius: "0.75rem",
                  minHeight: "42px",
                  boxShadow: state.isFocused
                    ? "0 0 0 2px rgba(34,211,238,0.2)"
                    : "none",
                  "&:hover": {
                    borderColor: "#22d3ee",
                  },
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: "#020617",
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused
                    ? "#0f172a"
                    : state.isSelected
                      ? "#164e63"
                      : "#020617",
                  color: "#fff",
                  cursor: "pointer",
                }),
                singleValue: (base) => ({
                  ...base,
                  color: "#fff",
                }),
                placeholder: (base) => ({
                  ...base,
                  color: "#94a3b8", // slate-400
                }),
                input: (base) => ({
                  ...base,
                  color: "#fff",
                }),
              }}
            />
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
