import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

const StatusPage = () => {
  return (
    <>
      <h1>Status Page</h1>
      <UpdatedAt />
      <DatabaseStatus />
    </>
  );
};

const UpdatedAt = () => {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 5000,
  });

  let statusText = "Carregando...";

  if (!isLoading && data) {
    statusText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return <div>Última Atualização: {statusText}</div>;
};

const DatabaseStatus = () => {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 5000,
  });

  let dbText = "Carregando...";

  if (!isLoading && data) {
    const dbData = data.dependencies.database;
    dbText = (
      <>
        <div>Versão: {dbData.version}</div>
        <div>Conexões máximas: {dbData.max_connections}</div>
        <div>Conexões ativas: {dbData.active_connections}</div>
      </>
    );
  }

  return (
    <>
      <h1>Database:</h1>
      {dbText}
    </>
  );
};

export default StatusPage;
