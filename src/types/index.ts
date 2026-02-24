export type TDACStatus = 'No Submission' | 'Submitted';

export interface User {
  id: string;
  name: string;
  email: string;
  nationality: string;
  tdacStatus: TDACStatus;
  registeredDate: string; // ISO date string
}

export interface PurchaseHistoryItem {
  id: string;
  itemName: string;
  transactionId: string;
  price: number;
  currency: string;
  lastFourDigits: string;
  purchasedAt: string; // ISO datetime string
}

export type FastPassStatus = 'Active' | 'Redeemed' | 'Expired';

export interface FastPassOrder {
  id: string;          // Order ID
  email: string;       // Purchaser email
  price: number;
  currency: string;
  purchasedAt: string; // ISO datetime string
  updatedAt: string;   // ISO datetime string
  expiresAt: string;   // ISO datetime string
  status: FastPassStatus;
  // Payment detail
  transactionId: string;
  lastFourDigits: string;
}

export type TDACEntryStatus = 'Active' | 'Expired';

export interface TDACEntry {
  id: string;
  accountEmail: string;       // links to User.email
  // Personal info from the TDAC form
  name: string;
  passportNo: string;
  nationality: string;
  arrivalCardNo: string;
  // Travel info
  arrivalDate: string;        // ISO date string
  arrivalFlightOrVehicle: string;
  departureDate: string;      // ISO date string
  departureFlightOrVehicle: string;
  // Metadata
  submittedAt: string;        // ISO datetime string
  updatedAt: string;          // ISO datetime string
  status: TDACEntryStatus;
}

export type TransportServiceType = 'Airport Transfer' | 'Chauffeur Service';
export type TransportStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface TransportBooking {
  id: string;                      // Booking ID e.g. ID-101
  serviceType: TransportServiceType;
  accountEmail: string;
  // Passenger
  passengerName: string;
  passengerPhone: string;
  passengerContactEmail: string;
  flightNo: string;
  // Date / Time
  pickupDate: string;              // ISO date string
  pickupTime: string;              // HH:MM
  dropoffDate: string;             // ISO date string
  // Locations
  pickupLocation: string;
  pickupLocationDetail: string;    // e.g. gate / level
  dropoffLocation: string;
  dropoffAddress: string;
  // Requested car
  carBrand: string;
  carModel: string;
  // Driver (null until assigned)
  driverName: string | null;
  driverPhone: string | null;
  driverPlateNo: string | null;
  driverCarColor: string | null;
  driverCarModel: string | null;
  // Payment
  transactionId: string;
  paymentDate: string;             // ISO datetime string
  paymentMethod: string;
  subtotal: number;
  total: number;
  currency: string;
  // Metadata
  createdAt: string;               // ISO datetime string
  updatedAt: string;               // ISO datetime string
  status: TransportStatus;
}

export type ESIMProductName = 'Free eSIM' | 'Standard eSIM' | 'Unlimited eSIM';
export type ESIMOrderType  = 'Main' | 'Top-up';
export type ESIMStatus     = 'Active' | 'Not Active';
export type ESIMCardType   = 'Credit' | 'Debit';

export interface ESIMPaymentMethod {
  lastFourDigits: string;
  cardType: ESIMCardType;   // Credit | Debit
  cardBrand: string;        // Visa, Mastercard, Amex …
}

export interface ESIMStatusLog {
  purchasedAt:    string;         // ISO datetime – always present
  receivedAt:     string | null;  // ISO datetime
  installedAt:    string | null;  // ISO datetime
  activatedAt:    string | null;  // ISO datetime
  outOfDataAt:    string | null;  // ISO datetime
  expiredAt:      string | null;  // ISO datetime
}

export interface ESIMOrder {
  id: string;                     // Order ID e.g. ESIM-2025-001
  userEmail: string;
  productName: ESIMProductName;
  packageName: string;            // e.g. "7 Days 5 GB"
  price: number;
  currency: string;
  purchasedAt: string;            // ISO datetime
  status: ESIMStatus;
  orderType: ESIMOrderType;       // Main | Top-up

  // Usage
  dataUsageGB: number;            // captured at last sync

  // Payment
  payment: ESIMPaymentMethod;

  // Voucher
  appliedVoucher: string | null;

  // T&C
  tncAccepted: boolean;
  tncAcceptedAt: string | null;   // ISO datetime

  // Main eSIM only (null for Top-up)
  iccid:            string | null;
  smdpAddress:      string | null;
  activationCode:   string | null;
  confirmationCode: string | null;
  mobileModel:      string | null;

  // Top-up only (null for Main)
  linkedMainOrderId: string | null;

  // Status timeline
  statusLog: ESIMStatusLog;
}
