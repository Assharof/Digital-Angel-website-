import {
  boolean,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: integer("user_id").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  slug: varchar("slug", { length: 140 }).notNull().unique(),
  description: text("description").default("").notNull(),
  emoji: varchar("emoji", { length: 12 }).default("📘").notNull(),
});

export const publications = pgTable("publications", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 220 }).notNull().unique(),
  subtitle: varchar("subtitle", { length: 250 }).default("").notNull(),
  description: text("description").default("").notNull(),
  // Long-form sales page copy (the full persuasive page content), separate
  // from the short "description" used on listing cards.
  longDescription: text("long_description").default("").notNull(),
  authorName: varchar("author_name", { length: 120 }).default("").notNull(),
  category: varchar("category", { length: 120 }).default("Premium eBooks").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).default("0").notNull(),
  currency: varchar("currency", { length: 8 }).default("USD").notNull(),
  coverColor: varchar("cover_color", { length: 32 }).default("#0b1f3a").notNull(),
  // Real book cover photo/render, table-of-contents preview image, and one
  // sample interior spread image, all served from /public/images/publications/
  coverImageUrl: text("cover_image_url").default("").notNull(),
  tocImageUrl: text("toc_image_url").default("").notNull(),
  spreadImageUrl: text("spread_image_url").default("").notNull(),
  // JSON array of { title: string, description: string } bonus items
  bonuses: text("bonuses").default("[]").notNull(),
  buyLink: text("buy_link").default("").notNull(),
  sampleLink: text("sample_link").default("").notNull(),
  status: varchar("status", { length: 24 }).default("published").notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  isBookOfMonth: boolean("is_book_of_month").default(false).notNull(),
  isBestSeller: boolean("is_best_seller").default(false).notNull(),
  isNewRelease: boolean("is_new_release").default(false).notNull(),
  isFree: boolean("is_free").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  role: varchar("role", { length: 160 }).default("").notNull(),
  quote: text("quote").notNull(),
  rating: integer("rating").default(5).notNull(),
  published: boolean("published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
});

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 200 }).default("").notNull(),
  body: text("body").notNull(),
  handled: boolean("handled").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});