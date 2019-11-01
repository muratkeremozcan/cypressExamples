/* tslint:disable:use-host-property-decorator */
import {
  NgModule, Component, ViewChild, ElementRef,
  AfterViewInit, AfterContentInit, AfterViewChecked,
  DoCheck, Input, Output, EventEmitter, ContentChildren,
  QueryList, TemplateRef, IterableDiffers, Renderer2,
  forwardRef, OnDestroy, HostBinding, HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { PrimeTemplate } from 'primeng/components/common/shared';
import { DomHandler } from 'primeng/components/dom/domhandler';

@Component({
  selector: 'app-auto-complete',
  templateUrl: 'autoComplete.component.html',
  host: {
    '[class.ui-inputwrapper-filled]': 'filled',
    '[class.ui-inputwrapper-focus]': 'focus'
  },
  providers: [
    DomHandler,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteWithChipsComponent),
      multi: true
    }]
})
export class AutocompleteWithChipsComponent implements
  AfterContentInit, AfterViewInit, DoCheck,
  AfterViewChecked, ControlValueAccessor, OnDestroy {

  @Input() minLength = 1;

  @Input() delay = 300;

  @Input() style: any;

  @Input() styleClass: string;

  @Input() inputStyle: any;

  @Input() inputStyleClass: string;

  @Input() placeholder: string;

  @Input() readonly: boolean;

  @Input() disabled: boolean;

  @Input() maxlength: number;

  @Input() size: number;

  @Input() suggestions: any[];

  @Input() appendTo: any;

  @Input() field: string;

  @Input() scrollHeight = '200px';

  @Input() dropdown: boolean;

  @Input() multiple: boolean;

  @Input() tabindex: number;

  @Output() completeMethod: EventEmitter<any> = new EventEmitter();

  @Output() select: EventEmitter<any> = new EventEmitter();

  @Output() unselect: EventEmitter<any> = new EventEmitter();

  @Output() dropdownClick: EventEmitter<any> = new EventEmitter();

  @Output() add: EventEmitter<any> = new EventEmitter();

  @ContentChildren(PrimeTemplate) templates: QueryList<any>;

  @ViewChild('in') inputEL: ElementRef;

  public itemTemplate: TemplateRef<any>;

  value: any;

  timeout: any;

  differ: any;

  panel: any;

  input: any;

  multipleContainer: any;

  panelVisible = false;

  documentClickListener: any;

  suggestionsUpdated: boolean;

  highlightOption: any;

  highlightOptionChanged: boolean;

  focus = false;

  dropdownFocus = false;

  filled: boolean;

  onModelChange: Function = () => { };

  onModelTouched: Function = () => { };

  constructor(public el: ElementRef,
    public domHandler: DomHandler,
    differs: IterableDiffers,
    public renderer: Renderer2) {
    this.differ = differs.find([]).create(null);
  }

  ngDoCheck() {
    const changes = this.differ.diff(this.suggestions);
    if ((changes && this.panel) || !this.panelVisible) {
      if (this.suggestions && this.suggestions.length) {
        this.show();
        this.suggestionsUpdated = true;
      } else {
        this.hide();
      }
    }
  }

  ngAfterContentInit() {
    this.templates.forEach((item) => {
      switch (item.getType()) {
        case 'item':
          this.itemTemplate = item.template;
          break;

        default:
          this.itemTemplate = item.template;
          break;
      }
    });
  }

  ngAfterViewInit() {
    this.input = this.domHandler.findSingle(this.el.nativeElement, 'input');
    this.panel = this.domHandler.findSingle(this.el.nativeElement, 'div.ui-autocomplete-panel');

    if (this.multiple) {
      this.multipleContainer = this.domHandler.findSingle(this.el.nativeElement, 'ul.ui-autocomplete-multiple-container');
    }

    this.documentClickListener = this.renderer.listen('body', 'click', () => {
      this.hide();
    });

    if (this.appendTo) {
      if (this.appendTo === 'body') {
        document.body.appendChild(this.panel);
      } else {
        this.domHandler.appendChild(this.panel, this.appendTo);
      }
    }
  }

  ngAfterViewChecked() {
    if (this.suggestionsUpdated) {
      this.align();
      this.suggestionsUpdated = false;
    }

    if (this.highlightOptionChanged) {
      const listItem = this.domHandler.findSingle(this.panel, 'li.ui-state-highlight');
      if (listItem) {
        this.domHandler.scrollInView(this.panel, listItem);
      }
      this.highlightOptionChanged = false;
    }
  }

  writeValue(value: any): void {
    this.value = value;
    this.filled = this.value && this.value !== '';
  }

  registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }

  setDisabledState(val: boolean): void {
    this.disabled = val;
  }

  onInput(event: any) {
    const value = event.target.value;
    if (!this.multiple) {
      this.value = value;
      this.onModelChange(value);
    }

    if (value.length === 0) {
      this.hide();
    }

    if (value.length >= this.minLength) {
      // Cancel the search request if user types within the timeout
      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.timeout = setTimeout(() => {
        this.search(event, value);
      }, this.delay);
    } else {
      this.suggestions = null;
    }
    this.updateFilledState();
  }

  search(event: any, query: string) {
    // allow empty string but not undefined or null
    if (query === undefined || query === null) {
      return;
    }

    this.completeMethod.emit({
      originalEvent: event,
      query: query
    });
  }

  selectItem(option: any) {
    if (!option) { return; }

    if (this.multiple) {
      this.input.value = '';
      this.value = this.value || [];
      if (!this.isSelected(option)) {
        this.value.push(option);
        this.onModelChange(this.value);
        this.suggestions = [];
      }
    } else {
      this.input.value = this.field ? this.resolveFieldData(option) : option;
      this.value = option;
      this.onModelChange(this.value);
    }

    if (typeof option === 'object') {
      this.select.emit(option);
    } else {
      this.select.emit(option);
      this.add.emit({
        originalEvent: event,
        value: option
      });
    }


    this.input.focus();
  }

  show() {
    if (!this.panelVisible && (this.focus || this.dropdownFocus)) {
      this.panelVisible = true;
      this.panel.style.zIndex = ++DomHandler.zindex;
      this.domHandler.fadeIn(this.panel, 200);
    }
  }

  align() {
    if (this.appendTo) {
      this.domHandler.absolutePosition(this.panel, (this.multiple ? this.multipleContainer : this.input));
    } else {
      this.domHandler.relativePosition(this.panel, (this.multiple ? this.multipleContainer : this.input));
    }
  }

  hide() {
    this.panelVisible = false;
  }

  handleDropdownClick(event: any) {
    this.dropdownClick.emit({
      originalEvent: event,
      query: this.input.value
    });
  }

  removeItem(item: any) {
    const itemIndex = this.domHandler.index(item);
    const removedValue = this.value.splice(itemIndex, 1)[0];
    this.unselect.emit(removedValue);
    this.onModelChange(this.value);
  }

  resolveFieldData(data: any): any {
    if (data && this.field) {
      if (this.field.indexOf('.') === -1) {
        return data[this.field];
      } else {
        const fields: string[] = this.field.split('.');
        let value = data;
        for (let i = 0, len = fields.length; i < len; ++i) {
          value = value[fields[i]];
        }
        return value;
      }
    } else {
      return null;
    }
  }

  onKeydown(event: any, inputEL: HTMLInputElement) {
    if (this.panelVisible && this.highlightOption) {
      const highlightItemIndex = this.findOptionIndex(this.highlightOption);

      switch (event.which) {
        // down
        case 40:
          if (highlightItemIndex !== -1) {
            const nextItemIndex = highlightItemIndex + 1;
            if (nextItemIndex !== (this.suggestions.length)) {
              this.highlightOption = this.suggestions[nextItemIndex];
              this.highlightOptionChanged = true;
            }
          } else {
            this.highlightOption = this.suggestions[0];
          }

          event.preventDefault();
          break;

        // up
        case 38:
          if (highlightItemIndex > 0) {
            const prevItemIndex = highlightItemIndex - 1;
            this.highlightOption = this.suggestions[prevItemIndex];
            this.highlightOptionChanged = true;
          }

          event.preventDefault();
          break;

        // enter
        case 13:
          if (this.highlightOption) {

            this.selectItem(this.highlightOption);
            this.hide();
          }
          event.preventDefault();
          break;

        // escape
        case 27:
          this.hide();
          event.preventDefault();
          break;


        // tab
        case 9:
          if (this.highlightOption) {
            this.selectItem(this.highlightOption);
          }
          this.hide();
          break;
      }
    } else {
      if (event.which === 40 && this.suggestions) {
        this.search(event, event.target.value);
      } else if (event.which === 13) {
        this.selectItem(event.target.value);
        event.preventDefault();
      } else if (event.which === 9) {
        this.selectItem(event.target.value);
      }
    }

    if (this.multiple) {
      switch (event.which) {
        // backspace
        case 8:
          if (this.value && this.value.length && !this.input.value) {
            const removedValue = this.value.pop();
            this.unselect.emit(removedValue);
            this.onModelChange(this.value);
          }
          break;
      }
    }
  }

  onFocus() {
    this.focus = true;
  }

  onBlur() {
    this.focus = false;
    this.onModelTouched();
  }

  onDropdownFocus() {
    this.dropdownFocus = true;
    this.inputEL.nativeElement.focus();
  }

  onDropdownBlur() {
    this.dropdownFocus = false;
  }

  isSelected(val: any): boolean {
    let selected = false;
    if (this.value && this.value.length) {
      for (let i = 0; i < this.value.length; i++) {
        if (this.value[i] === val) {
          selected = true;
          break;
        }
      }
    }
    return selected;
  }

  findOptionIndex(option: any): number {
    let index = -1;
    if (this.suggestions) {
      for (let i = 0; i < this.suggestions.length; i++) {
        if (option === this.suggestions[i]) {
          index = i;
          break;
        }
      }
    }

    return index;
  }

  updateFilledState() {
    this.filled = this.input && this.input.value !== '';
  }

  ngOnDestroy() {
    if (this.documentClickListener) {
      this.documentClickListener();
    }

    if (this.appendTo) {
      this.el.nativeElement.appendChild(this.panel);
    }
  }
}
