
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private http: HttpClient) {}

  getCategories(): Observable<{data: Category[]}> {
    return this.http.get<{data: Category[]}>('http://localhost:8080/api/categories');
  }

  getCategoryById(id: string): Observable<{data: Category}> {
    return this.http.get<{data: Category}>(`http://localhost:8080/api/categories/${id}`);
  }

  createCategory(category: any): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    // Nếu là FormData thì không set Content-Type, để browser tự set
    return this.http.post<any>('http://localhost:8080/api/categories', category, { headers });
  }

  updateCategory(id: string, category: any): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.put<any>(`http://localhost:8080/api/categories/${id}`, category, { headers });
  }

  deleteCategory(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.delete<any>(`http://localhost:8080/api/categories/${id}`, { headers });
  }
}