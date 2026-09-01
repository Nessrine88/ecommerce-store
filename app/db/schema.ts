import { relations } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  numeric,
  uniqueIndex,
  primaryKey,
  json,
} from "drizzle-orm/pg-core";
import { title } from "process";

// =====================
// Product
// =====================

export const products = pgTable(
  "Product",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: text("name").notNull(),

    slug: text("slug").notNull(),

    category: text("category").notNull(),

    images: text("images").array(),

    brand: text("brand"),

    description: text("description").notNull(),

    stock: integer("stock").notNull(),

    price: numeric("price", {
      precision: 12,
      scale: 2,
    })
      .default("0")
      .notNull(),

    rating: numeric("rating", {
      precision: 3,
      scale: 2,
    }).default("0"),
    numReviews: integer("numReviews").default(0),
    isFeatured: boolean("isFeatured").notNull().default(false),

    banner: text("banner"),

    createdAt: timestamp("createdAt", {
      precision: 6,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    slugIndex: uniqueIndex("product_slug_idx").on(table.slug),
  }),
);

// =====================
// User
// =====================

export const users = pgTable(
  "User",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: text("name").default("NO_NAME").notNull(),

    email: text("email"),

    emailVerified: timestamp("emailVerified", {
      precision: 6,
    }),

    password: text("password"),

    role: text("role").default("user").notNull(),

    address: json("address"),

    paymentMethod: text("paymentMethod"),

    createdAt: timestamp("createdAt", {
      precision: 6,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updatedAt", {
      precision: 6,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    emailIndex: uniqueIndex("user_email_idx").on(table.email),
  }),
);

// =====================
// Account (Auth.js)
// =====================

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    type: text("type").notNull(),

    provider: text("provider").notNull(),

    providerAccountId: text("providerAccountId").notNull(),

    refreshToken: text("refreshToken"),

    accessToken: text("accessToken"),

    expiresAt: integer("expiresAt"),

    tokenType: text("tokenType"),

    scope: text("scope"),

    idToken: text("idToken"),

    sessionState: text("sessionState"),
  },
  (table) => ({
    uniqueProvider: uniqueIndex("account_provider_providerAccountId_idx").on(
      table.provider,
      table.providerAccountId,
    ),
  }),
);

// =====================
// Session (Auth.js)
// =====================

export const sessions = pgTable("sessions", {
  sessionToken: text("sessionToken").primaryKey(),

  userId: uuid("userId")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),

  expires: timestamp("expires", {
    precision: 6,
  }).notNull(),
});

// =====================
// Verification Token
// =====================

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),

    token: text("token").notNull(),

    expires: timestamp("expires").notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.identifier, table.token],
    }),
  }),
);

// =====================
// Cart
// =====================

export const carts = pgTable("Cart", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("userId").references(() => users.id, {
    onDelete: "cascade",
  }),

  sessionCartId: text("sessionCartId").notNull(),

  items: json("items"),

  itemsPrice: numeric("itemsPrice", {
    precision: 12,
    scale: 2,
  }).notNull(),

  totalPrice: numeric("totalPrice", {
    precision: 12,
    scale: 2,
  }).notNull(),

  shippingPrice: numeric("shippingPrice", {
    precision: 12,
    scale: 2,
  }).notNull(),

  taxPrice: numeric("taxPrice", {
    precision: 12,
    scale: 2,
  }).notNull(),

  createdAt: timestamp("createdAt", {
    precision: 6,
  })
    .defaultNow()
    .notNull(),
});

// =====================
// Order
// =====================

export const orders = pgTable("Order", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("userId").references(() => users.id, {
    onDelete: "cascade",
  }),

  shippingAddress: json("shippingAddress").notNull(),

  paymentMethod: text("paymentMethod").notNull(),

  paymentResult: json("paymentResult"),

  itemsPrice: numeric("itemsPrice", {
    precision: 12,
    scale: 2,
  }).notNull(),

  shippingPrice: numeric("shippingPrice", {
    precision: 12,
    scale: 2,
  }).notNull(),

  taxPrice: numeric("taxPrice", {
    precision: 12,
    scale: 2,
  }).notNull(),

  totalPrice: numeric("totalPrice", {
    precision: 12,
    scale: 2,
  }).notNull(),

  isPaid: boolean("isPaid").default(false).notNull(),

  paidAt: timestamp("paidAt", {
    precision: 6,
  }),

  isDelivered: boolean("isDelivered").default(false).notNull(),

  deliveredAt: timestamp("deliveredAt", {
    precision: 6,
  }),

  createdAt: timestamp("createdAt", {
    precision: 6,
  })
    .defaultNow()
    .notNull(),
});

// =====================
// Order Items
// =====================

export const orderItems = pgTable(
  "OrderItem",
  {
    orderId: uuid("orderId").notNull(),

    productId: uuid("productId").notNull(),

    qty: integer("qty").notNull(),

    price: numeric("price", {
      precision: 12,
      scale: 2,
    }).notNull(),

    name: text("name").notNull(),

    slug: text("slug").notNull(),

    image: text("image").notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.orderId, table.productId],
    }),
  }),
);

// =====================
// Review table
// =====================

export const reviews = pgTable("Review", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  productId: uuid("productId")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),

  rating: integer("rating").notNull(),

  title: text("title").notNull(),

  description: text("description").notNull(),

  isVerifiedPurchase: boolean("isVerifiedPurchase").notNull().default(false),

  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  carts: many(carts),
  accounts: many(accounts),
  sessions: many(sessions),
  reviews: many(reviews),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),

  orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),

  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const productsRelations = relations(products, ({ many }) => ({
  orderItems: many(orderItems),
  reviews: many(reviews),
}));

export const cartsRelations = relations(carts, ({ one }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));
