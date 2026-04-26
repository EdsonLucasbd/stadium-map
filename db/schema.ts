import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core';

export const locations = sqliteTable('locations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  teamName: text('team_name'),
  description: text('description'),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  shieldUrl: text('shield_url'),
  coverUrl: text('cover_url'),
  galleryUrls: text('gallery_urls', { mode: 'json' }).$type<string[]>(),
  category: text('category'), // e.g., 'stadium', 'monument', 'city'
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export type Location = typeof locations.$inferSelect;
export type NewLocation = typeof locations.$inferInsert;
