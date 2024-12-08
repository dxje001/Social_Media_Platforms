import { Routes } from '@angular/router';
import { MasterComponent } from './components/master/master.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { EditUserProfileComponent } from './components/edit-user-profile/edit-user-profile.component';
import { authGuard } from './services/guard/auth.guard';
import { adminGuard } from './services/guard/admin.guard';
import { logInGuard } from './services/guard/log-in.guard';
import { FriendsComponent } from './components/friends/friends.component';
import { PostsReviewComponent } from './components/posts-review/posts-review.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EditPostComponent } from './components/edit-post/edit-post.component';
import { BlacklistedUsersComponent } from './components/blacklisted-users/blacklisted-users.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [logInGuard],
  },
  {
    path: 'index',
    component: MasterComponent,
    canActivate: [authGuard],
  },
  {
    path: 'friends',
    component: FriendsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'edituserprofile',
    component: EditUserProfileComponent,
    canActivate: [authGuard],
  },
  {
    path: 'postsreview',
    component: PostsReviewComponent,
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
  },
  {
    path: 'editpost/:id',
    component: EditPostComponent,
    canActivate: [authGuard],
  },
  {
    path: 'blacklist',
    component: BlacklistedUsersComponent,
    canActivate: [authGuard, adminGuard],
  },
];
