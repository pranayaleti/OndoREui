import { networkFirstGet } from "@/lib/api/http"

export interface Equipment {
  id: string
  propertyId: string
  name: string
  category: string
  manufacturer: string | null
  model: string | null
  condition: string
  lastServiceDate: string | null
  nextServiceDate: string | null
  installDate: string | null
  expectedLifespanYears: number | null
  warrantyExpiry: string | null
  replacementCostCents: number | null
}

export interface MaintenanceForecast {
  upcoming: Array<{
    equipmentId: string
    equipmentName: string
    dueDate: string
    type: string
    estimatedCostCents: number | null
  }>
}

export async function getEquipment(propertyId: string): Promise<Equipment[]> {
  const res = await networkFirstGet<{ data: Equipment[] }>(
    `/api/experience/properties/${propertyId}/equipment`,
    `equipment-${propertyId}`
  )
  return res.data ?? []
}

export async function getAtRiskEquipment(propertyId: string): Promise<Equipment[]> {
  const res = await networkFirstGet<{ data: Equipment[] }>(
    `/api/experience/properties/${propertyId}/equipment/at-risk`,
    `equipment-at-risk-${propertyId}`
  )
  return res.data ?? []
}

export async function getMaintenanceForecast(propertyId: string): Promise<MaintenanceForecast> {
  const res = await networkFirstGet<{ data: MaintenanceForecast }>(
    `/api/experience/properties/${propertyId}/maintenance-forecast`,
    `maintenance-forecast-${propertyId}`
  )
  return res.data
}
