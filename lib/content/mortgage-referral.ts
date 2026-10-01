import { SITE_NAME } from "@/lib/site"

/**
 * Shared wording for pages that send homeowners to their mortgage servicer. Ondo does not
 * service loans, so these pages never promise payoffs, lien releases, forbearance or
 * modifications. Counsel reviews this wording before deploy.
 */
export const NOT_A_SERVICER = `${SITE_NAME} does not service mortgage loans. We cannot issue payoff statements, release liens, or grant forbearance, deferrals or loan modifications.`

export const FIND_YOUR_SERVICER =
  "Your servicer is the company you send your mortgage payment to. Its name and phone number are on your monthly statement."

/** HUD housing counseling line, free and open to any homeowner. */
export const HUD_COUNSELING_PHONE = "1-800-569-4287"
