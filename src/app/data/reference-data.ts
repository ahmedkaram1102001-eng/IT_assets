import { AssetStatus, DeviceType } from '../models/asset.model';

export const COMPANIES: string[] = ['بسكو مصر', 'الأمير', 'الوجد', 'كرافت', 'ويسما'];

export const DEVICE_TYPES: DeviceType[] = ['لاب توب', 'تليفون'];

export const STATUSES: AssetStatus[] = ['جديد', 'فعلي', 'صيانة', 'خارج الخدمة'];

export const STATUS_LABELS: Record<AssetStatus, string> = {
  'جديد': 'جديد',
  'فعلي': 'فعلي (شغال)',
  'صيانة': 'في الصيانة',
  'خارج الخدمة': 'خارج الخدمة',
};
