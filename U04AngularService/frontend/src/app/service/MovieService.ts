import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Movie } from '../class/Movie';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private url = 'http://localhost:8080/movie';

  constructor(private http: HttpClient) { }

  async getAllPublic(sort: string = 'asc'): Promise<Array<Movie>> {
    return this.http.get<Array<Movie>>(`${this.url}/published?sort=${sort}`).toPromise();
  }

  async getAll(sort: string = 'asc'): Promise<Array<Movie>> {
    return this.http.get<Array<Movie>>(`${this.url}?sort=${sort}`).toPromise();
  }

  async get(id: number): Promise<Movie> {
    return this.http.get<Movie>(`${this.url}/${id}`).toPromise();
  }

  async post(movie: Movie): Promise<Movie> {
    return this.http.post<Movie>(`${this.url}/`, movie).toPromise();
  }

  async put(movie: Movie): Promise<Movie> {
    return this.http.put<Movie>(`${this.url}/${movie.id}`, movie).toPromise();
  }

  async clear(): Promise<HttpResponse<Movie>> {
    return this.http.delete<HttpResponse<Movie>>(`${this.url}/clear`).toPromise();
  }

  async delete(id: number): Promise<HttpResponse<Movie>> {
    return this.http.delete<HttpResponse<Movie>>(`${this.url}/${id}`).toPromise();
  }
}
