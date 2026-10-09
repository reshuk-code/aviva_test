import { spawnSync } from 'node:child_process';

const image = process.argv[2] || process.env.DOCKER_IMAGE;
if (!image || image.includes('YOUR_') || !/^[a-z0-9][a-z0-9._:/-]+$/.test(image) || !image.includes('/')) {
  console.error('Provide your image name: npm run update:push -- yourusername/aviva-site:latest');
  process.exit(1);
}
function run(args) {
  const result = spawnSync('docker', args, { stdio: 'inherit', shell: false });
  if (result.error) { console.error(result.error.message); process.exit(1); }
  if (result.status !== 0) process.exit(result.status || 1);
}
run(['info', '--format', '{{.OSType}}']);
// xCloud Linux servers need a Linux image even when building on Windows.
run(['buildx', 'build', '--platform', process.env.DOCKER_PLATFORM || 'linux/amd64', '--load', '-t', image, '.']);
run(['push', image]);
console.log(`Published ${image}. Set this as image: in docker-compose.xcloud.yml, then redeploy in xCloud.`);
