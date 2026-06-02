// ============================================================
// Client Model
// ============================================================
export interface Client {
  id?: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  idCard?: string;
  createdAt?: string;
}

// ============================================================
// Employee Model
// ============================================================
export type EmployeePosition = 'MANAGER' | 'RECEPTIONIST' | 'HOUSEKEEPER' | 'MAINTENANCE' | 'CHEF' | 'SECURITY';

export interface Employee {
  id?: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  position: EmployeePosition;
  department?: string;
  salary?: number;
  hireDate: string;
  active: boolean;
  createdAt?: string;
}

// ============================================================
// Dashboard Stats Model
// ============================================================
export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface DashboardStats {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  maintenanceRooms: number;
  totalReservations: number;
  pendingReservations: number;
  confirmedReservations: number;
  checkedInReservations: number;
  totalClients: number;
  totalEmployees: number;
  totalRevenue: number;
  monthlyRevenue: number;
  occupancyRate: number;
  monthlyRevenueChart: MonthlyRevenue[];
  roomTypeDistribution: { [key: string]: number };
  reservationStatusDistribution: { [key: string]: number };
}
