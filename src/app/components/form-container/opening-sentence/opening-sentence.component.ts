import { CommonModule, NgForOf } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  Input,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { IPlaceholder } from '../placeholder.interface';

@Component({
  selector: 'app-opening-sentence',
  standalone: true,
  imports: [NgForOf, CommonModule, ReactiveFormsModule],
  templateUrl: './opening-sentence.component.html',
  styleUrl: './opening-sentence.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OpeningSentenceComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: OpeningSentenceComponent,
      multi: true,
    },
  ],
})
export class OpeningSentenceComponent
  implements ControlValueAccessor, AfterViewInit, AfterViewInit
{
  @Input() placeholders: IPlaceholder[] = [];
  @ViewChild('contenteditable') contentEditable!: ElementRef<HTMLDivElement>;
  value: string = '';
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  private lastCursorPosition: number = 0;
  public isNotValid: boolean = false;
  private control: FormControl | undefined;
  constructor() {}

  ngAfterContentInit(): void {}

  validate(control: FormControl) {
    this.control = control;
    if (this.value === '' || this.value == null) {
      this.isNotValid = true;
      return { required: true };
    }
    this.isNotValid = false;
    return null;
  }
  ngAfterViewInit() {
    this.highlightPlaceholders();
  }
  writeValue(value: any): void {
    this.value = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (this.contentEditable) {
      this.contentEditable.nativeElement.contentEditable =
        (!isDisabled).toString();
    }
  }

  public setPlaceholder(placeholder: { name: string; value: string }) {
    const contentEditable = this.contentEditable.nativeElement;
    const selection = window.getSelection();

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (this.isRangeInside(contentEditable, range)) {
        range.deleteContents(); //replace selected
        const placeholderElement = document.createElement('span');
        placeholderElement.classList.add('highlight');
        placeholderElement.contentEditable = 'false';
        placeholderElement.textContent = `[${placeholder.value}]`;
        range.insertNode(placeholderElement);
        range.collapse(false);
        contentEditable.dispatchEvent(new Event('input'));
        this.lastCursorPosition = range.endOffset;
        this.highlightPlaceholders();
        contentEditable.focus();
        range.setStart(contentEditable, this.lastCursorPosition);
        range.setEnd(contentEditable, this.lastCursorPosition);
        selection.addRange(range);
        this.onInput(null);
      }
    }
  }

  private isRangeInside(parent: Node, range: Range): boolean {
    let container = range.commonAncestorContainer;
    while (container) {
      if (container === parent) {
        return true;
      }
      container = container.parentNode!;
    }
    return false;
  }

  private highlightPlaceholders() {
    if (this.contentEditable) {
      let highlightedContent = this.value;
      this.placeholders.forEach((ph) => {
        const regex = new RegExp(`\\[${ph.value}\\]`, 'g');

        highlightedContent = highlightedContent.replace(
          regex,
          `<span class="highlight" contenteditable="false">${ph.name}</span>`
        );
      });
      this.contentEditable.nativeElement.innerHTML = highlightedContent;
    }
  }

  public onInput(event: any) {
    this.value = this.contentEditable.nativeElement.innerHTML;
    let text = this.contentEditable.nativeElement.innerText;
    this.onChange(this.parseTextToBrackets(text));
  }

  private parseTextToBrackets(normalText: string) {
    let replacedString = normalText;
    this.placeholders.forEach((placeholder) => {
      const regex = new RegExp(placeholder.name, 'g');
      replacedString = replacedString.replace(
        regex,
        '[' + placeholder.value + ']'
      );
    });
    return replacedString;
  }
}
