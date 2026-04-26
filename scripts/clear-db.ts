import { db } from '../lib/db';
import { locations } from '../db/schema';

async function main() {
  console.log("Deletando todos os registros...");
  await db.delete(locations);
  console.log("Banco limpo com sucesso!");
}

main().catch(console.error);
