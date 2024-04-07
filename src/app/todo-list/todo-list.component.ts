import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Import map operator

interface TodoItem {
  id: number;
  task: string;
  completed: boolean;
}

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent {
  private todoList: TodoItem[] = [];
  private nextId = 1;
  newTask: string = '';
  filter: 'all' | 'completed' | 'incomplete' = 'all'; // Initial filter value
  showFilterButtons: boolean = false; // Initialize to false
  todoList$ = new BehaviorSubject<TodoItem[]>(this.todoList);

  isFilterActive(filter: 'all' | 'completed' | 'incomplete'): boolean {
    return this.filter === filter;
  }

  addTask(task: string): void {
    if (task.trim() === '') {
      // Handle empty task
      return;
    }
    const newItem: TodoItem = {
      id: this.nextId++,
      task,
      completed: false
    };
    this.todoList.push(newItem);
    this.updateTodoList();
    this.newTask = ''; // Clear input after adding task
    this.showFilterButtons = true; 
  }

  removeTask(id: number): void {
    this.todoList = this.todoList.filter(item => item.id !== id);
    this.updateTodoList();
  }

  toggleTaskCompletion(id: number): void {
    const index = this.todoList.findIndex(item => item.id === id);
    if (index !== -1) {
      this.todoList[index].completed = !this.todoList[index].completed;
      this.updateTodoList();
    }
  }

  clearCompletedTasks(): void {
    this.todoList = this.todoList.filter(item => !item.completed);
    this.updateTodoList();
  }

  setFilter(filter: 'all' | 'completed' | 'incomplete'): void {
    this.filter = filter;
  }

  private updateTodoList(): void {
    this.todoList$.next(this.todoList);
  }

  get filteredTodoList$(): Observable<TodoItem[]> {
    if (this.filter === 'all') {
      return this.todoList$;
    } else if (this.filter === 'completed') {
      return this.todoList$.pipe(map(todoList => todoList.filter(item => item.completed)));
    } else if (this.filter === 'incomplete') {
      return this.todoList$.pipe(map(todoList => todoList.filter(item => !item.completed)));
    }
    return this.todoList$; // Handle default case
  }
}  
