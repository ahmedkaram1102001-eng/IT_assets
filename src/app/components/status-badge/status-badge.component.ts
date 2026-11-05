import { Component, Input } from '@angular/core';
import { AssetStatus } from '../../models/asset.model';
import { STATUS_LABELS } from '../../data/reference-data';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `<span class="badge" [class]="statusClass">{{ label }}</span>`,
  styles: [
    `
      .badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 12px;
        border-radius: 999px;
        font-size: 13px;
        font-weight: 700;
        white-space: nowrap;
      }
      .badge::before {
        content: '';
        width: 7px;
        height: 7px;
        border-radius: 50%;
      }
      .جديد {
        background: var(--status-new-bg);
        color: var(--status-new);
      }
      .جديد::before { background: var(--status-new); }

      .فعلي {
        background: var(--status-active-bg);
        color: var(--status-active);
      }
      .فعلي::before { background: var(--status-active); }

      .صيانة {
        background: var(--status-maint-bg);
        color: var(--status-maint);
      }
      .صيانة::before { background: var(--status-maint); }

      .خارج-الخدمة {
        background: var(--status-retired-bg, #f3f4f6);
        color: var(--status-retired, #4b5563);
      }
      .خارج-الخدمة::before { background: var(--status-retired, #4b5563); }
    `,
  ],
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: AssetStatus;

  get label(): string {
    return STATUS_LABELS[this.status];
  }

  get statusClass(): string {
    return this.status.replace(/\s+/g, '-');
  }
}
