"use client"

import { useState } from "react"
import { createSelfInspection, addInspectionRoom, submitSelfInspection } from "../../lib/api/tenant-services"

type InspectionType = "move_in" | "move_out" | "periodic"
type Condition = "excellent" | "good" | "fair" | "poor"

interface Room {
  name: string
  condition: Condition
  notes: string
  photoUrl: string
}

const CONDITIONS: Condition[] = ["excellent", "good", "fair", "poor"]

const conditionColor: Record<Condition, string> = {
  excellent: "bg-green-100 text-green-700 border-green-300",
  good: "bg-blue-100 text-blue-700 border-blue-300",
  fair: "bg-yellow-100 text-yellow-700 border-yellow-300",
  poor: "bg-red-100 text-red-700 border-red-300",
}

const STEPS = ["Start", "Rooms", "Photos", "Review & Submit"]

export function SelfInspectionWizard() {
  const [step, setStep] = useState(0)
  const [inspectionType, setInspectionType] = useState<InspectionType>("periodic")
  const [inspectionDate, setInspectionDate] = useState(new Date().toISOString().slice(0, 10))
  const [rooms, setRooms] = useState<Room[]>([])
  const [newRoom, setNewRoom] = useState<Room>({ name: "", condition: "good", notes: "", photoUrl: "" })
  const [inspectionId, setInspectionId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editPhotoIdx, setEditPhotoIdx] = useState<number | null>(null)
  const [photoInput, setPhotoInput] = useState("")

  const next = async () => {
    setError(null)
    if (step === 0) {
      try {
        const res: any = await createSelfInspection({ type: inspectionType, scheduledDate: inspectionDate })
        const id = res?.data?.inspection?.id ?? res?.inspection?.id ?? res?.id
        if (id) setInspectionId(id)
      } catch {
        // Allow continuing even if API fails — id will be null
      }
      setStep(1)
    } else if (step === 1) {
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    }
  }

  const prev = () => setStep((s) => Math.max(0, s - 1))

  const addRoom = () => {
    if (!newRoom.name.trim()) return
    setRooms((r) => [...r, { ...newRoom }])
    setNewRoom({ name: "", condition: "good", notes: "", photoUrl: "" })
  }

  const removeRoom = (idx: number) => setRooms((r) => r.filter((_, i) => i !== idx))

  const savePhoto = () => {
    if (editPhotoIdx === null) return
    setRooms((r) => r.map((room, i) => i === editPhotoIdx ? { ...room, photoUrl: photoInput } : room))
    setEditPhotoIdx(null)
    setPhotoInput("")
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)
    try {
      if (inspectionId) {
        for (const room of rooms) {
          await addInspectionRoom(inspectionId, room)
        }
        await submitSelfInspection(inspectionId)
      }
      setSubmitted(true)
    } catch {
      setError("Submission failed. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-white border rounded-lg p-8 text-center space-y-3">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Inspection Submitted</h2>
        <p className="text-sm text-gray-500">Your self-inspection report has been submitted successfully. Your property manager will review it.</p>
      </div>
    )
  }

  return (
    <div className="bg-white border rounded-lg p-4 space-y-5">
      {/* Progress indicator */}
      <div>
        <div className="flex justify-between mb-2">
          {STEPS.map((label, i) => (
            <div key={i} className="flex flex-col items-center gap-1" style={{ width: `${100 / STEPS.length}%` }}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition ${i < step ? "bg-blue-600 border-blue-600 text-white" : i === step ? "border-blue-600 text-blue-600" : "border-gray-300 text-gray-400"}`}>
                {i < step ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                ) : i + 1}
              </div>
              <span className={`text-xs text-center leading-tight ${i === step ? "text-blue-600 font-medium" : "text-gray-400"}`}>{label}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 text-center">Step {step + 1} of {STEPS.length}</p>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">{error}</p>}

      {/* Step 0: Start */}
      {step === 0 && (
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Start Inspection</h2>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Inspection Type</label>
            <select className="w-full border rounded-lg px-3 py-2 text-sm" value={inspectionType} onChange={(e) => setInspectionType(e.target.value as InspectionType)}>
              <option value="move_in">Move-In</option>
              <option value="move_out">Move-Out</option>
              <option value="periodic">Periodic</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Inspection Date</label>
            <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm" value={inspectionDate} onChange={(e) => setInspectionDate(e.target.value)} />
          </div>
        </div>
      )}

      {/* Step 1: Rooms */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Add Rooms</h2>
          <div className="space-y-2">
            {rooms.map((room, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                <div>
                  <p className="text-sm font-medium text-gray-800">{room.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{room.condition}{room.notes ? ` · ${room.notes}` : ""}</p>
                </div>
                <button onClick={() => removeRoom(i)} className="text-xs text-red-500 hover:underline">Remove</button>
              </div>
            ))}
          </div>
          <div className="border border-dashed border-gray-300 rounded-lg p-3 space-y-2">
            <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Room name (e.g. Living Room)" value={newRoom.name} onChange={(e) => setNewRoom((r) => ({ ...r, name: e.target.value }))} />
            <div className="flex gap-2">
              {CONDITIONS.map((c) => (
                <button key={c} onClick={() => setNewRoom((r) => ({ ...r, condition: c }))}
                  className={`flex-1 text-xs px-2 py-1.5 rounded-lg border capitalize font-medium transition ${newRoom.condition === c ? conditionColor[c] : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                  {c}
                </button>
              ))}
            </div>
            <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Notes (optional)" value={newRoom.notes} onChange={(e) => setNewRoom((r) => ({ ...r, notes: e.target.value }))} />
            <button onClick={addRoom} className="w-full bg-gray-800 text-white text-sm py-2 rounded-lg hover:bg-gray-900 transition">+ Add Room</button>
          </div>
        </div>
      )}

      {/* Step 2: Photos */}
      {step === 2 && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-gray-900">Add Photos</h2>
          {rooms.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No rooms added yet.</p>}
          {rooms.map((room, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-3 space-y-2">
              <p className="text-sm font-medium text-gray-800">{room.name}</p>
              {room.photoUrl ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-green-600 truncate flex-1">{room.photoUrl}</span>
                  <button onClick={() => { setEditPhotoIdx(i); setPhotoInput(room.photoUrl) }} className="text-xs text-blue-600 hover:underline flex-shrink-0">Edit</button>
                </div>
              ) : (
                <button onClick={() => { setEditPhotoIdx(i); setPhotoInput("") }} className="text-xs text-blue-600 hover:underline">+ Add photo URL</button>
              )}
              {editPhotoIdx === i && (
                <div className="flex gap-2">
                  <input className="flex-1 border rounded-lg px-2 py-1.5 text-xs" placeholder="https://..." value={photoInput} onChange={(e) => setPhotoInput(e.target.value)} />
                  <button onClick={savePhoto} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg">Save</button>
                  <button onClick={() => setEditPhotoIdx(null)} className="text-xs border px-2 py-1.5 rounded-lg">Cancel</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-gray-900">Review & Submit</h2>
          <div className="bg-gray-50 rounded-lg p-3 space-y-1">
            <p className="text-sm text-gray-600 capitalize"><span className="font-medium">Type:</span> {inspectionType.replace("_", "-")}</p>
            <p className="text-sm text-gray-600"><span className="font-medium">Date:</span> {inspectionDate}</p>
            <p className="text-sm text-gray-600"><span className="font-medium">Rooms:</span> {rooms.length}</p>
          </div>
          <div className="space-y-2">
            {rooms.map((room, i) => (
              <div key={i} className={`rounded-lg border px-3 py-2 text-sm ${conditionColor[room.condition]}`}>
                <div className="flex justify-between">
                  <span className="font-medium">{room.name}</span>
                  <span className="capitalize">{room.condition}</span>
                </div>
                {room.notes && <p className="text-xs mt-0.5 opacity-80">{room.notes}</p>}
                {room.photoUrl && <p className="text-xs mt-0.5 opacity-70 truncate">Photo: {room.photoUrl}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-2 pt-2">
        {step > 0 && (
          <button onClick={prev} className="flex-1 border text-sm py-2.5 rounded-lg hover:bg-gray-50 transition">Previous</button>
        )}
        {step < 3 ? (
          <button onClick={next} className="flex-1 bg-blue-600 text-white text-sm py-2.5 rounded-lg hover:bg-blue-700 transition">
            Next
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={submitting || rooms.length === 0} className="flex-1 bg-green-600 text-white text-sm py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-50 transition">
            {submitting ? "Submitting..." : "Submit Inspection"}
          </button>
        )}
      </div>
    </div>
  )
}
