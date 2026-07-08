import type { TaskItem } from "@/components/dashboard/types";
import { DASHBOARD_TASKS_STORAGE_KEY, type TaskPriority } from "@/lib/dashboard/constants";
import { generateId } from "@/lib/storage/crud";
import { initStorage, readStorage, writeStorage } from "@/lib/storage/local-storage";

export interface PersistedDashboardTask {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
  done: boolean;
  createdAt: string;
  sourceSuggestionId?: string;
}

export interface DashboardTaskInput {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
  sourceSuggestionId?: string;
}

export interface DashboardTasksPersistedState {
  tasks: PersistedDashboardTask[];
  ignoredSuggestionIds: string[];
}

function createSeedState(): DashboardTasksPersistedState {
  return {
    tasks: [],
    ignoredSuggestionIds: [],
  };
}

export function initDashboardTasksState(): DashboardTasksPersistedState {
  return initStorage(DASHBOARD_TASKS_STORAGE_KEY, createSeedState());
}

export function getDashboardTasksState(): DashboardTasksPersistedState {
  return readStorage<DashboardTasksPersistedState>(DASHBOARD_TASKS_STORAGE_KEY) ?? createSeedState();
}

export function saveDashboardTasksState(
  state: DashboardTasksPersistedState
): DashboardTasksPersistedState {
  writeStorage(DASHBOARD_TASKS_STORAGE_KEY, state);
  return state;
}

export function toTaskItems(tasks: PersistedDashboardTask[]): TaskItem[] {
  return tasks.map((task) => ({
    id: task.id,
    label: task.title,
    done: task.done,
    description: task.description,
    priority: task.priority,
    dueDate: task.dueDate,
  }));
}

export function addDashboardTask(
  state: DashboardTasksPersistedState,
  input: DashboardTaskInput
): DashboardTasksPersistedState {
  const title = input.title.trim();

  if (!title) {
    return state;
  }

  const nextState = {
    ...state,
    tasks: [
      {
        id: generateId("task"),
        title,
        description: input.description.trim(),
        priority: input.priority,
        dueDate: input.dueDate,
        done: false,
        createdAt: new Date().toISOString(),
        sourceSuggestionId: input.sourceSuggestionId,
      },
      ...state.tasks,
    ],
  };

  return saveDashboardTasksState(nextState);
}

export function toggleDashboardTask(
  state: DashboardTasksPersistedState,
  id: string
): DashboardTasksPersistedState {
  const nextState = {
    ...state,
    tasks: state.tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
  };

  return saveDashboardTasksState(nextState);
}

export function ignoreDashboardSuggestion(
  state: DashboardTasksPersistedState,
  suggestionId: string
): DashboardTasksPersistedState {
  if (state.ignoredSuggestionIds.includes(suggestionId)) {
    return state;
  }

  const nextState = {
    ...state,
    ignoredSuggestionIds: [...state.ignoredSuggestionIds, suggestionId],
  };

  return saveDashboardTasksState(nextState);
}

export function addTaskFromSuggestion(
  state: DashboardTasksPersistedState,
  suggestionId: string,
  label: string
): DashboardTasksPersistedState {
  return addDashboardTask(state, {
    title: label,
    description: "",
    priority: "Medium",
    dueDate: "",
    sourceSuggestionId: suggestionId,
  });
}
