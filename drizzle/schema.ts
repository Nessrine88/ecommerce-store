import {
  pgTable,
  uniqueIndex,
  uuid,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
  json,
  foreignKey,
  primaryKey,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const product = pgTable(
  "Product",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: text().notNull(),
    slug: text().notNull(),
    category: text().notNull(),
    images: text().array(),
    brand: text(),
    description: text().notNull(),
    stock: integer().notNull(),
    price: numeric({ precision: 12, scale: 2 }).default("0").notNull(),
    rating: numeric({ precision: 3, scale: 2 }).default("0"),
    numReviews: integer().default(0),
    isFeatured: boolean().default(false).notNull(),
    banner: text(),
    createdAt: timestamp({ precision: 6, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("product_slug_idx").using(
      "btree",
      table.slug.asc().nullsLast().op("text_ops"),
    ),
  ],
);

export const user = pgTable(
  "User",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: text().default("NO_NAME").notNull(),
    email: text(),
    emailVerified: timestamp({ precision: 6, mode: "string" }),
    password: text(),
    role: text().default("user").notNull(),
    address: json(),
    paymentMethod: text(),
    createdAt: timestamp({ precision: 6, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp({ precision: 6, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("user_email_idx").using(
      "btree",
      table.email.asc().nullsLast().op("text_ops"),
    ),
  ],
);

export const sessions = pgTable(
  "sessions",
  {
    sessionToken: text().primaryKey().notNull(),
    userId: uuid().notNull(),
    expires: timestamp({ precision: 6, mode: "string" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "sessions_userId_User_id_fk",
    }).onDelete("cascade"),
  ],
);

export const order = pgTable(
  "Order",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid(),
    shippingAddress: json().notNull(),
    paymentMethod: text().notNull(),
    paymentResult: json(),
    itemsPrice: numeric({ precision: 12, scale: 2 }).notNull(),
    shippingPrice: numeric({ precision: 12, scale: 2 }).notNull(),
    taxPrice: numeric({ precision: 12, scale: 2 }).notNull(),
    totalPrice: numeric({ precision: 12, scale: 2 }).notNull(),
    isPaid: boolean().default(false).notNull(),
    paidAt: timestamp({ precision: 6, mode: "string" }),
    isDelivered: boolean().default(false).notNull(),
    deliveredAt: timestamp({ precision: 6, mode: "string" }),
    createdAt: timestamp({ precision: 6, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "Order_userId_User_id_fk",
    }).onDelete("cascade"),
  ],
);

export const review = pgTable(
  "Review",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid().notNull(),
    productId: uuid().notNull(),
    rating: integer().notNull(),
    title: text().notNull(),
    description: text().notNull(),
    isVerifiedPurchase: boolean().default(false).notNull(),
    createdAt: timestamp({ mode: "string" }).defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "Review_userId_User_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.productId],
      foreignColumns: [product.id],
      name: "Review_productId_Product_id_fk",
    }).onDelete("cascade"),
  ],
);

export const cart = pgTable("Cart", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid(),
  sessionCartId: text().notNull(),
  items: json(),
  itemsPrice: numeric({ precision: 12, scale: 2 }).notNull(),
  totalPrice: numeric({ precision: 12, scale: 2 }).notNull(),
  shippingPrice: numeric({ precision: 12, scale: 2 }).notNull(),
  taxPrice: numeric({ precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp({ precision: 6, mode: "string" }).defaultNow().notNull(),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid().notNull(),
    type: text().notNull(),
    provider: text().notNull(),
    providerAccountId: text().notNull(),
    refreshToken: text(),
    accessToken: text(),
    expiresAt: integer(),
    tokenType: text(),
    scope: text(),
    idToken: text(),
    sessionState: text(),
  },
  (table) => [
    uniqueIndex("account_provider_providerAccountId_idx").using(
      "btree",
      table.provider.asc().nullsLast().op("text_ops"),
      table.providerAccountId.asc().nullsLast().op("text_ops"),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "accounts_userId_User_id_fk",
    }).onDelete("cascade"),
  ],
);

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text().notNull(),
    token: text().notNull(),
    expires: timestamp({ mode: "string" }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.identifier, table.token],
      name: "verification_tokens_identifier_token_pk",
    }),
  ],
);

export const orderItem = pgTable(
  "OrderItem",
  {
    orderId: uuid().notNull(),
    productId: uuid().notNull(),
    qty: integer().notNull(),
    price: numeric({ precision: 12, scale: 2 }).notNull(),
    name: text().notNull(),
    slug: text().notNull(),
    image: text().notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.orderId, table.productId],
      name: "OrderItem_orderId_productId_pk",
    }),
  ],
);
