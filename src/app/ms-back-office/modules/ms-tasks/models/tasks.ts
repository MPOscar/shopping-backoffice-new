export class Task {
    id?: string;   
    createdAt?: string;
    updatedAt?: string;
    description: string;
    task?: string;
    responsable?: string;
    priority?: string;    
}

export class TasksListResponse {
    data: Task[];
    dataCount: number;
}

export class TasksResponse {
    data: Task;
}