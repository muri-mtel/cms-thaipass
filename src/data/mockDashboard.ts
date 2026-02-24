export type DateRangeKey = 'last7' | 'last30' | 'last12m';

export interface LocationCount  { label: string; count: number }
export interface RevenueBlock   { fastPass: number; transport: number; esim: number; total: number }
export interface UserSegment    { label: string; description: string; count: number; color: string }

export interface DashboardData {
  period: string;

  // ── User ──────────────────────────────────────────────────────────────────
  totalAppDownloads: number;
  totalRegisteredUsers: number;

  // ── TDAC ─────────────────────────────────────────────────────────────────
  totalTDACSubmissions: number;
  uniqueTDACUsers: number;

  // ── FastPass ──────────────────────────────────────────────────────────────
  totalFastPassPurchased: number;
  uniqueFastPassUsers: number;

  // ── Transportation ────────────────────────────────────────────────────────
  totalTransportBookings: number;
  airportTransferCount: number;
  chauffeurServiceCount: number;
  pickupLocations: LocationCount[];
  dropoffRegions: LocationCount[];

  // ── eSIM ──────────────────────────────────────────────────────────────────
  totalESIMPurchased: number;
  // Unlimited
  unlimitedUniqueUsers: number;
  unlimitedTotalOrders: number;
  // Standard
  standardUniqueUsers: number;
  standardTotalOrders: number;
  // Free vs Paid installs
  totalFreeInstalls: number;
  totalPaidInstalls: number;

  // ── Revenue ───────────────────────────────────────────────────────────────
  totalRevenue: RevenueBlock;
  platformRevenue: RevenueBlock;

  // ── User Segments ─────────────────────────────────────────────────────────
  userSegments: UserSegment[];
}

// ── Pre-computed snapshots ────────────────────────────────────────────────────

const SNAPSHOTS: Record<DateRangeKey, DashboardData> = {
  last7: {
    period: 'Last 7 Days',
    totalAppDownloads: 142,
    totalRegisteredUsers: 38,

    totalTDACSubmissions: 31,
    uniqueTDACUsers: 28,

    totalFastPassPurchased: 24,
    uniqueFastPassUsers: 19,

    totalTransportBookings: 15,
    airportTransferCount: 11,
    chauffeurServiceCount: 4,
    pickupLocations: [
      { label: 'BKK Airport (Suvarnabhumi)', count: 9 },
      { label: 'DMK (Domestic)',             count: 1 },
      { label: 'DMK (Int\'l)',               count: 1 },
    ],
    dropoffRegions: [
      { label: 'Bangkok',    count: 10 },
      { label: 'Hua Hin',    count: 2 },
      { label: 'Ayutthaya',  count: 1 },
      { label: 'Koh Chang',  count: 1 },
      { label: 'Koh Samet',  count: 1 },
    ],

    totalESIMPurchased: 18,
    unlimitedUniqueUsers: 5,
    unlimitedTotalOrders: 6,
    standardUniqueUsers: 7,
    standardTotalOrders: 9,
    totalFreeInstalls: 3,
    totalPaidInstalls: 15,

    totalRevenue:    { fastPass: 11_976, transport: 13_850, esim: 6_149,  total: 31_975 },
    platformRevenue: { fastPass: 11_976, transport: 2_770,  esim: 1_845,  total: 16_591 },

    userSegments: [
      { label: 'Registered Non-buyers',  description: 'Registered, no purchases',                           count: 14, color: 'bg-slate-300' },
      { label: 'FastPass Only',          description: 'Registered + FastPass',                               count: 7,  color: 'bg-blue-400' },
      { label: 'Transport Only',         description: 'Registered + Transport',                              count: 4,  color: 'bg-sky-400' },
      { label: 'eSIM Only',              description: 'Registered + eSIM',                                   count: 4,  color: 'bg-violet-400' },
      { label: 'FastPass + eSIM',        description: 'Registered + FastPass + eSIM',                        count: 4,  color: 'bg-indigo-400' },
      { label: 'FastPass + Transport',   description: 'Registered + FastPass + Transport',                   count: 3,  color: 'bg-teal-400' },
      { label: 'All Products',           description: 'Registered + FastPass + Transport + eSIM',            count: 2,  color: 'bg-amber-400' },
    ],
  },

  last30: {
    period: 'Last 30 Days',
    totalAppDownloads: 583,
    totalRegisteredUsers: 147,

    totalTDACSubmissions: 124,
    uniqueTDACUsers: 108,

    totalFastPassPurchased: 89,
    uniqueFastPassUsers: 72,

    totalTransportBookings: 61,
    airportTransferCount: 44,
    chauffeurServiceCount: 17,
    pickupLocations: [
      { label: 'BKK Airport (Suvarnabhumi)', count: 36 },
      { label: 'DMK (Domestic)',             count: 5  },
      { label: 'DMK (Int\'l)',               count: 3  },
    ],
    dropoffRegions: [
      { label: 'Bangkok',    count: 39 },
      { label: 'Hua Hin',    count: 10 },
      { label: 'Ayutthaya',  count: 5  },
      { label: 'Koh Chang',  count: 4  },
      { label: 'Koh Samet',  count: 3  },
    ],

    totalESIMPurchased: 74,
    unlimitedUniqueUsers: 19,
    unlimitedTotalOrders: 24,
    standardUniqueUsers: 28,
    standardTotalOrders: 35,
    totalFreeInstalls: 15,
    totalPaidInstalls: 59,

    totalRevenue:    { fastPass: 44_411, transport: 54_900, esim: 25_826, total: 125_137 },
    platformRevenue: { fastPass: 44_411, transport: 10_980, esim: 7_748,  total: 63_139  },

    userSegments: [
      { label: 'Registered Non-buyers',  description: 'Registered, no purchases',                           count: 52, color: 'bg-slate-300' },
      { label: 'FastPass Only',          description: 'Registered + FastPass',                               count: 27, color: 'bg-blue-400' },
      { label: 'Transport Only',         description: 'Registered + Transport',                              count: 16, color: 'bg-sky-400' },
      { label: 'eSIM Only',              description: 'Registered + eSIM',                                   count: 18, color: 'bg-violet-400' },
      { label: 'FastPass + eSIM',        description: 'Registered + FastPass + eSIM',                        count: 14, color: 'bg-indigo-400' },
      { label: 'FastPass + Transport',   description: 'Registered + FastPass + Transport',                   count: 12, color: 'bg-teal-400' },
      { label: 'All Products',           description: 'Registered + FastPass + Transport + eSIM',            count: 8,  color: 'bg-amber-400' },
    ],
  },

  last12m: {
    period: 'Last 12 Months',
    totalAppDownloads: 7_241,
    totalRegisteredUsers: 1_832,

    totalTDACSubmissions: 1_544,
    uniqueTDACUsers: 1_320,

    totalFastPassPurchased: 1_089,
    uniqueFastPassUsers: 872,

    totalTransportBookings: 724,
    airportTransferCount: 531,
    chauffeurServiceCount: 193,
    pickupLocations: [
      { label: 'BKK Airport (Suvarnabhumi)', count: 438 },
      { label: 'DMK (Domestic)',             count: 57  },
      { label: 'DMK (Int\'l)',               count: 36  },
    ],
    dropoffRegions: [
      { label: 'Bangkok',    count: 481 },
      { label: 'Hua Hin',    count: 118 },
      { label: 'Ayutthaya',  count: 62  },
      { label: 'Koh Chang',  count: 38  },
      { label: 'Koh Samet',  count: 25  },
    ],

    totalESIMPurchased: 891,
    unlimitedUniqueUsers: 231,
    unlimitedTotalOrders: 298,
    standardUniqueUsers: 344,
    standardTotalOrders: 421,
    totalFreeInstalls: 172,
    totalPaidInstalls: 719,

    totalRevenue:    { fastPass: 543_411, transport: 651_600, esim: 311_850, total: 1_506_861 },
    platformRevenue: { fastPass: 543_411, transport: 130_320, esim:  93_555, total:   767_286 },

    userSegments: [
      { label: 'Registered Non-buyers',  description: 'Registered, no purchases',                           count: 614, color: 'bg-slate-300' },
      { label: 'FastPass Only',          description: 'Registered + FastPass',                               count: 334, color: 'bg-blue-400' },
      { label: 'Transport Only',         description: 'Registered + Transport',                              count: 198, color: 'bg-sky-400' },
      { label: 'eSIM Only',              description: 'Registered + eSIM',                                   count: 219, color: 'bg-violet-400' },
      { label: 'FastPass + eSIM',        description: 'Registered + FastPass + eSIM',                        count: 168, color: 'bg-indigo-400' },
      { label: 'FastPass + Transport',   description: 'Registered + FastPass + Transport',                   count: 144, color: 'bg-teal-400' },
      { label: 'All Products',           description: 'Registered + FastPass + Transport + eSIM',            count: 155, color: 'bg-amber-400' },
    ],
  },
};

export function getDashboardData(key: DateRangeKey): DashboardData {
  return SNAPSHOTS[key];
}

// ── Snapshot metadata ─────────────────────────────────────────────────────────
const SNAPSHOT_DAYS: Record<DateRangeKey, number> = {
  last7:   7,
  last30:  30,
  last12m: 365,
};

// ── Scale helpers ─────────────────────────────────────────────────────────────
function scaleInt(n: number, factor: number): number {
  return Math.max(0, Math.round(n * factor));
}

function scaledData(base: DashboardData, days: number, label: string): DashboardData {
  // Pick which snapshot to base interpolation off for best accuracy
  let baseKey: DateRangeKey = 'last12m';
  if (days <= 14)  baseKey = 'last7';
  else if (days <= 60) baseKey = 'last30';
  const snap = SNAPSHOTS[baseKey];
  const factor = days / SNAPSHOT_DAYS[baseKey];

  return {
    period: label,
    totalAppDownloads:    scaleInt(snap.totalAppDownloads,    factor),
    totalRegisteredUsers: scaleInt(snap.totalRegisteredUsers, factor),

    totalTDACSubmissions: scaleInt(snap.totalTDACSubmissions, factor),
    uniqueTDACUsers:      scaleInt(snap.uniqueTDACUsers,      factor),

    totalFastPassPurchased: scaleInt(snap.totalFastPassPurchased, factor),
    uniqueFastPassUsers:    scaleInt(snap.uniqueFastPassUsers,    factor),

    totalTransportBookings: scaleInt(snap.totalTransportBookings, factor),
    airportTransferCount:   scaleInt(snap.airportTransferCount,   factor),
    chauffeurServiceCount:  scaleInt(snap.chauffeurServiceCount,  factor),
    pickupLocations: snap.pickupLocations.map((l) => ({
      label: l.label,
      count: scaleInt(l.count, factor),
    })),
    dropoffRegions: snap.dropoffRegions.map((l) => ({
      label: l.label,
      count: scaleInt(l.count, factor),
    })),

    totalESIMPurchased:    scaleInt(snap.totalESIMPurchased,    factor),
    unlimitedUniqueUsers:  scaleInt(snap.unlimitedUniqueUsers,  factor),
    unlimitedTotalOrders:  scaleInt(snap.unlimitedTotalOrders,  factor),
    standardUniqueUsers:   scaleInt(snap.standardUniqueUsers,   factor),
    standardTotalOrders:   scaleInt(snap.standardTotalOrders,   factor),
    totalFreeInstalls:     scaleInt(snap.totalFreeInstalls,     factor),
    totalPaidInstalls:     scaleInt(snap.totalPaidInstalls,     factor),

    totalRevenue: {
      fastPass:  scaleInt(snap.totalRevenue.fastPass,  factor),
      transport: scaleInt(snap.totalRevenue.transport, factor),
      esim:      scaleInt(snap.totalRevenue.esim,      factor),
      total:     scaleInt(snap.totalRevenue.total,     factor),
    },
    platformRevenue: {
      fastPass:  scaleInt(snap.platformRevenue.fastPass,  factor),
      transport: scaleInt(snap.platformRevenue.transport, factor),
      esim:      scaleInt(snap.platformRevenue.esim,      factor),
      total:     scaleInt(snap.platformRevenue.total,     factor),
    },

    // User segments: scale counts but keep proportions & colours
    userSegments: snap.userSegments.map((seg) => ({
      ...seg,
      count: scaleInt(seg.count, factor),
    })),
  };
}

/**
 * Returns dashboard data for an arbitrary date range.
 * Metrics are proportionally interpolated from the nearest pre-computed snapshot.
 */
export function getDashboardDataForRange(fromDate: Date, toDate: Date): DashboardData {
  const msPerDay = 1000 * 60 * 60 * 24;
  const days = Math.max(1, Math.round((toDate.getTime() - fromDate.getTime()) / msPerDay) + 1);

  const fmt = (d: Date) =>
    d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const label = `${fmt(fromDate)} – ${fmt(toDate)}`;

  return scaledData(SNAPSHOTS.last12m, days, label);
}
