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
  private target = signal(this.getNextValentines(0, 0, 0));
  private now = signal(Date.now());
  private timerId = window.setInterval(() => this.now.set(Date.now()), 1000);

  isValentinesDay = computed(() => {
    const d = new Date(this.now());
    return d.getMonth() === 1 && d.getDate() === 14; // Feb = 1
  });

  remaining = computed(() => {
    const diff = Math.max(0, this.target().getTime() - this.now());
    return this.formatMs(diff);
  });

  targetLabel = computed(() =>
    this.target().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
  );

  ngOnDestroy() {
    clearInterval(this.timerId);
  }

  private getNextValentines(h: number, m: number, s: number) {
    const now = new Date();
    const year = now.getFullYear();
    const t = new Date(year, 1, 14, h, m, s, 0);
    if (t.getTime() <= now.getTime()) t.setFullYear(year + 1);
    return t;
  }

  countdownTitle = computed(() => {
    const ms = this.target().getTime() - this.now();
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    if (days > 7) return 'Waiting for Valentine’s Day 💘';
    if (days > 1) return 'Almost Valentine’s Day 💝';
    return 'It’s almost here… ❤️';
  });

  private formatMs(ms: number) {
    const totalSeconds = Math.floor(ms / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => String(n).padStart(2, '0');

    return `${days} days ${pad(hours)} hours ${pad(minutes)} minutes ${pad(seconds)} seconds`;
  }

  // ===== GAME =====
  @ViewChild('playArea') playArea!: ElementRef<HTMLDivElement>;

  showAreYouSure = signal(true);
  message = signal('');

  isYes = signal(this.isLoveAnswerValid());

  private isLoveAnswerValid(): boolean {
    const expiry = localStorage.getItem('loveAnswerExpiresAt');
    if (!expiry) return false;

    return Date.now() < Number(expiry);
  }

  ngOnInit() {
    const year = localStorage.getItem('loveAnswerYear');
    const currentYear = String(new Date().getFullYear());

    if (year && year !== currentYear) {
      localStorage.removeItem('loveAnswerYear');
    }

    if (this.isYes()) {
      this.onYes();
    }
  }

  startGame() {
    this.showAreYouSure.set(false);
    this.message.set('😏 Try clicking No…');
  }

  onYes() {
    this.message.set('Awww 😍 I knew it! 💖\nHappy Valentine’s Day 💝');
    this.isYes.set(true);

    const now = new Date();
    const expiresAt = new Date(
      now.getFullYear(),
      1, // February
      15, // Feb 15
      0,
      0,
      0,
      0,
    ).getTime();

    localStorage.setItem('loveAnswerExpiresAt', String(expiresAt));
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
