import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
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
  
  deleteProduct(productId: string): Observable<any> {
    return this.http.delete<any>(`http://localhost:8080/api/products/${productId}`);
  }
  
  createProduct(product: any): Observable<any> {
    const token = localStorage.getItem('token');
    // Nếu product là FormData, bổ sung slug, id, status
    if (product instanceof FormData) {
      // Tạo slug từ tên sản phẩm
      const name = product.get('name') as string;
      const slug = name ? name.toLowerCase().replace(/\s+/g, '-') : '';
      product.set('slug', slug);
      // Tạo id ngẫu nhiên (có thể thay bằng logic backend nếu cần)
      const id = 'SP' + Math.floor(Math.random() * 1000000);
      product.set('id', id);
      // Đảm bảo status là active
      product.set('status', 'active');
      // ...existing code...
    } else {
      // Nếu là object, bổ sung các trường thiếu
      if (!product.slug && product.name) {
        product.slug = product.name.toLowerCase().replace(/\s+/g, '-');
      }
      if (!product.id) {
        product.id = 'SP' + Math.floor(Math.random() * 1000000);
      }
      product.status = 'active';
      // ...existing code...
    }
    if (token) {
      let headers = new HttpHeaders();
      headers = headers.set('Authorization', `Bearer ${token}`);
      // ...existing code...
      return this.http.post<any>('http://localhost:8080/api/products', product, { headers });
    } else {
      // ...existing code...
      return this.http.post<any>('http://localhost:8080/api/products', product);
    }
  }
  
  updateProduct(productId: string, product: any): Observable<any> {
    return this.http.put<any>(`http://localhost:8080/api/products/${productId}`, product);
  }

  getCategories(): Observable<any> {
    return this.http.get<any>('http://localhost:8080/api/categories');
  }
}
