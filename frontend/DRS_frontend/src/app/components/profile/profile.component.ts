import { Component, inject } from '@angular/core';
import {
  IAPIResponsePostDataModel,
  IAPIResponsePostMessageModel,
  IPost,
} from '../../model/interfaces/post';
import { PostService } from '../../services/post.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Post, PostId } from '../../model/class/post';
import { Router, RouterModule } from '@angular/router';
import { NewPostComponent } from '../new-post/new-post.component';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule,NewPostComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  posts: IPost[] = [];
  postService: PostService = inject(PostService);
  subscriptionList: Subscription[] = [];
  postId: PostId = new PostId();
  post: Post = new Post();
  router = inject(Router);

  ngOnInit(): void {
    this.subscriptionList.push(
      this.postService.getApprovedPostsForUser().subscribe(
        (res: IAPIResponsePostDataModel) => {
          this.posts = res.data;
        },
        (error) => {
          console.error('Error:', error);
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach((element) => {
      element.unsubscribe();
    });
  }

  onEditPost(postId: string) {
    if (postId) {
      this.router.navigate(['/editpost', postId]);
    }
  }

  onDeletePost(postId: string) {
    this.postId.post_id = postId;
    this.postService.deletePost(this.postId).subscribe(
      (response: IAPIResponsePostMessageModel) => {
        if (response.message === 'Post deleted successfully') {
          this.posts = this.posts.filter((post) => post.post_id !== postId);
          alert(response.message);
        } else {
          alert('Unknown Response');
        }
      },
      (error) => {
        console.error('Error:', error);
        alert('An error occurred while deleting the post.');
      }
    );
  }

  getImageUrl(postId: string): string {
    return `http://localhost:5000/post/post-image/${postId}`;
  }
}
