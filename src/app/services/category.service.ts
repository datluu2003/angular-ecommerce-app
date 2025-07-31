import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private http: HttpClient) {}

  getCategories(): Observable<{data: Category[]}> {
    return this.http.get<{data: Category[]}>('http://localhost:8080/api/categories');
  }
} 