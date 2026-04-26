import { type Location, type User } from "@/db/schema";

export interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export interface LocationWithUser extends Location {
  registeredBy?: Pick<User, "id" | "name" | "image"> | null;
}
