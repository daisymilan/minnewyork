
export interface DashboardWarehouse {
  id?: string;
  name: string;
  location: string;
  status: string;
  total_items: number;
  warehouse_type?: 'manufacturing' | 'fulfillment';
  capacity?: string;
  current_stock?: number;
}
