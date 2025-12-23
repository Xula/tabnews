import database from "infra/database.js";

const status = async (request, response) => {
  // pg version
  const pgVersion = await database.query("SHOW server_version;");

  // pg max connection
  const pgMaxConnections = await database.query("SHOW max_connections;");

  // pg active connections
  const databaseName = process.env.POSTGRES_DB;
  const pgActiveConnections = await database.query({
    text: "SELECT count(*)::int from pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  const updatedAt = new Date().toISOString();

  return response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: pgVersion[0].server_version,
        max_connections: parseInt(pgMaxConnections[0].max_connections),
        active_connections: pgActiveConnections[0].count,
      },
    },
  });
};

export default status;
