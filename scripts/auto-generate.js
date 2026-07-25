import { spawn } from 'child_process';

const child = spawn('npx', ['drizzle-kit', 'generate'], {
  stdio: ['pipe', 'inherit', 'inherit'],
  shell: true
});

const interval = setInterval(() => {
  if (child.stdin) {
    child.stdin.write('\r\n');
  }
}, 500);

child.on('close', (code) => {
  clearInterval(interval);
  console.log(`Child process exited with code ${code}`);
});
