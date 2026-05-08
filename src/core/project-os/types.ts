export type RecordStatus = "active" | "done" | "archived";

export type KnowledgeKind = "note";

export interface FrontmatterRecordBase {
  id: string;
  title: string;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
  doneAt?: string;
}

export interface GoalFrontmatter extends FrontmatterRecordBase {
  tags?: string[];
  linkedKnowledgeIds?: string[];
}

export interface TaskFrontmatter extends FrontmatterRecordBase {
  goalId?: string;
  tags?: string[];
  linkedKnowledgeIds?: string[];
  checklist: ChecklistItem[];
}

export interface KnowledgeFrontmatter extends FrontmatterRecordBase {
  kind: KnowledgeKind;
  tags?: string[];
  linkedWorkIds?: string[];
}

export interface ChecklistItem {
  id: string;
  title: string;
  done: boolean;
  completedAt?: string;
}

export interface GoalRecord {
  id: string;
  title: string;
  status: RecordStatus;
  tags?: string[];
  linkedKnowledgeIds?: string[];
  doneAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskRecord {
  id: string;
  title: string;
  status: RecordStatus;
  goalId?: string;
  tags?: string[];
  linkedKnowledgeIds?: string[];
  doneAt?: string;
  createdAt: string;
  updatedAt: string;
  checklist: ChecklistItem[];
}

export interface KnowledgeRecord {
  id: string;
  title: string;
  kind: KnowledgeKind;
  status: RecordStatus;
  tags?: string[];
  linkedWorkIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectOsLayout {
  rootDir: string;
  kernelDir: string;
  readmePath: string;
  projectPath: string;
  gitignorePath: string;
  goalsDir: string;
  activeTasksDir: string;
  archivedTasksDir: string;
  knowledgeDir: string;
  notesDir: string;
  statePath: string;
}
