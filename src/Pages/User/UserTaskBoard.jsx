import React, { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useSortable, SortableContext, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const initialData = {
  todo: [
    { id: 't1', title: 'Design login UI' },
    { id: 't2', title: 'Write auth API' },
  ],
  inprogress: [{ id: 'p1', title: 'Integrate RHF forms' }],
  review: [{ id: 'r1', title: 'Code review for tasks' }],
  complete: [{ id: 'c1', title: 'Project setup' }],
}

function Card({ item }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-move rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-sm text-white shadow-sm">
      {item.title}
    </div>
  )
}

const Column = ({ id, title, items }) => (
  <div className="flex min-h-[260px] w-full flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-slate-300">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <span className="rounded-full bg-slate-800/60 px-2 py-0.5 text-xs text-slate-300">{items.length}</span>
    </div>

    <SortableContext items={items.map((i) => i.id)}>
      <div className="mt-3 flex flex-1 flex-col gap-3" data-dropzone={id}>
        {items.map((it) => (
          <Card key={it.id} item={it} />
        ))}

        <div className="mt-auto text-xs text-slate-500">Drop items here</div>
      </div>
    </SortableContext>
  </div>
)

const UserTaskBoard = () => {
  const [columns, setColumns] = useState(initialData)
  const [activeId, setActiveId] = useState(null)

  const sensors = useSensors(useSensor(PointerSensor))

  const findContainer = (id) => {
    for (const key of Object.keys(columns)) {
      if (columns[key].some((it) => it.id === id)) return key
    }
    return null
  }

  const onDragStart = (event) => setActiveId(event.active.id)

  const onDragEnd = (event) => {
    const { active, over } = event
    setActiveId(null)
    if (!over) return

    const activeId = active.id
    const overId = over.id
    const from = findContainer(activeId)
    const to = findContainer(overId) || overId
    if (!from || !to) return

    if (from === to) {
      const idxs = columns[from].map((it) => it.id)
      const oldIndex = idxs.indexOf(activeId)
      const newIndex = idxs.indexOf(overId)
      if (oldIndex !== newIndex) {
        setColumns((prev) => ({
          ...prev,
          [from]: arrayMove(prev[from], oldIndex, newIndex),
        }))
      }
    } else {
      setColumns((prev) => {
        const sourceItems = [...prev[from]]
        const moving = sourceItems.find((it) => it.id === activeId)
        const newSource = sourceItems.filter((it) => it.id !== activeId)

        const targetItems = [...prev[to]]
        const overIndex = targetItems.findIndex((it) => it.id === overId)
        const insertAt = overIndex === -1 ? targetItems.length : overIndex + 1

        const newTarget = [...targetItems.slice(0, insertAt), moving, ...targetItems.slice(insertAt)]

        return {
          ...prev,
          [from]: newSource,
          [to]: newTarget,
        }
      })
    }
  }

  const onDragCancel = () => setActiveId(null)

  return (
    <div>
      

      <div className="mt-6">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragCancel={onDragCancel}>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            <Column id="todo" title="Todo" items={columns.todo} />
            <Column id="inprogress" title="In Progress" items={columns.inprogress} />
            <Column id="review" title="Review" items={columns.review} />
            <Column id="complete" title="Complete" items={columns.complete} />
          </div>

          <DragOverlay>
            {activeId ? (
              (() => {
                const all = Object.values(columns).flat()
                const item = all.find((it) => it.id === activeId)
                if (!item) return null
                return (
                  <div className="pointer-events-none rounded-lg border border-slate-700 bg-slate-800/90 px-4 py-2 text-sm font-medium text-white shadow-2xl">
                    {item.title}
                  </div>
                )
              })()
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}

export default UserTaskBoard
