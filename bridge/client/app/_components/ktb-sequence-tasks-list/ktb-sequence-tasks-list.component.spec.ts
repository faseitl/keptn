import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KtbSequenceTasksListComponent } from './ktb-sequence-tasks-list.component';
import { AppModule } from '../../app.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('KtbEventsListComponent', () => {
  let component: KtbSequenceTasksListComponent;
  let fixture: ComponentFixture<KtbSequenceTasksListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        AppModule,
        HttpClientTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(KtbSequenceTasksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
