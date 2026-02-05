import migrationsExec from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

const migrations = async (request, response) => {
  // const type = {
  //   GET: () => console.log("entrou no metodo GET"),
  //   POST: () => console.log("entrou no metodo POST"),
  // };
  // type[request.method]();

  const dbClient = await database.getNewClient();
  const defaultMigrationOptions = {
    dbClient,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    migrationsTable: "pgmigrations",
    verbose: true,
  };

  if (request.method === "GET") {
    const migrationsToRun = await migrationsExec(defaultMigrationOptions);
    await dbClient.end();
    return response.status(200).json(migrationsToRun);
  }
  if (request.method === "POST") {
    const migrationsDone = await migrationsExec({
      ...defaultMigrationOptions,
      dryRun: false,
    });
    await dbClient.end();

    if (migrationsDone.length > 0) {
      return response.status(201).json(migrationsDone);
    }
    return response.status(200).json(migrationsDone);
  }

  return response.status(405);
};

export default migrations;
