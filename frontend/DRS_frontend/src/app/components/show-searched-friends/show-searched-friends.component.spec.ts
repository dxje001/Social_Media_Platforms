import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowSearchedFriendsComponent } from './show-searched-friends.component';

describe('ShowSearchedFriendsComponent', () => {
  let component: ShowSearchedFriendsComponent;
  let fixture: ComponentFixture<ShowSearchedFriendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowSearchedFriendsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowSearchedFriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
