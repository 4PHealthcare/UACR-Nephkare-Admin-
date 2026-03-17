import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleRepliesListComponent } from './article-replies-list.component';

describe('ArticleRepliesListComponent', () => {
  let component: ArticleRepliesListComponent;
  let fixture: ComponentFixture<ArticleRepliesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticleRepliesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleRepliesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
