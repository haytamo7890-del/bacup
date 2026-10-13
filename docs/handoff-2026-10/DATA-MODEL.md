# Data model

Suggested relational model. Names are indicative; types are PostgreSQL-ish. All money in **DH, integer** (no decimals needed).

## users
| field | type | notes |
|---|---|---|
| id | uuid | |
| email | text unique | from Google / Apple / email login |
| auth_provider | enum `google` `apple` `email` | |
| role | enum `student` `ambassador` `admin` | a person can be both student and ambassador (use flags or a join table if needed) |
| created_at | timestamptz | |

## student_profiles (the "Carte élève")
| field | type | notes |
|---|---|---|
| user_id | uuid PK → users | |
| pseudo | text ≤ 18 | changeable later |
| avatar_key | text null | one of `laureat couronne flamme fusee eclair bouclier diamant etoile` (see `assets/icons/avatars.json`) |
| photo_url | text null | cropped 320×320 JPEG; takes priority over avatar_key |
| level | enum `1bac` `2bac` | |
| stream | text | 1bac: `Sciences Ex`, `Sciences Maths` · 2bac: `PC`, `SVT`, `SM A`, `SM B` |
| average_now | numeric(3,1) | 6–19 |
| goal | text | 1bac: `12 et +` `14 et +` `16 et +` `18 et +` (régional) · 2bac: `Passable` `Assez bien` `Bien` `Très bien` |
| dream_school | text null | 2bac only: `Médecine` `ENSA · ENSAM` `CPGE` `ENCG` `ISCAE` `ENA` `Pas encore décidé` |
| member_number | int unique | shown as `BU · 2027 · 01003` |
| plan | enum `free` `full` | |
| founder | bool | true if bought during the founder phase |
| access_until | date null | |
| referred_by_code | text null → promo_codes | first code used |

### Client-side storage (already implemented)
`localStorage["bacup.card"]` (landing + onboarding, same domain):
```json
{"name":"Haytam","av":"fusee","photo":"data:image/jpeg;base64,…","niveau":"2bac","filiere":"SM A","mention":"Bien","ecole":"Médecine"}
```
Use it to pre-fill the profile at sign-up, then make the server the source of truth.

## orders
| field | type | notes |
|---|---|---|
| id | uuid | public ref like `BU-NHHK4E` for COD |
| user_id | uuid | |
| method | enum `card` `cod` | |
| price | int | 250 |
| discount | int | 0 or 20 |
| delivery_fee | int | 0 or 19 (COD) |
| total | int | price − discount + delivery_fee |
| promo_code | text null | |
| status | enum `pending_payment` `paid` `cod_to_confirm` `cod_confirmed` `shipped` `delivered_paid` `delivery_refused` `refunded` `cancelled` | |
| phone, city, address | text | COD only |
| cmi_transaction_id | text null | card only |
| paid_at, cash_received_at | timestamptz null | `cash_received_at` is what makes a COD sale count for the ambassador |

## activation_cards
| field | type | notes |
|---|---|---|
| code | text unique | scratch code on the physical card, e.g. `BU-7K2M-94QX` |
| order_id | uuid null | |
| redeemed_by | uuid null → users | |
| redeemed_at | timestamptz null | |

## ambassadors
| field | type | notes |
|---|---|---|
| user_id | uuid PK | |
| pseudo, avatar_key, photo_url | | same as student card |
| code | text unique | without the `BAC-` prefix, e.g. `HAYTAM` |
| city | text | |
| profile | text | `Lycéen(ne)` … `Autre` |
| audience | text | `< 1K` `1K – 10K` `10K – 100K` `100K – 1M` `> 1M` |
| channels | text[] | `TikTok Instagram WhatsApp Snapchat YouTube En classe` |
| age_group | enum `minor` `adult` | |
| charter_accepted_at | timestamptz | |
| status | enum `pending_review` `active` `suspended` `blocked` | |
| level | computed | from validated sales count |
| payout_holder, payout_bank, payout_cin, payout_rib | text | RIB = 24 digits; encrypt at rest |
| parent_phone, parent_consent_at | | minors only |

## promo_codes
Ambassador codes and any other promo. `code`, `type` (`ambassador` `promo`), `ambassador_id` null, `discount` (20), `active`, `max_uses` null.

## referral_sales
One row per order that used an ambassador code.
| field | type | notes |
|---|---|---|
| id | uuid | |
| ambassador_id | uuid | |
| order_id | uuid | |
| share | int | 30 |
| source | text null | `src` param of the link |
| via | enum `code` `link` | |
| status | enum `in_delivery` `pending` `validated` `paid` `refunded` `delivery_refused` `excluded_fraud` | |
| counted_at | timestamptz | card: paid_at · COD: cash_received_at |
| validated_at, paid_out_id | | |

## ambassador_bonuses
`ambassador_id`, `type` (`level_or` `level_platinum` `level_50` `race_1` `race_2` `race_3`), `amount`, `month` (for race), `status` (`pending` `paid`).

## payouts
`id`, `ambassador_id`, `amount`, `period`, `status` (`scheduled` `sent` `failed`), `sent_at`, `rib_last4`.

## link_clicks
`ambassador_code`, `src`, `visited_at`, `session_id`, `signed_up_user_id` null. Feeds "clics", "inscriptions" and the funnel in the dashboard.

## missions / badges
`missions` (static list: first story, first sale, 5 sales, 10 sales → Or) and `ambassador_missions` (`ambassador_id`, `mission_key`, `done_at`).

## monthly_race (view or materialised table)
`month`, `ambassador_id`, `validated_sales`, `rank_national`, `rank_city`.
