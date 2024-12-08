import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post.service'; // Import your PostService
import { WebSocketService } from '../../services/web-socket.service';
import { IAPIResponsePostMessageModel, IPost } from '../../model/interfaces/post';
import { PostId, Post } from '../../model/class/post';

@Component({
  selector: 'app-posts-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './posts-review.component.html',
  styleUrls: ['./posts-review.component.css']
})
export class PostsReviewComponent implements OnInit {
  posts: IPost[] = [];
  post: Post = new Post();
  postService: PostService = inject(PostService);
  postId: PostId = new PostId();

  constructor(
    //private postService: PostService,
    private webSocketService: WebSocketService
  ) { }

  ngOnInit(): void {
    this.fetchUnapprovedPosts();
    // Listen for the 'new_post' event from the server
    this.webSocketService.on('new_post').subscribe((post: any) => {
      this.posts.push(post); // Add new post to the list
    });
  }

  fetchUnapprovedPosts(): void {
    this.postService.getUnapprovedPosts().subscribe((posts) => {
      this.posts = posts;
    });
  }

  onApprovePost(postId: string): void {
    this.postId.post_id = postId;
    this.postService.approvePost(this.postId).subscribe((response: IAPIResponsePostMessageModel) => {
      if (response.message === 'Post approved') {
        this.posts = this.posts.filter(post => post.post_id !== postId);
        alert(response.message);
      } else {
        alert('Unknown Response');
      }
    }, (error) => {
      console.error('Error:', error);
      alert('An error occurred while approving the post.');
    });
  }

  onRejectPost(postId: string){
    this.postId.post_id = postId;
    this.postService.rejectPost(this.postId).subscribe((response: IAPIResponsePostMessageModel) => {
      if (response.message === 'Post rejected') {
        this.posts = this.posts.filter(post => post.post_id !== postId);
        alert(response.message);
      } else {
        alert('Unknown Response');
      }
    }, (error) => {
      console.error('Error:', error);
      alert('An error occurred while rejecting the post.');
    });
  }
}

