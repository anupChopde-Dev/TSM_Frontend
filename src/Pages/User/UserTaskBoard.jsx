import React, { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectTasks, fetchUpdateTaskStaus, setTasks } from "../../store/projectSlice";

// ---------------- API DATA ----------------
const apiData = [
  {
    id: "6a69f2ba2650d25cc9db6c7c",
    taskName: "Implement API",
    description: "API Integration",
    sp: 2,
    priority: "Medium",
    status: "todo",
  },
  {
    id: "6a69f29f2650d25cc9db6c7a",
    taskName: "Create Form",
    description: "Create User Form",
    sp: 5,
    priority: "High",
    status: "todo",
  },
  {
    id: "6a69f29f2650d25cc9db6c7b",
    taskName: "Testing",
    description: "Testing Module",
    sp: 3,
    priority: "Low",
    status: "review",
  },
  {
    id: "6a69f29f2650d25cc9db6c7d",
    taskName: "Deployment",
    description: "Deploy Project",
    sp: 8,
    priority: "Urgent",
    status: "completed",
  },
];

// -------- Group Tasks by Status ----------
const groupTasks = (tasks) => ({
  todo: tasks?.filter((task) => task.status === "todo"),
  inprogress: tasks?.filter((task) => task.status === "inprogress"),
  review: tasks?.filter((task) => task.status === "review"),
  completed: tasks?.filter((task) => task.status === "completed"),
});

export default function TodoBoard() {
  const tasks = useSelector((state) => state.project.tasks)

  const [activeTask, setActiveTask] = useState(null);

  const columns = useMemo(() => groupTasks(tasks), [tasks]);
  console.log('columns', columns)
  const dispatch = useDispatch()

  const sensors = useSensors(useSensor(PointerSensor));

  const priorityColor = {
    High: "#ef4444",
    Medium: "#f59e0b",
    Low: "#22c55e",
    Urgent: "#dc2626",
  };

  const findContainer = (id) => {

  if (["todo", "inprogress", "review", "completed"].includes(id)) {
    return id;
  }

  return Object.keys(columns).find((key) =>
    columns[key]?.some((item) => item.id === id)
  );
};

  const findTask = (id) => {
    return tasks.find((task) => task.id === id);
  };

  // ---------------- DRAG START ----------------

  const handleDragStart = ({ active }) => {
    setActiveTask(findTask(active.id));
  };

  // ---------------- DRAG END ----------------

  const handleDragEnd = ({ active, over }) => {
    setActiveTask(null);

    if (!over) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);

    if (!activeContainer || !overContainer) return;

    // Copy current grouped columns
    const updatedColumns = groupTasks(tasks);

    // Same Column Sorting
    if (activeContainer === overContainer) {
      const oldIndex = updatedColumns[activeContainer].findIndex(
        (t) => t.id === active.id
      );

      const newIndex = updatedColumns[activeContainer].findIndex(
        (t) => t.id === over.id
      );

      if (oldIndex === newIndex) return;

      updatedColumns[activeContainer] = arrayMove(
        updatedColumns[activeContainer],
        oldIndex,
        newIndex
      );

      const newTasks = [
        ...updatedColumns.todo,
        ...updatedColumns.inprogress,
        ...updatedColumns.review,
        ...updatedColumns.completed,
      ];

      setTasks(newTasks);

      return;
    }

    // ---------------- Move Between Columns ----------------

   const oldTask = findTask(active.id);

if (!oldTask) return;


const movedTask = {
  ...oldTask,
  status: overContainer,
};


// Optimistic update
const updatedTasks = tasks.map((task) =>
  task.id === active.id ? movedTask : task
);


dispatch(setTasks(updatedTasks));


// API update
const payload = {
  id: movedTask.id,
  status: movedTask.status,
  userId: movedTask.userId,
  projectId: movedTask.projectId,
};


dispatch(fetchUpdateTaskStaus(payload))
.unwrap()
.then(() => {
  dispatch(fetchProjectTasks(movedTask.projectId));
})
.catch(() => {
  // rollback if API fails
  dispatch(setTasks(tasks));
});
  };

  // ---------------- COLUMN ----------------

  function Column({ id, title, tasks }) {
    const { setNodeRef, isOver } = useDroppable({
      id,
    });

    return (
      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className="rounded-xl p-4 min-h-[500px] transition-all"
          style={{
            background: isOver
              ? "var(--primary-soft)"
              : "var(--surface)",
            border: `2px solid ${isOver ? "var(--primary)" : "var(--border)"
              }`,
            boxShadow: "var(--shadow)",
          }}
        >
          <h2
            className="font-semibold text-lg mb-4"
            style={{
              color: "var(--text-primary)",
            }}
          >
            {id} ({tasks.length})
          </h2>

          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      </SortableContext>
    );
  }

  // ---------------- CARD ----------------

  function TaskCard({ task, overlay }) {
    const sortable = useSortable({
      id: task.id,
    });

    const style = overlay
      ? {}
      : {
        transform: CSS.Transform.toString(sortable.transform),
        transition: sortable.transition,
        opacity: sortable.isDragging ? 0.4 : 1,
      };

    return (
      <div
        ref={overlay ? null : sortable.setNodeRef}
        style={{
          ...style,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: overlay
            ? "0 20px 40px rgba(79,70,229,.18)"
            : "0 4px 12px rgba(15,23,42,.08)",
        }}
        {...(!overlay ? sortable.attributes : {})}
        {...(!overlay ? sortable.listeners : {})}
        className="rounded-xl p-4 cursor-grab active:cursor-grabbing"
      >
        <div className="flex justify-between items-start mb-2">
          <h3
            className="font-semibold"
            style={{
              color: "var(--text-primary)",
            }}
          >
            {task.taskName}
          </h3>

          <span
            className="px-2 py-1 rounded-full text-xs text-white"
            style={{
              background: priorityColor[task.priority],
            }}
          >
            {task.priority}
          </span>
        </div>

        <p
          className="text-sm"
          style={{
            color: "var(--text-muted)",
          }}
        >
          {task.description}
        </p>

        <div
          className="mt-3 text-sm font-semibold"
          style={{
            color: "var(--primary)",
          }}
        >
          SP : {task.sp}
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        className="grid grid-cols-4 gap-6 p-6 rounded-2xl"
        style={{
          background: "var(--surface-soft)",
        }}
      >
        <Column id="todo" title="Todo" tasks={columns.todo} />

        <Column
          id="inprogress"
          title="In Progress"
          tasks={columns.inprogress}
        />

        <Column
          id="review"
          title="Review"
          tasks={columns.review}
        />

        <Column
          id="completed"
          title="Completed"
          tasks={columns.completed}
        />
      </div>

      <DragOverlay>
        {activeTask && <TaskCard task={activeTask} overlay />}
      </DragOverlay>
    </DndContext>
  );
}