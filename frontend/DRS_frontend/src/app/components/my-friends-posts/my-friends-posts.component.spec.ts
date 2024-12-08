import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFriendsPostsComponent } from './my-friends-posts.component';

describe('MyFriendsPostsComponent', () => {
  let component: MyFriendsPostsComponent;
  let fixture: ComponentFixture<MyFriendsPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyFriendsPostsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyFriendsPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
