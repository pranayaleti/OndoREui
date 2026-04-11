"use client"

import { useState, useEffect } from "react"
import { getTenantPets, addPet, updatePet } from "../../lib/api/tenant-services"

interface Pet {
  id: string
  name: string
  species: "cat" | "dog" | "other"
  breed: string
  weight: number
  color: string
  vaccinationDate?: string
  vaccinationCertUrl?: string
  vaccinationStatus: "current" | "expired" | "unknown"
}

interface PetPolicy {
  petDeposit: number
  monthlyPetRent: number
  maxPets: number
}

const emptyForm = {
  name: "",
  species: "dog" as Pet["species"],
  breed: "",
  weight: "",
  color: "",
  vaccinationDate: "",
  vaccinationCertUrl: "",
}

export function PetRegistration() {
  const [pets, setPets] = useState<Pet[]>([])
  const [policy, setPolicy] = useState<PetPolicy | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getTenantPets()
      .then((res: any) => {
        setPets(res?.data?.pets ?? res?.pets ?? [])
        setPolicy(res?.data?.policy ?? res?.policy ?? null)
      })
      .catch(() => setError("Failed to load pets."))
      .finally(() => setLoading(false))
  }, [])

  const openAdd = () => {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const openEdit = (pet: Pet) => {
    setEditingId(pet.id)
    setForm({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      weight: String(pet.weight),
      color: pet.color,
      vaccinationDate: pet.vaccinationDate ?? "",
      vaccinationCertUrl: pet.vaccinationCertUrl ?? "",
    })
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.breed.trim()) return
    setSaving(true)
    setError(null)
    const payload = { ...form, weight: parseFloat(form.weight) || 0 }
    try {
      if (editingId) {
        const res: any = await updatePet(editingId, payload)
        const updated = res?.data?.pet ?? res?.pet
        if (updated) setPets((p) => p.map((x) => (x.id === editingId ? updated : x)))
      } else {
        const res: any = await addPet(payload)
        const created = res?.data?.pet ?? res?.pet
        if (created) setPets((p) => [...p, created])
      }
      setShowForm(false)
    } catch {
      setError("Failed to save pet.")
    } finally {
      setSaving(false)
    }
  }

  const vacBadge = (status: Pet["vaccinationStatus"]) => {
    if (status === "current") return <span className="text-xs bg-green-500/10 dark:bg-green-500/15 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">Vaccinations Current</span>
    if (status === "expired") return <span className="text-xs bg-red-500/10 dark:bg-red-500/15 text-red-700 dark:text-red-400 px-2 py-0.5 rounded-full">Vaccinations Expired</span>
    return <span className="text-xs bg-muted text-gray-600 px-2 py-0.5 rounded-full">Status Unknown</span>
  }

  if (loading) return <div className="bg-card border rounded-lg p-6 text-center text-sm text-gray-500">Loading pets...</div>

  return (
    <div className="bg-card border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Pet Registration</h2>
        <button onClick={openAdd} className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition">
          + Add Pet
        </button>
      </div>

      {policy && (
        <div className="bg-blue-500/10 dark:bg-blue-500/15 border border-blue-200 dark:border-blue-500/30 rounded-lg px-4 py-3 text-sm text-blue-800 dark:text-blue-300 flex gap-6">
          <span><span className="font-medium">Pet Deposit:</span> ${policy.petDeposit}</span>
          <span><span className="font-medium">Monthly Pet Rent:</span> ${policy.monthlyPetRent}/mo</span>
          <span><span className="font-medium">Max Pets:</span> {policy.maxPets}</span>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {pets.length === 0 && !showForm && (
        <p className="text-center text-gray-500 py-6 text-sm">No pets registered. Add your first pet above.</p>
      )}

      <div className="space-y-3">
        {pets.map((pet) => (
          <div key={pet.id} className="flex items-start gap-4 bg-muted rounded-lg p-3">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl flex-shrink-0">
              {pet.species === "cat" ? "🐱" : pet.species === "dog" ? "🐶" : "🐾"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-medium text-gray-900">{pet.name}</p>
                {vacBadge(pet.vaccinationStatus)}
              </div>
              <p className="text-sm text-gray-600 capitalize">{pet.species} · {pet.breed} · {pet.weight} lbs · {pet.color}</p>
              {pet.vaccinationDate && <p className="text-xs text-gray-500 mt-0.5">Vaccinated: {pet.vaccinationDate}</p>}
            </div>
            <button onClick={() => openEdit(pet)} className="text-xs text-blue-600 hover:underline flex-shrink-0">Edit</button>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="border border-gray-200 rounded-lg p-4 space-y-3 bg-muted">
          <h3 className="text-sm font-semibold text-gray-800">{editingId ? "Edit Pet" : "Add Pet"}</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600 block mb-1">Pet Name *</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Species *</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm" value={form.species} onChange={(e) => setForm((f) => ({ ...f, species: e.target.value as Pet["species"] }))}>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Breed *</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.breed} onChange={(e) => setForm((f) => ({ ...f, breed: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Weight (lbs)</label>
              <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.weight} onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Color</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.color} onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Vaccination Date</label>
              <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.vaccinationDate} onChange={(e) => setForm((f) => ({ ...f, vaccinationDate: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-600 block mb-1">Vaccination Certificate URL</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="https://..." value={form.vaccinationCertUrl} onChange={(e) => setForm((f) => ({ ...f, vaccinationCertUrl: e.target.value }))} />
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition">
              {saving ? "Saving..." : "Save Pet"}
            </button>
            <button onClick={() => setShowForm(false)} className="text-sm px-4 py-2 rounded-lg border hover:bg-muted transition">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
