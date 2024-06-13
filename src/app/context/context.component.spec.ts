import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextComponent } from './context.component';

describe('ContextComponent', () => {
  let component: ContextComponent;
  let fixture: ComponentFixture<ContextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContextComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
