import { Component } from '@angular/core';
type Heart = { id: number; left: number; size: number; duration: number; delay: number; opacity: number };
@Component({
  selector: 'app-floating-hearts-component',
  imports: [],
  templateUrl: './floating-hearts-component.component.html',
  styleUrl: './floating-hearts-component.component.scss'
})
export class FloatingHeartsComponentComponent {
  hearts: Heart[] = Array.from({ length: 100 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 14 + Math.random() * 50,
    duration: 6 + Math.random() * 6,
    delay: Math.random() * 4,
    opacity: 0.25 + Math.random() * 0.45,
  }));
}
