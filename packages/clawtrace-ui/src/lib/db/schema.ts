import { pgTable, text, boolean, integer, timestamp, uuid, uniqueIndex } from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    provider: text('provider').notNull(), // 'google' | 'github'
    provider_id: text('provider_id').notNull(),
    email: text('email'),
    name: text('name').notNull(),
    avatar: text('avatar').notNull().default(''),
    stripe_customer_id: text('stripe_customer_id'),
    card_verified: boolean('card_verified').notNull().default(false),
    tier: text('tier').notNull().default('free'), // 'free' | 'starter' | 'pro'
    plan_selected: boolean('plan_selected').notNull().default(false),
    invite_code: text('invite_code').unique(),
    referred_by: uuid('referred_by'),
    points_balance: integer('points_balance').notNull().default(0),
    banned: boolean('banned').notNull().default(false),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
  },
  (t) => [uniqueIndex('users_provider_provider_id_idx').on(t.provider, t.provider_id)]
);

export const referrals = pgTable('referrals', {
  id: uuid('id').primaryKey().defaultRandom(),
  referrer_id: uuid('referrer_id')
    .notNull()
    .references(() => users.id),
  referred_id: uuid('referred_id')
    .notNull()
    .unique()
    .references(() => users.id),
  referrer_points_awarded: integer('referrer_points_awarded').notNull().default(0),
  referred_points_awarded: integer('referred_points_awarded').notNull().default(0),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

export const point_transactions = pgTable('point_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id')
    .notNull()
    .references(() => users.id),
  amount: integer('amount').notNull(),
  balance_after: integer('balance_after').notNull(),
  type: text('type').notNull(), // 'referral_bonus' | 'referred_bonus' | 'signup_bonus' | 'redemption' | 'admin_adjustment'
  description: text('description'),
  reference_id: text('reference_id'),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

export const point_redemptions = pgTable('point_redemptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id')
    .notNull()
    .references(() => users.id),
  points_spent: integer('points_spent').notNull(),
  reward_type: text('reward_type').notNull(), // 'free_month' | 'permanent_access'
  reward_detail: text('reward_detail'),
  status: text('status').notNull().default('completed'), // 'completed' | 'reversed'
  created_at: timestamp('created_at').notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type Referral = typeof referrals.$inferSelect;
export type PointTransaction = typeof point_transactions.$inferSelect;
export type PointRedemption = typeof point_redemptions.$inferSelect;
