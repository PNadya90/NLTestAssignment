import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DEFAULT_TEXT, PLACEHOLDERS } from './form-containers.constants';
import { OpeningSentenceComponent } from './opening-sentence/opening-sentence.component';
import { IPlaceholder } from './placeholder.interface';

@Component({
  selector: 'app-form-container',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, OpeningSentenceComponent],
  templateUrl: './form-container.component.html',
  styleUrl: './form-container.component.scss',
})
export class FormContainerComponent {
  public placeholdersList: IPlaceholder[] = PLACEHOLDERS;
  public form!: FormGroup;
  public defaultText = DEFAULT_TEXT;
  private phoneNumberPattern = '^[- +()0-9]+$';

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      phone: [
        '',
        [Validators.required, Validators.pattern(this.phoneNumberPattern)],
      ],
      openingSentence: [this.defaultText],
    });
  }

  public onSubmit() {
    if (this.form?.valid) {
      console.log(this.form.value);
      alert(`Sent openingSentence: ${this.form.value.openingSentence}`);
    } else {
      this.form?.markAllAsTouched();
    }
  }
}
