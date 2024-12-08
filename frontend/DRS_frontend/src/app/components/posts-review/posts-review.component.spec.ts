import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsReviewComponent } from './posts-review.component';

describe('PostsReviewComponent', () => {
  let component: PostsReviewComponent;
  let fixture: ComponentFixture<PostsReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostsReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostsReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
