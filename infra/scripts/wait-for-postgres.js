const { exec } = require("node:child_process");
const net = require("node:net");

function checkTcpReady() {
  const socket = new net.Socket();
  socket.setTimeout(1000);

  socket.on("connect", () => {
    socket.destroy();
    console.log("\n🟢 Postgres pronto\n");
    process.exit(0);
  });

  socket.on("error", () => {
    process.stdout.write(".");
    setTimeout(checkTcpReady, 250);
  });

  socket.on("timeout", () => {
    socket.destroy();
    process.stdout.write(".");
    setTimeout(checkTcpReady, 250);
  });

  socket.connect(5432, "127.0.0.1");
}

function checkPostgres() {
  const username = process.env.POSTGRESQL_USERNAME || "local_user";
  exec(
    `docker exec desabafo-anonimo-postgres pg_isready --host localhost -U ${username}`,
    (error, stdout) => {
      const isReadyForConnections =
        stdout && stdout.search("accepting connections") >= 0;

      if (!isReadyForConnections) {
        process.stdout.write(".");
        setTimeout(checkPostgres, 250);
        return;
      }

      checkTcpReady();
    },
  );
}

process.stdout.write("\n🔴 Aguardando Postgres");
checkPostgres();
