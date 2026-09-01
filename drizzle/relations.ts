import { relations } from "drizzle-orm/relations";
import { user, sessions, order, review, product, accounts } from "./schema";

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(user, {
    fields: [sessions.userId],
    references: [user.id],
  }),
}));

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(sessions),
  orders: many(order),
  reviews: many(review),
  accounts: many(accounts),
}));

export const orderRelations = relations(order, ({ one }) => ({
  user: one(user, {
    fields: [order.userId],
    references: [user.id],
  }),
}));

export const reviewRelations = relations(review, ({ one }) => ({
  user: one(user, {
    fields: [review.userId],
    references: [user.id],
  }),
  product: one(product, {
    fields: [review.productId],
    references: [product.id],
  }),
}));

export const productRelations = relations(product, ({ many }) => ({
  reviews: many(review),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(user, {
    fields: [accounts.userId],
    references: [user.id],
  }),
}));
