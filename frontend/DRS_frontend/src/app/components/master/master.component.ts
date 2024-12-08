import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IAPIResponseUserDataModel, IUser } from '../../model/interfaces/user';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { NewPostComponent } from '../new-post/new-post.component';
import { MyFriendsPostsComponent } from '../my-friends-posts/my-friends-posts.component';
import { RegisterComponent } from '../register/register.component';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-master',
  standalone: true,
  imports: [CommonModule, NewPostComponent, MyFriendsPostsComponent, RegisterComponent],
  templateUrl: './master.component.html',
  styleUrl: './master.component.css',
})
export class MasterComponent implements OnInit{
  isUserAdmin: boolean = false;

  constructor(
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.adminService.isAdmin.subscribe((admin: boolean) => {
      this.isUserAdmin = admin;
    });
    
  }

  logout() {
    this.isUserAdmin = false;
  }
}
