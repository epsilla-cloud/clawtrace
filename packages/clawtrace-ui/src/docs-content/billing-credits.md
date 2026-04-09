# Billing and Credits

ClawTrace uses a consumption-based billing model. You purchase credits, and they are consumed as you use the platform's features — storage, queries, and Tracy agent interactions.


![Billing Credit System](/docs/images/3.1-billing-credit-system.png)

## Credit Balance

Your current credit balance is always visible in the left sidebar and at the top of the Billing page. Credits are displayed with a coin icon and automatically formatted with thousands separators.

## Credit Packages

Purchase credits in predefined packages. Higher-tier packages offer better value:

| Package | Price | Credits | Savings |
|---------|-------|---------|---------|
| **Starter** | $10 | 1,000 | — |
| **Growth** | $50 | 5,000 | — |
| **Pro** | $90 | 10,000 | 10% off |
| **Scale** | $400 | 50,000 | Best value |

All credit packages expire 1 year from the date of purchase.


## How Credits Are Consumed

Credits are deducted based on your usage across these categories:

| Category | Rate | Description |
|----------|------|-------------|
| **Storage** | 1.35 credits/MB/day | Raw trace data stored in the data lake |
| **List Trajectories** | 0.5 credits/query | Loading the trajectory dashboard |
| **Trajectory Detail** | 0.2 credits/query | Drilling into a specific trajectory |
| **Tracy Agent Input** | 0.5 credits/1k tokens | Tokens sent to the Tracy chat assistant |
| **Tracy Agent Output** | 2.5 credits/1k tokens | Tokens received from Tracy |

## Credit History

The table at the bottom of the Billing page shows your complete credit history:

- **Type** — Sign Up, Purchase, Referral Reward, Invited Bonus, or Admin Grant
- **Credit Balance** — Remaining vs. original credits in each entry
- **Granted At / Expires At** — When credits were added and when they expire
- **Status** — Active, Expired, or Exhausted
- **Amount Paid / Invoice** — For purchased credits, shows the dollar amount and a downloadable invoice

## Free Credits

New users receive **100 free credits** on sign-up. If you sign up through a referral link, both you and the referrer each receive an additional **200 credits**.

## Deficit State

If your credit balance reaches zero, you enter a **deficit state**. A modal will prompt you to top up credits. During deficit, trace ingestion and queries are blocked until credits are replenished.
