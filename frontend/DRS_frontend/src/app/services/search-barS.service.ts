import { HttpClient } from '@angular/common/http';
import { effect, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Constant } from '../constant/constant';
import { environment } from '../../environments/environment.development';
import { IAPIResponsePostDataModel } from '../model/interfaces/post';
import { Filter } from '../model/class/filter';

@Injectable({
  providedIn: 'root',
})
export class SearchBarService {
  overlayOpen = signal(false);
  recentSearches = signal<string[]>(
    JSON.parse(window.localStorage.getItem('recentSearches') ?? '[]')
  );

  searchTerm = signal('');

  constructor(private http: HttpClient) {}

  sendSearch(obj: Filter): Observable<IAPIResponsePostDataModel> {
    return this.http.post<IAPIResponsePostDataModel>(
      environment.API_URL + Constant.API_METHOD.SEARCH_FRIEND,
      obj
    ); // Poziv kontrolera
  }

  search(searchTerm: string) {
    //Dodaj
    this.searchTerm.set(searchTerm);
    this.overlayOpen.set(false);
    this.addToRecentSearches(searchTerm);
  }

  clearSearch() {
    this.searchTerm.set('');
    this.overlayOpen.set(true);
  }

  addToRecentSearches(searchTerm: string) {
    const lowerCaseTerm = searchTerm.toLowerCase();
    this.recentSearches.set([
      lowerCaseTerm,
      ...this.recentSearches().filter((s) => s !== lowerCaseTerm),
    ]);
  }
  deleteRecentSearch(searchTerm: string) {
    this.recentSearches.set(
      this.recentSearches().filter((s) => s !== searchTerm)
    );
  }

  saveLocalStorage = effect(() => {
    window.localStorage.setItem(
      'recentSearches',
      JSON.stringify(this.recentSearches())
    );
  });
}
