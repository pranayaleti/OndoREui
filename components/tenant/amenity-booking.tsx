"use client"

import { useState } from "react"

interface Amenity {
  id: string
  name: string
  description: string | null
  maxDurationHours: number
  advanceBookingDays: number
  rules: string | null
}

interface Booking {
  id: string
  amenityId: string
  bookingDate: string
  startTime: string
  endTime: string
  status: string
  propertyAmenities?: { name: string }
}

interface AmenityBookingProps {
  amenities: Amenity[]
  bookings: Booking[]
  onBook: (amenityId: string, date: string, startTime: string, endTime: string) => Promise<void>
  onCancel: (bookingId: string) => Promise<void>
}

export function AmenityBooking({ amenities, bookings, onBook, onCancel }: AmenityBookingProps) {
  const [selectedAmenity, setSelectedAmenity] = useState<string>("")
  const [bookingDate, setBookingDate] = useState("")
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("10:00")
  const [booking, setBooking] = useState(false)
  const [error, setError] = useState("")

  const handleBook = async () => {
    if (!selectedAmenity || !bookingDate) return
    setBooking(true)
    setError("")
    try {
      await onBook(selectedAmenity, bookingDate, startTime, endTime)
      setSelectedAmenity("")
      setBookingDate("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to book")
    } finally {
      setBooking(false)
    }
  }

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"

  return (
    <div className="space-y-6">
      {/* My Bookings */}
      {bookings.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">My Bookings</h3>
          <div className="space-y-2">
            {bookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between bg-muted rounded-lg p-3">
                <div>
                  <p className="font-medium text-sm">{b.propertyAmenities?.name || "Amenity"}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(b.bookingDate).toLocaleDateString()} — {b.startTime.slice(0, 5)} to {b.endTime.slice(0, 5)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${b.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-muted text-gray-500"}`}>
                    {b.status}
                  </span>
                  {b.status === "confirmed" && (
                    <button onClick={() => onCancel(b.id)} className="text-xs text-red-500 hover:text-red-700">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Book Amenity */}
      {amenities.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Book an Amenity</h3>
          <div className="bg-card border rounded-lg p-4 space-y-4">
            <div>
              <label htmlFor="amenity-select" className="block text-sm font-medium text-gray-700 mb-1">Amenity</label>
              <select id="amenity-select" className={inputClass} value={selectedAmenity} onChange={(e) => setSelectedAmenity(e.target.value)}>
                <option value="">Select amenity...</option>
                {amenities.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>

            {selectedAmenity && (
              <>
                {amenities.find((a) => a.id === selectedAmenity)?.description && (
                  <p className="text-sm text-gray-600">{amenities.find((a) => a.id === selectedAmenity)?.description}</p>
                )}
                {amenities.find((a) => a.id === selectedAmenity)?.rules && (
                  <p className="text-xs text-gray-500 bg-amber-50 p-2 rounded">Rules: {amenities.find((a) => a.id === selectedAmenity)?.rules}</p>
                )}
              </>
            )}

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="amenity-date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input id="amenity-date" className={inputClass} type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} />
              </div>
              <div>
                <label htmlFor="amenity-start" className="block text-sm font-medium text-gray-700 mb-1">Start</label>
                <input id="amenity-start" className={inputClass} type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </div>
              <div>
                <label htmlFor="amenity-end" className="block text-sm font-medium text-gray-700 mb-1">End</label>
                <input id="amenity-end" className={inputClass} type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              onClick={handleBook}
              disabled={booking || !selectedAmenity || !bookingDate}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {booking ? "Booking..." : "Book Now"}
            </button>
          </div>
        </div>
      )}

      {amenities.length === 0 && bookings.length === 0 && (
        <p className="text-center text-gray-500 py-8">No amenities available for booking</p>
      )}
    </div>
  )
}
