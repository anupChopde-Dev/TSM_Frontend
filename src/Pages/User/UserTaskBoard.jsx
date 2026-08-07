import React, { useMemo, useState } from "react";
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

import {
  fetchProjectTasks,
  fetchUpdateTaskStaus,
  setTasks,
} from "../../store/projectSlice";

import {
  ClipboardList,
  Loader2,
  SearchCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

/* ---------------------------------------------------
   STATUS CONFIG
---------------------------------------------------- */

const STATUS = {
  todo: {
    title: "To Do",
    icon: ClipboardList,
    color: "#6366f1",
    bg: "#eef2ff",
  },
  inprogress: {
    title: "In Progress",
    icon: Loader2,
    color: "#f59e0b",
    bg: "#fffbeb",
  },
  review: {
    title: "Review",
    icon: SearchCheck,
    color: "#8b5cf6",
    bg: "#f5f3ff",
  },
  completed: {
    title: "Completed",
    icon: CheckCircle2,
    color: "#22c55e",
    bg: "#ecfdf5",
  },
};

/* ---------------------------------------------------
   PRIORITY COLORS
---------------------------------------------------- */

const priorityColor = {
  Low: "#22c55e",
  Medium: "#f59e0b",
  High: "#ef4444",
  Urgent: "#dc2626",
};

/* ---------------------------------------------------
   GROUP TASKS
---------------------------------------------------- */

const groupTasks = (tasks = []) => ({
  todo: tasks.filter((t) => t.status === "todo"),
  inprogress: tasks.filter((t) => t.status === "inprogress"),
  review: tasks.filter((t) => t.status === "review"),
  completed: tasks.filter((t) => t.status === "completed"),
});

/* ---------------------------------------------------
   MAIN COMPONENT
---------------------------------------------------- */

export default function TodoBoard() {
  const dispatch = useDispatch();

  const tasks = useSelector((state) => state.project.tasks);
  const {selectedProject} = useSelector((state) => state.project);

  const [activeTask, setActiveTask] = useState(null);

  const columns = useMemo(() => groupTasks(tasks), [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  /* --------------------------------------------
      FIND CONTAINER
  --------------------------------------------- */

  const findContainer = (id) => {
    if (STATUS[id]) return id;

    return Object.keys(columns).find((column) =>
      columns[column].some((task) => task.id === id)
    );
  };

  /* --------------------------------------------
      FIND TASK
  --------------------------------------------- */

  const findTask = (id) => tasks.find((t) => t.id === id);

  /* --------------------------------------------
      DRAG START
  --------------------------------------------- */

  const handleDragStart = ({ active }) => {
    const task = findTask(active.id);

    if (task) setActiveTask(task);
  };

  /* --------------------------------------------
      DRAG END
  --------------------------------------------- */

  const handleDragEnd = ({ active, over }) => {
    setActiveTask(null);

    if (!over) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);

    if (!activeContainer || !overContainer) return;

    /* --------------------------------------------
        SAME COLUMN SORT
    --------------------------------------------- */

    if (activeContainer === overContainer) {
      const grouped = groupTasks(tasks);

      const oldIndex = grouped[activeContainer].findIndex(
        (item) => item.id === active.id
      );

      const newIndex = grouped[activeContainer].findIndex(
        (item) => item.id === over.id
      );

      if (oldIndex === newIndex) return;

      grouped[activeContainer] = arrayMove(
        grouped[activeContainer],
        oldIndex,
        newIndex
      );

      dispatch(
        setTasks([
          ...grouped.todo,
          ...grouped.inprogress,
          ...grouped.review,
          ...grouped.completed,
        ])
      );

      return;
    }

    /* --------------------------------------------
        MOVE TO ANOTHER COLUMN
    --------------------------------------------- */

    const oldTask = findTask(active.id);

    if (!oldTask) return;

    const updatedTask = {
      ...oldTask,
      status: overContainer,
    };

    const optimisticTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );

    dispatch(setTasks(optimisticTasks));

    dispatch(
      fetchUpdateTaskStaus({
        id: updatedTask.id,
        status: updatedTask.status,
        userId: updatedTask.userId,
        projectId: updatedTask.projectId,
      })
    )
      .unwrap()
      .then(() => {
        dispatch(fetchProjectTasks(updatedTask.projectId));
      })
      .catch(() => {
        dispatch(setTasks(tasks));
      });
  };
    /* =====================================================
      COLUMN COMPONENT
  ===================================================== */

  function Column({ id, tasks }) {
    const { setNodeRef, isOver } = useDroppable({
      id,
    });

    const config = STATUS[id];
    const Icon = config.icon;

    return (
      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className={`
            rounded-3xl
            transition-all
            duration-300
            p-5
            min-h-[650px]
            border
            backdrop-blur-xl
          `}
          style={{
            background: isOver
              ? "linear-gradient(180deg,#ffffff,#f8fafc)"
              : "#ffffff",
            borderColor: isOver ? config.color : "#e5e7eb",
            boxShadow: isOver
              ? `0 20px 50px ${config.color}30`
              : "0 8px 30px rgba(15,23,42,.08)",
          }}
        >
          {/* HEADER */}

          <div
            className="rounded-2xl px-4 py-3 mb-5 flex items-center justify-between"
            style={{
              background: config.bg,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{
                  background: config.color,
                }}
              >
                <Icon
                  size={22}
                  color="white"
                  className={
                    id === "inprogress"
                      ? "animate-spin"
                      : ""
                  }
                />
              </div>

              <div>
                <h2
                  className="font-bold text-lg"
                  style={{
                    color: "#111827",
                  }}
                >
                  {config.title}
                </h2>

                <p className="text-xs text-gray-500">
                  {tasks.length} Tasks
                </p>
              </div>
            </div>

            <span
              className="rounded-full px-3 py-1 text-white text-xs font-semibold"
              style={{
                background: config.color,
              }}
            >
              {tasks.length}
            </span>
          </div>

          {/* TASK LIST */}

          <div className="space-y-4">
            {tasks.length === 0 && (
              <div
                className="
                  rounded-2xl
                  border-2
                  border-dashed
                  border-gray-300
                  p-8
                  text-center
                  text-gray-400
                  bg-gray-50
                "
              >
                <AlertCircle
                  size={38}
                  className="mx-auto mb-3"
                />

                <p>No Tasks</p>

                <span className="text-xs">
                  Drag task here
                </span>
              </div>
            )}

            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
              />
            ))}
          </div>
        </div>
      </SortableContext>
    );
  }

  /* =====================================================
      TASK CARD
  ===================================================== */

  function TaskCard({ task, overlay = false }) {
    const sortable = useSortable({
      id: task.id,
    });

    const style = overlay
      ? {}
      : {
          transform: CSS.Transform.toString(
            sortable.transform
          ),
          transition: sortable.transition,
          opacity: sortable.isDragging ? 0.35 : 1,
        };

    return (
      <div
        ref={
          overlay
            ? null
            : sortable.setNodeRef
        }
        style={{
          ...style,

          background:
            "linear-gradient(180deg,#ffffff,#fafafa)",

          border: "1px solid #edf2f7",

          boxShadow: overlay
            ? "0 30px 60px rgba(0,0,0,.18)"
            : "0 8px 18px rgba(15,23,42,.08)",
        }}
        {...(!overlay
          ? sortable.attributes
          : {})}
        {...(!overlay
          ? sortable.listeners
          : {})}
        className="
            rounded-2xl
            p-5
            cursor-grab
            active:cursor-grabbing
            hover:-translate-y-1
            hover:shadow-2xl
            transition-all
            duration-300
            group
        "
      >
        {/* TOP HEADER */}

        <div className="flex justify-between items-start">
          <div>
            <h3
              className="
                font-bold
                text-base
                text-gray-800
                group-hover:text-indigo-600
                transition
              "
            >
              {task.taskName}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              {task.description}
            </p>
          </div>

          <span
            className="
              px-3
              py-1
              rounded-full
              text-xs
              font-semibold
              text-white
            "
            style={{
              background:
                priorityColor[task.priority],
            }}
          >
            {task.priority}
          </span>
        </div>

        {/* FOOTER */}
                {/* FOOTER */}

        <div className="mt-5 flex items-center justify-between">
          {/* Story Point */}

          <div
            className="
              flex
              items-center
              gap-2
              px-3
              py-2
              rounded-xl
              bg-indigo-50
            "
          >
            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>

            <span className="text-sm font-semibold text-indigo-600">
              SP : {task.sp}
            </span>
          </div>

          {/* STATUS */}

          <span
            className="text-xs font-medium px-3 py-2 rounded-xl"
            style={{
              background: STATUS[task.status]?.bg,
              color: STATUS[task.status]?.color,
            }}
          >
            {STATUS[task.status]?.title}
          </span>
        </div>
      </div>
    );
  }

  /* =====================================================
      MAIN UI
  ===================================================== */

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        className="
          min-h-screen
          p-8
          rounded-3xl
        "
        style={{
          background:
            "linear-gradient(135deg,#eef2ff 0%,#f8fafc 35%,#ffffff 100%)",
        }}
      >
        {/* PAGE HEADER */}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              {selectedProject || 'Project'}
            </h1>

            <p className="text-gray-500 mt-2">
              Drag & Drop Tasks 
            </p>
          </div>

          <div className="px-5 py-3 rounded-2xl bg-white shadow-lg border">
            <span className="text-gray-500">
              Total Tasks
            </span>

            <h2 className="text-2xl font-bold text-indigo-600">
              {tasks.length}
            </h2>
          </div>
        </div>

        {/* BOARD */}

        <div className="grid xl:grid-cols-4 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-6">
          <Column
            id="todo"
            tasks={columns.todo}
          />

          <Column
            id="inprogress"
            tasks={columns.inprogress}
          />

          <Column
            id="review"
            tasks={columns.review}
          />

          <Column
            id="completed"
            tasks={columns.completed}
          />
        </div>
      </div>

      {/* DRAG OVERLAY */}

      <DragOverlay
        dropAnimation={{
          duration: 250,
          easing: "ease",
        }}
      >
        {activeTask ? (
          <TaskCard
            task={activeTask}
            overlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}