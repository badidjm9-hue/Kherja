# KHERJA implementation and acceptance report

## Scope and consent
- Approved inventory: 24 reference screens in the supplied composite.
- Approved authority: screenshot purple controls take precedence over official primary blue where they conflict.
- Official primary blue #075BFF, burgundy #85003F, white #FFFFFF and background #F7F8FC remain semantic tokens.
- First-launch language follows device Arabic/French; French fallback. Local layout mirroring avoids forced app restarts.
- No demo users, fake OTP, simulated backend responses, invented fares, maps, demand or traffic.
- KHERJA-store-work-jdid has not been accessed, searched or modified.
- This milestone is a foundation, not a production-ready ecosystem.

## Design reference checklist
Source: https://cdn-ai.onspace.ai/onspace/files/CqKrMUdJpQdtydMMokfbmS/77489565-DB36-4F05-AABB-22821FF5470C.png
Coordinates are row and column in the composite, starting at 1.

| Position | Screen | Current implementation / acceptance |
| --- | --- | --- |
| 1,1 | Splash | Foundation implemented; icon approximation, generated city illustration; pixel comparison pending |
| 1,2 | Onboarding | Functional progression and skip; illustration not exact; comparison pending |
| 1,3 | Role selection | Customer/driver selection functional; vehicle icons differ; comparison pending |
| 1,4 | Login | Real phone/password request; SMS/provider testing pending; social login and reset omitted, not claimed complete |
| 1,5 | Registration | Real phone signup and SMS verification; inline OTP extension needs design approval |
| 1,6 | Customer home | Not implemented |
| 1,7 | Vehicle / fare selection | Not implemented; screenshot fares are not pricing rules |
| 1,8 | Driver search | Not implemented |
| 2,1 | Driver offers | Not implemented |
| 2,2 | Customer active trip | Not implemented |
| 2,3 | Completion / rating | Not implemented |
| 2,4 | Trip details | Not implemented |
| 2,5 | Ride history | Not implemented |
| 2,6 | Notifications | Not implemented |
| 2,7 | Trusted contacts | Not implemented |
| 2,8 | SOS | Not implemented |
| 3,1 | Report issue | Not implemented |
| 3,2 | Customer profile | Account foundation only: real name read/write and logout; reference menu absent; final approval pending |
| 3,3 | Payments / wallet | Not implemented |
| 3,4 | Driver dashboard | Not implemented |
| 3,5 | Incoming driver request | Not implemented |
| 3,6 | Driver active trip | Not implemented |
| 3,7 | Driver earnings | Not implemented |
| 3,8 | Driver profile | Not implemented |

Each screen must pass: layout, typography, colors, spacing, assets, icons, safe areas, RTL, interaction, loading/error states, and screenshot comparison. No screen has passed final visual acceptance. Individual high-resolution references and original brand/logo assets are needed for faithful reproduction. Generated art is an explicit approximation, not the approved original asset.

## Phase report
1. Design: inventory and initial tokens created; exact asset extraction, missing screens and visual acceptance incomplete.
2. Backend: account table, active pricing table, owner-scoped RLS and private storage bucket created successfully. Real phone auth wired. SMS configuration and tests incomplete.
3. Customer: onboarding and account entry foundation only.
4. Driver: requested role recorded only; no approval, documents, service activation or dispatch permissions implemented.
5. Services: unimplemented; no requests can be created or dispatched.
6. Mapping/AI: unimplemented; no traffic, demand or incidents displayed.
7. Admin/merchant: unimplemented. Web dashboard requires a separate OnSpace WEBSITE workspace sharing this backend.
8. Notifications/finance/security: private owner storage policies only; ledger, withdrawals, account deletion, notifications, audit logs and admin permissions incomplete.
9. Production acceptance: not started. No production release claim.

## Database and security
- kherja_accounts references public.user_profiles; row access uses auth.uid(). Profile role is a self-selected experience only, never an admin or verified-driver authorization.
- Active pricing rules: moto food 90 DZD/km; moto parcel 60 DZD/km. No car pricing seeded.
- Pricing is read-only to anon/authenticated; no client pricing mutations permitted.
- kherja-private: private bucket, image/PDF allowlist, 10 MB limit, authenticated owner path insert/select policies. No upload UI or reviewer access yet.
- No direct wallet balances or money mutation APIs exist.
- No service-role key is placed in client code.
- Backend services must later enforce verified documents, pricing, rate limits, dispatch, secure confirmations, commissions and immutable ledger writes.
- Phone signup may require adapting existing user_profiles synchronization for phone-only accounts because its email column is non-null. Real signup must be tested before calling authentication operational.

## External configuration and limitations
- SMS: enable phone auth and configure a supported SMS provider in OnSpace Cloud Auth. Provider credentials are not requested or embedded in the client; use server-side configuration. No valid credentials/test delivery supplied.
- Social buttons from reference are intentionally not rendered as inert controls; real Google/Apple integration is pending credentials and request approval.
- OTP validation accepts server-issued 4–8 digit codes; actual SMS OTP settings need verification.
- Maps: requested MapLibre conflicts with this workspace's mandated native react-native-maps / web react-leaflet implementation. No substitute has been silently selected. Rendering choice must be resolved before phase 6.
- Routing, geocoding, commercial tiles and reliable Algeria traffic provider remain unselected/unconfigured. Public OSM production tiles are not used.
- Backend realtime is unavailable in this environment; implement authorized polling before live tracking, with explicit latency behavior.
- Push notifications need native builds, permissions, device tokens, APNs/FCM setup and background-device testing.
- Account deletion will require a secure backend workflow preserving required financial records; SQL tool cannot delete user data.
- Local language switch changes UI immediately; persisting changed locale to the profile is not yet implemented.
- Desktop currently centers the mobile foundation; this is not an Admin Web Dashboard.

## Verification evidence
- Backend schema/storage SQL executed successfully by the platform.
- No automated tests, compiler command, screenshot harness or device runtime was available through the supplied tools.
- No Android/iOS device tests, SMS delivery tests, complete workflow tests or screenshot comparisons were executed.
- Test status: NOT RUN, not passed. Initial image generation failed; retry succeeded at assets/images/kherja-city.png.
- End-to-end operational acceptance remains blocked by SMS setup, profile trigger compatibility and all unimplemented service phases.

## Next implementation sequence
1. Configure SMS, verify phone-only profile synchronization, test signup/login/session restoration and rate limiting.
2. Supply exact logo/illustration assets and approve OTP/profile extensions plus missing reference screens.
3. Build vehicle/document lifecycle with admin authorization and approval gates before dispatch.
4. Build server-authoritative route quoting and service state machines, then wallet, tracking and notifications.
5. Build separate admin/merchant Web workspace; finish security and real-device acceptance.
