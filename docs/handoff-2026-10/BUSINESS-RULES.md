# Business rules

Items marked **(to confirm)** are assumptions used in the prototypes. See OPEN-QUESTIONS.md.

## Plans and price

| Plan | Price | Notes |
|---|---|---|
| Gratuit | 0 DH | Level test each month, part of the content. Created by "Continuer avec le compte gratuit" or any COD order (free account until activation). |
| Accès complet (Membre Fondateur) | **250 DH** one-time, shown with ~~450 DH~~ | Access duration "1 an" **(to confirm)**. No subscription. |
| Founder bonus | Concours Pass free for founders | Unlocks June 2027, covers all post-BAC exams (Médecine, ENSA, ENSAM, ENCG, ISCAE, ENA…) **(scope to confirm)**. |

- "X % des places Fondateur prises" is a number the team sets (`founder`, currently 80). It is not computed.
- After the founder phase the price becomes 450 DH.
- Rule on social posts: never show the full price in posts (the "−20 DH" with a code is allowed).

## Discount and delivery

- Ambassador / promo code: **−20 DH** on the 250 DH (student pays 230 DH by card).
- Cash on delivery (COD): **+19 DH delivery fee**, separate line. Example with a code: 250 − 20 + 19 = **249 DH**.
- COD flow: order → Bac Up calls to confirm (same day) → activation card delivered in 24–48 h anywhere in Morocco **(to confirm)** → student pays cash → scratches the card and enters the code → full access. The free account is open in the meantime.
- Card payment: CMI (Visa, Mastercard, local cards) → instant access.

## Ambassadors

### Earnings
- **30 DH per sale** (per full access bought with their code or link).
- The share is on the access only: the **delivery fee never counts**.
- A sale counts:
  - card payment: at payment;
  - COD: **only when Bac Up has received the cash** (average delay `codDays` = 7 days **(to confirm)**).
- A sale is **validated** after `validDays` = 14 days (refund window) **(to confirm)**, then it is paid with the next transfer.

### Levels (one-time bonuses, cumulative)
| Level | From | Bonus |
|---|---|---|
| Argent | sign-up | — |
| Or | 10 validated sales | +50 DH |
| Élite Platinum | 25 sales | +150 DH |
| Élite Platinum (extra) | 50 sales | +400 DH |

Example: 30 sales = 30 × 30 + 50 + 150 = 1 100 DH.

### Monthly race
- National Top 3 of the calendar month (validated sales): **1 000 / 500 / 250 DH**, on top of the per-sale earnings.
- Resets on the 1st of each month.
- Tie-break rule **(to define)**: suggestion = first to reach the number.
- City leaderboards are shown for motivation (no prize).

### Payouts
- Bank transfer to a Moroccan RIB (24 digits), monthly on day `payDay` = 5 **(to confirm)**, minimum `minPayout` = 200 DH **(to confirm)**; below the minimum the balance rolls over.
- Minors (< 18): payout goes to the parent/guardian's account; parent phone + explicit consent required before the first payout.
- Collected for payouts: account holder name, bank, CIN number, RIB.

### Code
- Format `BAC-` + 4 to 12 characters A–Z / 0–9, unique, uppercase, accents removed. Reserved words list (BACUP, ADMIN…).
- The share link is `bacup.ma/?ref=CODE` (+ optional `&src=`).
- Codes are activated after a quick manual review (account status `pending_review` → `active`).

### Charter (shown at sign-up, enforced by the backend)
1. **No self-purchase**: no sale with the ambassador's own code, phone number, delivery address or bank card. Flag and exclude.
2. **No paid ads with the Bac Up name** and no account impersonating Bac Up. Posts, stories, groups, in class only.
3. **A refund cancels the share** (claw-back from the balance); **fraud blocks the account**.
4. Always disclose being an ambassador (the content studio adds it automatically).
5. Don'ts listed in the dashboard guide: promising a grade, spamming, coupon sites, filming people without consent.

## Student card

- Member number shown as `BU · 2027 · 01003` (`member` config, padded to 5 digits). In production: the real sequential member number.
- "Carte élève" label becomes "Membre Fondateur" once paid.

## BAC countdown

- Target date is an estimate until the official calendar: **1 June 2027** in all pages (landing, ambassador kit, content studio). Update it in the 3 places listed in CONFIG.md when the Ministry publishes the date.
