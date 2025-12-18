import database from "infra/database.js";

const status = async (request, response) => {
  const result = await database.query("SELECT 1+1 as sum;");
  console.log(result);
  return response.status(200).json({ chave: "xuux de sáás" });
};

export default status;
