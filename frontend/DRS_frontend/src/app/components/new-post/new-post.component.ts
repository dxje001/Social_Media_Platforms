import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { Router } from '@angular/router';
import { Post } from '../../model/class/post';
import { IAPIResponsePostMessageModel } from '../../model/interfaces/post';
import { WebSocketService } from '../../services/web-socket.service';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent {
  imagePreview: string | ArrayBuffer | null = null;
  imageFile: File | null = null;
  postService = inject(PostService);
  router = inject(Router);
  webSocketService = inject(WebSocketService);
  postObject = new Post();

  // Trigger the file input when the user wants to upload an image
  triggerFileInput() {
    document.getElementById('image-input')!.click();
  }

  // Handle image selection and preview
  onImageSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      this.imageFile = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.imageFile);
    }
  }

  // Handle post submission
  onPost() {

    const formData = new FormData();
    formData.append('txt', this.postObject.txt.trim());

    // If there is an image file, append it to the FormData
    if (this.imageFile) {
      formData.append('image', this.imageFile, this.imageFile.name);
    }

    this.postService.createPost(formData).subscribe(
      (res: IAPIResponsePostMessageModel) => {
        if (res.message === 'Created') {
          alert('Post Created Successfully');
          
          // Emit WebSocket event to notify other clients of the new post
          this.webSocketService.emit('new_post', { post: formData });
          
          // Optionally reset the form or navigate to another page
          this.router.navigate(['/index']);  // Navigate to the index page or clear the form
        } else {
          alert('Unknown Response');
        }
      },
      (error) => {
        console.error('Error:', error);
        if (error.status === 400 && error.error.message) {
          alert(error.error.message);
        } else {
          alert('Unknown Error');
        }
      }
    );
  }
}
