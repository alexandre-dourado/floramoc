import type {
  Category, IdentificationLevel, LocationPrecision, OccurrenceType, PlantStatus, QuantityEstimate, ReportReason,
} from '../lib/constants'

export interface PublicPlant {
  id: string
  common_name: string
  scientific_name: string | null
  category: Category
  identification_level: IdentificationLevel
  occurrence_type: OccurrenceType
  quantity_estimate: QuantityEstimate
  latitude: number
  longitude: number
  location_precision: LocationPrecision
  photo_path: string | null
  description: string | null
  created_at: string
  updated_at: string
}

export interface Plant extends PublicPlant {
  created_by: string
  status: PlantStatus
  moderation_note: string | null
  reviewed_by: string | null
  reviewed_at: string | null
}

export interface PlantReport {
  id: string
  plant_id: string
  reported_by: string
  reason: ReportReason
  details: string | null
  status: 'open' | 'resolved' | 'dismissed'
  admin_note: string | null
  created_at: string
  plants?: { common_name: string } | null
}

export interface Bounds { west: number; south: number; east: number; north: number }

export interface AdminStats {
  pending: number
  approved: number
  rejected_archived: number
  open_reports: number
  contributors: number
  last_30_days: number
  by_category: Record<string, number>
}
