export interface MaintenanceRecord {
  id: string;
  assetId: string;
  vendorName: string;
  issueDescription: string;
  sentDate: string;
  notes: string;
  returnDate: string | null;
  cost: number | null;
}

export type MaintenanceInput = Pick<
  MaintenanceRecord,
  'vendorName' | 'issueDescription' | 'sentDate' | 'notes'
>;
