import { spawn } from 'child_process';
import localtunnel from 'localtunnel';
import { createInterface } from 'readline';

let tunnelInstance = null;

// Start Vite dev server
const vite = spawn('npm', ['run', 'dev'], { 
  stdio: ['inherit', 'pipe', 'inherit'],
  shell: true 
});

const rl = createInterface({
  input: vite.stdout,
  terminal: false
});

// Wait for Vite server to start
rl.on('line', async (line) => {
  console.log(line); // Forward Vite output
  
  if (line.includes('Local:')) {
    try {
      // Start localtunnel after Vite is ready
      tunnelInstance = await localtunnel({ 
        port: 5174,
        subdomain: 'afterheart' // Use a consistent subdomain
      });
      
      console.log('\n🔒 Secure URL:', tunnelInstance.url);
      console.log('Use this URL in your Spotify Dashboard redirect URI');
      console.log('Add "/callback" to the end of the URL for the redirect URI\n');

      tunnelInstance.on('error', (err) => {
        console.error('Tunnel error:', err);
      });

      tunnelInstance.on('close', () => {
        console.log('Tunnel closed');
      });
    } catch (err) {
      console.error('Error setting up tunnel:', err);
      vite.kill();
      process.exit(1);
    }
  }
});

// Handle process termination
process.on('SIGINT', () => {
  if (tunnelInstance) {
    tunnelInstance.close();
  }
  vite.kill();
  process.exit(0);
}); 