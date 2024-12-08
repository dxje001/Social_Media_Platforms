import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { IAPIResponsePostDataModel, IPost } from '../../model/interfaces/post';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-my-friends-posts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-friends-posts.component.html',
  styleUrl: './my-friends-posts.component.css',
})
export class MyFriendsPostsComponent implements OnInit {
  posts: IPost[] = [];
  postService: PostService = inject(PostService);

  ngOnInit(): void {
    this.postService.getMyFriendsPosts().subscribe(
      (res: IAPIResponsePostDataModel) => {
        this.posts = res.data;
      },
      (error) => {
        alert(error.error.message);
      }
    );
  }
}
