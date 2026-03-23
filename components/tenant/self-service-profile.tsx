"use client"

import { useState, useEffect } from "react"

interface TenantProfile {
  emergencyContactName?: string
  emergencyContactPhone?: string
  emergencyContactRelation?: string
  vehicleMake?: string
  vehicleModel?: string
  vehicleYear?: number
  vehicleColor?: string
  vehiclePlate?: string
  hasPets: boolean
  petDetails?: Array<{ type: string; breed: string; name: string; weight?: number }>
}

interface SelfServiceProfileProps {
  profile: TenantProfile | null
  onSave: (data: TenantProfile) => Promise<void>
}

export function SelfServiceProfile({ profile, onSave }: SelfServiceProfileProps) {
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const [emergencyName, setEmergencyName] = useState(profile?.emergencyContactName || "")
  const [emergencyPhone, setEmergencyPhone] = useState(profile?.emergencyContactPhone || "")
  const [emergencyRelation, setEmergencyRelation] = useState(profile?.emergencyContactRelation || "")
  const [vehicleMake, setVehicleMake] = useState(profile?.vehicleMake || "")
  const [vehicleModel, setVehicleModel] = useState(profile?.vehicleModel || "")
  const [vehicleYear, setVehicleYear] = useState(profile?.vehicleYear?.toString() || "")
  const [vehicleColor, setVehicleColor] = useState(profile?.vehicleColor || "")
  const [vehiclePlate, setVehiclePlate] = useState(profile?.vehiclePlate || "")
  const [hasPets, setHasPets] = useState(profile?.hasPets || false)
  const [petName, setPetName] = useState(profile?.petDetails?.[0]?.name || "")
  const [petType, setPetType] = useState(profile?.petDetails?.[0]?.type || "")
  const [petBreed, setPetBreed] = useState(profile?.petDetails?.[0]?.breed || "")

  const handleSave = async () => {
    setSaving(true)
    setSuccess(false)
    try {
      await onSave({
        emergencyContactName: emergencyName || undefined,
        emergencyContactPhone: emergencyPhone || undefined,
        emergencyContactRelation: emergencyRelation || undefined,
        vehicleMake: vehicleMake || undefined,
        vehicleModel: vehicleModel || undefined,
        vehicleYear: vehicleYear ? parseInt(vehicleYear) : undefined,
        vehicleColor: vehicleColor || undefined,
        vehiclePlate: vehiclePlate || undefined,
        hasPets,
        petDetails: hasPets && petName ? [{ type: petType, breed: petBreed, name: petName }] : [],
      })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"

  return (
    <div className="space-y-8">
      {/* Emergency Contact */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input className={inputClass} value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} placeholder="Contact name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input className={inputClass} type="tel" value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} placeholder="Phone number" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
            <input className={inputClass} value={emergencyRelation} onChange={(e) => setEmergencyRelation(e.target.value)} placeholder="e.g. Spouse, Parent" />
          </div>
        </div>
      </section>

      {/* Vehicle Info */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <input className={inputClass} value={vehicleMake} onChange={(e) => setVehicleMake(e.target.value)} placeholder="Make" />
          <input className={inputClass} value={vehicleModel} onChange={(e) => setVehicleModel(e.target.value)} placeholder="Model" />
          <input className={inputClass} type="number" value={vehicleYear} onChange={(e) => setVehicleYear(e.target.value)} placeholder="Year" />
          <input className={inputClass} value={vehicleColor} onChange={(e) => setVehicleColor(e.target.value)} placeholder="Color" />
          <input className={inputClass} value={vehiclePlate} onChange={(e) => setVehiclePlate(e.target.value)} placeholder="License Plate" />
        </div>
      </section>

      {/* Pet Info */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pets</h3>
        <label className="flex items-center gap-2 mb-4 cursor-pointer">
          <input type="checkbox" checked={hasPets} onChange={(e) => setHasPets(e.target.checked)} className="rounded" />
          <span className="text-sm">I have pets</span>
        </label>
        {hasPets && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input className={inputClass} value={petName} onChange={(e) => setPetName(e.target.value)} placeholder="Pet name" />
            <input className={inputClass} value={petType} onChange={(e) => setPetType(e.target.value)} placeholder="Type (dog, cat, etc.)" />
            <input className={inputClass} value={petBreed} onChange={(e) => setPetBreed(e.target.value)} placeholder="Breed" />
          </div>
        )}
      </section>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
        {success && <span className="text-green-600 text-sm">Profile saved successfully!</span>}
      </div>
    </div>
  )
}
