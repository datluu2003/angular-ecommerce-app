import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { OrderType } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = environment.apiUrl + '/orders';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Lấy tất cả đơn hàng (chỉ admin)
  getAllOrders(): Observable<any> {
    const token = this.authService.getToken();
    const headers = token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : undefined;
    return this.http.get<any>(`${this.apiUrl}`, { headers });
  }

  // Lấy chi tiết đơn hàng theo ID (chỉ admin)
  getOrderById(id: string): Observable<OrderType> {
    const token = this.authService.getToken();
    const headers = token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : undefined;
    return this.http.get<OrderType>(`${this.apiUrl}/${id}`, { headers });
  }

  // Cập nhật trạng thái đơn hàng (chỉ admin)
  updateOrderStatus(id: string, status: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : undefined;
    return this.http.put(`${this.apiUrl}/${id}/status`, { status }, { headers });
  }
}
