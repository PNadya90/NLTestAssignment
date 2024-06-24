import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormContainerComponent } from './components/form-container/form-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'NLTestAssignment';
}
