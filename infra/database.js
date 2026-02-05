import { Client } from "pg";

const query = async (queryObject) => {
  const client = await getNewClient();
  try {
    const result = await client.query(queryObject);
    return result.rows;
  } catch (e) {
    console.error(e);
    throw e;
  } finally {
    await client.end();
  }
};

const getNewClient = async () => {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });
  // console.log("Credenciais de conexao do banco", {
  //   host: process.env.POSTGRES_HOST,
  //   port: process.env.POSTGRES_PORT,
  //   user: process.env.POSTGRES_USER,
  //   database: process.env.POSTGRES_DB,
  //   password: process.env.POSTGRES_PASSWORD,
  //   ssl: getSSLValues(),
  // });
  await client.connect();
  return client;
};

const getSSLValues = () => {
  return process.env.NODE_ENV === "production" ? true : false;
};

export default {
  query,
  getNewClient,
};
