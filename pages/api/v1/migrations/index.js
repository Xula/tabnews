import migrationsExec from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";
import { error } from "node:console";

const migrations = async (request, response) => {
  // const type = {
  //   GET: () => console.log("entrou no metodo GET"),
  //   POST: () => console.log("entrou no metodo POST"),
  // };
  // type[request.method]();

  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(request.method)) {
    return response.status(405).json({
      error: `Method ${request.method} Not Allowed`,
    });
  }

  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const defaultMigrationOptions = {
      dbClient,
      dryRun: true,
      dir: join("infra", "migrations"),
      direction: "up",
      migrationsTable: "pgmigrations",
      verbose: true,
    };

    // GET request
    if (request.method === "GET") {
      const migrationsToRun = await migrationsExec(defaultMigrationOptions);
      return response.status(200).json(migrationsToRun);
    }

    // POST request
    if (request.method === "POST") {
      const migrationsDone = await migrationsExec({
        ...defaultMigrationOptions,
        dryRun: false,
      });
      if (migrationsDone.length > 0) {
        return response.status(201).json(migrationsDone);
      }
      return response.status(200).json(migrationsDone);
    }
  } catch (e) {
    console.error(e);
    throw e;
  } finally {
    await dbClient.end();
  }
};

export default migrations;
