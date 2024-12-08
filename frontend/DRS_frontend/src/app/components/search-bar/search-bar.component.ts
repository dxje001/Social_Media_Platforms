import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { OverlayModule } from '@angular/cdk/overlay';
import { SearchBarService } from '../../services/search-barS.service';
import { SearchOverlayComponent } from '../search-overlay/search-overlay.component';
import { NgClass } from '@angular/common';
import { Filter } from '../../model/class/filter';
import { IAPIResponsePostDataModel } from '../../model/interfaces/post';
import { Constant } from '../../constant/constant';
import { IUser } from '../../model/interfaces/user';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    OverlayModule,
    SearchOverlayComponent,
    NgClass,
    FormsModule,
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
})
export class SearchBarComponent {
  searchBarService = inject(SearchBarService);
  userService = inject(UserService);
  overlayOpen = this.searchBarService.overlayOpen;
  searchTerm = this.searchBarService.searchTerm;
  filterObj: Filter = new Filter();
  userList: IUser[] = [];
  isLoader: boolean = true;

  search(searchTerm: string) {
    if (!searchTerm) return;

    this.searchBarService.search(searchTerm);

    this.searchBarService.sendSearch(this.filterObj).subscribe(
      (res: IAPIResponsePostDataModel) => {
        this.userService.setUserList(res.data);
        this.isLoader = false;
        console.log(this.userList);
      },
      (error) => {
        if (error.status === 400 && error.error.message) {
          alert(error.error.message);
        } else {
          alert(Constant.ALERT_MESSAGES.UNKONOW_ERROR);
        }
        console.error('Error:', error);
      }
    );
  }

  clearSearch() {
    this.searchBarService.clearSearch();
  }
}
