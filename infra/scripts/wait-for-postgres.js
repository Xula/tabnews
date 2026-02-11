const { exec } = require("node:child_process");

function checkPostgres() {
  exec("docker exec postgres-dev pg_isready", handleReturn);

  function handleReturn(error, output) {
    // console.log(output);
    if (output.search("accepting connections") === -1) {
      // string not found
      process.stdout.write(".");
      checkPostgres();
      return;
    }
    // string accepting connections found
    console.log("\n\n🟢 Postgres aceitando conexões.");
    return;
  }
}

process.stdout.write("\n🔴 Aguardando Postgres aceitar conexões");
checkPostgres();
