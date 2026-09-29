const { spawnSync } = require("node:child_process");
const http = require("node:http");

function run(command) {
  const result = spawnSync(command, {
    stdio: "inherit",
    shell: true,
  });

  return typeof result.status === "number" ? result.status : 1;
}

function isAppRunning() {
  return new Promise((resolve) => {
    const request = http.request(
      {
        hostname: "127.0.0.1",
        port: 3000,
        path: "/api/v1/status",
        method: "GET",
        timeout: 1500,
      },
      (response) => {
        response.resume();
        resolve(response.statusCode === 200);
      },
    );

    request.on("error", () => {
      resolve(false);
    });

    request.on("timeout", () => {
      request.destroy();
      resolve(false);
    });

    request.end();
  });
}

async function main() {
  const args = process.argv.slice(2);
  const coverage = args.includes("--coverage");

  const prepareStatus = run("npm run test:prepare");

  let testsStatus = 0;
  if (prepareStatus === 0) {
    testsStatus = coverage
      ? run("npm run test:coverage")
      : run("npm run test:run");
  }

  let stopStatus = 0;
  const appIsRunning = await isAppRunning();
  if (!appIsRunning) {
    stopStatus = run("npm run services:stop");
  } else {
    console.log(
      "\n🟡 Aplicação ativa em :3000. Mantendo container do banco em execução.\n",
    );
  }

  if (prepareStatus !== 0) {
    process.exit(prepareStatus);
  }

  if (testsStatus !== 0) {
    process.exit(testsStatus);
  }

  if (stopStatus !== 0) {
    process.exit(stopStatus);
  }

  process.exit(0);
}

main();
