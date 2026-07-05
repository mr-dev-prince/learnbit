'use client';

import { useState } from 'react';

import type { Task } from '@/types/Task';
import { useTasks } from '@/hooks/useTasks';
import TaskElement from './TaskElement';
import TaskViewModal from './TaskViewModal';

export default function TaskBox() {
  const { data: tasks, isPending } = useTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  if (isPending) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="flex flex-col h-fit max-w-3xl rounded-xl shadow-md gap-3 bg-background p-4">
        {tasks?.map((task) => (
          <TaskElement key={task.id} task={task} onClick={() => setSelectedTask(task)} />
        ))}
      </div>

      <TaskViewModal
        task={selectedTask}
        isOpen={selectedTask !== null}
        onClose={() => setSelectedTask(null)}
        onEdit={(task) => {
          // TODO: open edit modal
          setSelectedTask(null);
        }}
        onDelete={(task) => {
          // TODO: call delete mutation
          setSelectedTask(null);
        }}
      />
    </>
  );
}
