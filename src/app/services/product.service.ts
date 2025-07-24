import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts(): Observable<any> {
    return this.http.get<any>('http://localhost:8080/products');
  }

  getProductsFrom8080(): Observable<any> {
    return this.http.get<any>('http://localhost:8080/products');
  }
}
