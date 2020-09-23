import { Component, Input } from '@angular/core';

@Component({
  selector: 'spinner-indicator-200',
  templateUrl: './spinner-indicator-200.component.html',
  styleUrls: ['./spinner-indicator-200.component.css']
})
export class SpinnerIndicator200Component {
  @Input() width = '200px';
  @Input() height = '200px';
}
