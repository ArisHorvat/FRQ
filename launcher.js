const { exec } = require('child_process');

(async () => {
  const open = await import('open');

  const backendProcess = exec('npm start --prefix backend');
  const frontendProcess = exec('http-server frontend');

  backendProcess.stdout.on('data', data => {
    console.log(`Backend: ${data}`);
  });

  frontendProcess.stdout.on('data', data => {
    console.log(`Frontend: ${data}`);
  });

  open.default('http://localhost:8080');

  const cleanup = () => {
    console.log('Closing servers...');
    backendProcess.kill();
    frontendProcess.kill();
    process.exit();
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
})();
