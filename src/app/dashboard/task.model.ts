export interface TaskStatus {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  status: TaskStatus;
  category: Category;
  created_at: string;

}
