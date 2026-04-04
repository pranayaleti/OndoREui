import { networkFirstGet, postJson, putJson, deleteJson } from "./http"

// ── Tenant Profile ────────────────────────────────────────────────────────────

export async function getTenantProfile() {
  return networkFirstGet("/tenant/profile", "tenant-profile")
}

export async function updateTenantProfile(data: Record<string, unknown>) {
  return putJson("/tenant/profile", data)
}

// ── Amenity Booking ──────────────────────────────────────────────────────────

export async function getPropertyAmenities(propertyId: string) {
  return networkFirstGet(`/properties/${propertyId}/amenities`, `amenities-${propertyId}`)
}

export async function getTenantBookings() {
  return networkFirstGet("/tenant/bookings", "tenant-bookings")
}

export async function createBooking(amenityId: string, date: string, startTime: string, endTime: string) {
  return postJson(`/amenities/${amenityId}/bookings`, {
    bookingDate: date,
    startTime,
    endTime,
  })
}

export async function cancelBooking(bookingId: string) {
  return postJson(`/bookings/${bookingId}/cancel`, {})
}

// ── Announcements ────────────────────────────────────────────────────────────

export async function getAnnouncements(propertyId: string) {
  return networkFirstGet(`/properties/${propertyId}/announcements`, `announcements-${propertyId}`)
}

export async function markAnnouncementRead(announcementId: string) {
  return postJson(`/announcements/${announcementId}/read`, {})
}

// ── Payment Receipts ─────────────────────────────────────────────────────────

export async function getTenantReceipts() {
  return networkFirstGet("/tenant/receipts", "tenant-receipts")
}

export async function generateReceipt(paymentId: string) {
  return postJson(`/payments/${paymentId}/receipt`, {})
}

export async function getReceiptPdfUrl(receiptId: string) {
  const res = await networkFirstGet(`/receipts/${receiptId}/pdf`, `receipt-pdf-${receiptId}`)
  return (res as any)?.data?.url || (res as any)?.url
}

// ── Insurance ────────────────────────────────────────────────────────────────

export async function getTenantInsurance() {
  return networkFirstGet("/tenant/insurance", "tenant-insurance")
}

export async function addInsurance(data: Record<string, unknown>) {
  return postJson("/tenant/insurance", data)
}

export async function updateInsurance(id: string, data: Record<string, unknown>) {
  return putJson(`/insurance/${id}`, data)
}

// ── Surveys ──────────────────────────────────────────────────────────────────

export async function getSurvey(surveyId: string) {
  return networkFirstGet(`/surveys/${surveyId}`, `survey-${surveyId}`)
}

export async function submitSurveyResponse(surveyId: string, answers: Array<{ questionId: string; answer: unknown }>) {
  return postJson(`/surveys/${surveyId}/respond`, { answers })
}

// ── Referrals ────────────────────────────────────────────────────────────────

export async function createReferral(email: string) {
  return postJson("/referrals", { email })
}

export async function getReferrals() {
  return networkFirstGet("/referrals", "tenant-referrals")
}

// ── 2FA ──────────────────────────────────────────────────────────────────────

export async function get2FAStatus() {
  return networkFirstGet("/auth/2fa/status", "2fa-status")
}

export async function setup2FA() {
  return postJson("/auth/2fa/setup", {})
}

export async function verify2FA(code: string) {
  return postJson("/auth/2fa/verify", { code })
}

export async function disable2FA() {
  return deleteJson("/auth/2fa")
}

// ── Checklists ────────────────────────────────────────────────────────────────
export async function getTenantChecklists(propertyId: string) {
  return networkFirstGet(`/properties/${propertyId}/checklists`, `checklists-${propertyId}`)
}
export async function getChecklist(id: string) {
  return networkFirstGet(`/checklists/${id}`, `checklist-${id}`)
}
export async function updateChecklistItem(itemId: string, data: Record<string, unknown>) {
  return putJson(`/checklist-items/${itemId}`, data)
}

// ── Maintenance Chat ─────────────────────────────────────────────────────────
export async function getMaintenanceMessages(requestId: string) {
  return networkFirstGet(`/maintenance/${requestId}/messages`, `maint-chat-${requestId}`)
}
export async function sendMaintenanceMessage(requestId: string, data: Record<string, unknown>) {
  return postJson(`/maintenance/${requestId}/messages`, data)
}

// ── Packages ─────────────────────────────────────────────────────────────────
export async function getTenantPackages() {
  return networkFirstGet("/tenant/packages", "tenant-packages")
}
export async function markPackagePickedUp(packageId: string) {
  return postJson(`/packages/${packageId}/pickup`, {})
}

// ── Complaints ───────────────────────────────────────────────────────────────
export async function submitComplaint(propertyId: string, data: Record<string, unknown>) {
  return postJson(`/properties/${propertyId}/complaints`, data)
}

// ── Rewards ───────────────────────────────────────────────────────────────────
export async function getTenantRewards(propertyId?: string) {
  const path = propertyId ? `/tenant/rewards?propertyId=${propertyId}` : "/tenant/rewards"
  return networkFirstGet(path, `tenant-rewards-${propertyId || "all"}`)
}
export async function getRewardHistory(propertyId?: string) {
  const path = propertyId ? `/tenant/rewards/history?propertyId=${propertyId}` : "/tenant/rewards/history"
  return networkFirstGet(path, `reward-history-${propertyId || "all"}`)
}
export async function redeemRewardPoints(data: Record<string, unknown>) {
  return postJson("/tenant/rewards/redeem", data)
}

// ── Community Events ──────────────────────────────────────────────────────────
export async function getTenantEvents() {
  return networkFirstGet("/tenant/events", "tenant-events")
}
export async function rsvpEvent(eventId: string, data: Record<string, unknown>) {
  return postJson(`/events/${eventId}/rsvp`, data)
}

// ── Lease Renewal ─────────────────────────────────────────────────────────────
export async function getTenantLeaseRenewals(propertyId: string) {
  return networkFirstGet(`/properties/${propertyId}/lease-renewals`, `lease-renewals-${propertyId}`)
}
export async function respondToLeaseRenewal(renewalId: string, accept: boolean) {
  return postJson(`/lease-renewals/${renewalId}/respond`, { accept })
}

// ── Move-Out ──────────────────────────────────────────────────────────────────
export async function getTenantMoveOut() {
  return networkFirstGet("/tenant/move-out", "tenant-move-out")
}
export async function submitMoveOut(data: Record<string, unknown>) {
  return postJson("/move-out", data)
}
export async function cancelMoveOut(id: string) {
  return postJson(`/move-outs/${id}/cancel`, {})
}
export async function getMoveOutResources() {
  return networkFirstGet("/move-out-resources", "move-out-resources")
}

// ── SMS Preferences ───────────────────────────────────────────────────────────
export async function getSmsPreferences() {
  return networkFirstGet("/sms/preferences", "sms-prefs")
}
export async function updateSmsPreferences(data: Record<string, unknown>) {
  return putJson("/sms/preferences", data)
}
export async function requestSmsVerification(phoneNumber: string) {
  return postJson("/sms/verify-request", { phoneNumber })
}
export async function verifySmsCode(code: string) {
  return postJson("/sms/verify", { code })
}

// ── Credit Reporting ───────────────────────────────────────────────────────────
export async function getCreditReportingStatus() {
  return networkFirstGet("/tenant/credit-reporting/status", "credit-reporting-status")
}
export async function enrollCreditReporting(data: Record<string, unknown>) {
  return postJson("/tenant/credit-reporting/enroll", data)
}

// ── Pet Registration ──────────────────────────────────────────────────────────
export async function getTenantPets() {
  return networkFirstGet("/tenant/pets", "tenant-pets")
}
export async function addPet(data: Record<string, unknown>) {
  return postJson("/tenant/pets", data)
}
export async function updatePet(petId: string, data: Record<string, unknown>) {
  return putJson(`/tenant/pets/${petId}`, data)
}

// ── Financial Wellness ────────────────────────────────────────────────────────
export async function getFinancialWellness() {
  return networkFirstGet("/tenant/financial-wellness", "financial-wellness")
}
export async function getPaymentScore() {
  return networkFirstGet("/tenant/financial-wellness/payment-score", "payment-score")
}
export async function updateSavingsGoal(data: Record<string, unknown>) {
  return putJson("/tenant/financial-wellness/savings-goals", data)
}

// ── CAM Charges ───────────────────────────────────────────────────────────────
export async function getTenantCamCharges() {
  return networkFirstGet("/tenant/cam-charges", "cam-charges")
}

// ── Tenant Self-Inspection ────────────────────────────────────────────────────
export async function createSelfInspection(data: Record<string, unknown>) {
  return postJson("/tenant/inspections", data)
}
export async function getSelfInspections() {
  return networkFirstGet("/tenant/inspections", "self-inspections")
}
export async function getSelfInspection(id: string) {
  return networkFirstGet(`/tenant/inspections/${id}`, `inspection-${id}`)
}
export async function addInspectionRoom(inspectionId: string, data: Record<string, unknown>) {
  return postJson(`/tenant/inspections/${inspectionId}/rooms`, data)
}
export async function submitSelfInspection(inspectionId: string) {
  return postJson(`/tenant/inspections/${inspectionId}/submit`, {})
}

// ── Tenant Add-ons ─────────────────────────────────────────────────────────────
export async function getAvailableAddons() {
  return networkFirstGet("/tenant-addons/available", "available-addons")
}

export async function getMyAddons() {
  return networkFirstGet("/tenant-addons", "my-addons")
}

export async function subscribeAddon(data: Record<string, unknown>) {
  return postJson("/tenant-addons", data)
}

export async function cancelAddon(addonId: string) {
  return deleteJson(`/tenant-addons/${addonId}`)
}

// ── Calendar Events ─────────────────────────────────────────────────────────────
export async function getCalendarEvents(startDate: string, endDate: string) {
  return networkFirstGet(`/calendar?startDate=${startDate}&endDate=${endDate}`, `calendar-${startDate}`)
}

export async function getUpcomingEvents(days?: number) {
  return networkFirstGet(`/calendar/upcoming${days ? `?days=${days}` : ''}`, 'upcoming-events')
}
