import {
  Component,
  computed,
  signal,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FloatingHeartsComponentComponent } from './components/floating-hearts-component/floating-hearts-component.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FloatingHeartsComponentComponent, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnDestroy {
  // ===== TIMER =====
  private target = signal(this.getTodayTarget(14,0, 0));
  private now = signal(Date.now());
  private timerId = window.setInterval(() => this.now.set(Date.now()), 1000);

  isTime = computed(() => this.now() >= this.target().getTime());

  remaining = computed(() => {
    const diff = Math.max(0, this.target().getTime() - this.now());
    return this.formatMs(diff);
  });

  targetLabel = computed(() =>
    this.target().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  );

  ngOnDestroy() {
    clearInterval(this.timerId);
  }

  private getTodayTarget(h: number, m: number, s: number) {
    const d = new Date();
    d.setHours(h, m, s, 0);
    // if time already passed today, move to tomorrow
    if (d.getTime() <= Date.now()) d.setDate(d.getDate() + 1);
    return d;
  }

  private formatMs(ms: number) {
    const t = Math.floor(ms / 1000);
    const hh = Math.floor(t / 3600);
    const mm = Math.floor((t % 3600) / 60);
    const ss = t % 60;
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(hh)}:${pad(mm)}:${pad(ss)}`;
  }

  // ===== GAME =====
  @ViewChild('playArea') playArea!: ElementRef<HTMLDivElement>;

  showAreYouSure = signal(true);
  message = signal('');
  isYes = signal( localStorage.getItem('loveAnswer') ?? false);

  ngOnInit() {
    if(this.isYes()){
      this.onYes();
    }
  }

  startGame() {
    this.showAreYouSure.set(false);
    this.message.set('😏 Try clicking No…');
  }

  onYes() {
    this.message.set('Awww 😍 I knew it! 💖\nHappy late Valentine’s Day 💝');
    this.isYes.set(true)
    localStorage.setItem('loveAnswer', 'true');
  }


  // Only called from the NO button events
moveNo(event: MouseEvent) {
  if (this.showAreYouSure()) return;

  const btn = event.target as HTMLElement;
  const area = btn.parentElement as HTMLElement;

  if (!btn || !area) return;

  const areaRect = area.getBoundingClientRect();
  const btnRect = btn.getBoundingClientRect();

  const maxX = areaRect.width - btnRect.width;
  const maxY = areaRect.height - btnRect.height;

  const x = Math.random() * 2 * maxX;
  const y = Math.random() * 2 * maxY;

  btn.style.position = 'absolute';
  btn.style.left = `${x}px`;
  btn.style.top = `${y}px`;

  const lines = [
    'Nice try 😭',
    'Nope 😂',
    'You can’t catch me 🚀',
    'Pick Yes 😏',
    'Too slow 😎',
  ];

  this.message.set(lines[Math.floor(Math.random() * lines.length)]);
}
}
