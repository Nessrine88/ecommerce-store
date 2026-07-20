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


// =====================
// Product
// =====================

export const products = pgTable(
  "Product",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    name: text("name").notNull(),

    slug: text("slug").notNull(),

    category: text("category").notNull(),

    images: text("images")
      .array()
      .notNull(),

    brand: text("brand").notNull(),

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
    })
      .default("0")
      .notNull(),

    numReviews: integer("numReviews")
      .default(0)
      .notNull(),

    isFeatured: boolean("isFeatured")
      .notNull(),

    banner: text("banner"),

    createdAt: timestamp("createdAt", {
      precision: 6,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    slugIndex: uniqueIndex("product_slug_idx")
      .on(table.slug),
  })
);


// =====================
// User
// =====================

export const users = pgTable(
  "User",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    name: text("name")
      .default("NO_NAME")
      .notNull(),

    email: text("email"),

    emailVerified: timestamp("emailVerified", {
      precision: 6,
    }),

    password: text("password"),

    role: text("role")
      .default("user")
      .notNull(),

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
    emailIndex: uniqueIndex("user_email_idx")
      .on(table.email),
  })
);


// =====================
// Account (Auth.js)
// =====================

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("userId")
      .notNull(),

    type: text("type")
      .notNull(),

    provider: text("provider")
      .notNull(),

    providerAccountId: text("providerAccountId")
      .notNull(),

    refreshToken: text("refreshToken"),

    accessToken: text("accessToken"),

    expiresAt: integer("expiresAt"),

    tokenType: text("tokenType"),

    scope: text("scope"),

    idToken: text("idToken"),

    sessionState: text("sessionState"),
  },
  (table) => ({
    uniqueProvider: uniqueIndex(
      "account_provider_providerAccountId_idx"
    ).on(
      table.provider,
      table.providerAccountId
    ),
  })
);


// =====================
// Session (Auth.js)
// =====================

export const sessions = pgTable(
  "sessions",
  {
    sessionToken: text("sessionToken")
      .primaryKey(),

    userId: uuid("userId")
      .notNull(),

    expires: timestamp("expires", {
      precision: 6,
    })
      .notNull(),
  }
);


// =====================
// Verification Token
// =====================

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier")
      .notNull(),

    token: text("token")
      .notNull(),

    expires: timestamp("expires")
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [
        table.identifier,
        table.token,
      ],
    }),
  })
);


// =====================
// Cart
// =====================

export const carts = pgTable(
  "Cart",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    userId: uuid("userId"),

    sessionCartId: text("sessionCartId")
      .notNull(),

    items: json("items"),

    itemsPrice: numeric("itemsPrice", {
      precision: 12,
      scale: 2,
    })
      .notNull(),

    totalPrice: numeric("totalPrice", {
      precision: 12,
      scale: 2,
    })
      .notNull(),

    shippingPrice: numeric("shippingPrice", {
      precision: 12,
      scale: 2,
    })
      .notNull(),

    taxPrice: numeric("taxPrice", {
      precision: 12,
      scale: 2,
    })
      .notNull(),

    createdAt: timestamp("createdAt", {
      precision: 6,
    })
      .defaultNow()
      .notNull(),
  }
);