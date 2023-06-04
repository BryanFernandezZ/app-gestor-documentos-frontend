import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContenidoHeaderComponent } from './contenido-header.component';

describe('ContenidoHeaderComponent', () => {
  let component: ContenidoHeaderComponent;
  let fixture: ComponentFixture<ContenidoHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContenidoHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContenidoHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
