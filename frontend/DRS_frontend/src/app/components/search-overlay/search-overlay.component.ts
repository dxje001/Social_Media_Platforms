import { Component, inject, ChangeDetectorRef, computed } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { SearchBarService } from '../../services/search-barS.service';

@Component({
  selector: 'app-search-overlay',
  standalone: true,
  imports: [MatDivider, MatListModule, MatIcon],
  templateUrl: './search-overlay.component.html',
  styleUrl: './search-overlay.component.css',
})
export class SearchOverlayComponent {
  searchBarService = inject(SearchBarService);
  recentSearches = computed(() =>
    this.searchBarService.recentSearches().slice(0, 5)
  );

  constructor(private cdr: ChangeDetectorRef) {}

  deleteRecentSearch(searchTerm: string) {
    this.searchBarService.deleteRecentSearch(searchTerm);
  }

  performSearch(searchTerm: string) {
    if (!searchTerm) return;
    this.searchBarService.search(searchTerm); // Poziv servisne metode
    this.cdr.detectChanges();
  }
}
