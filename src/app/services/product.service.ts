import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts(): Observable<any> {
    return this.http.get<any>('http://localhost:8080/api/products');
  }

  getProductsFrom8080(): Observable<any> {
    return this.http.get<any>('http://localhost:8080/api/products');
  }
  
  getProductBySlug(slug: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/api/product/slug/${slug}`);
  }
}
