// Example of a more typical implementation structure
const chokidar = require('chokidar');
const cp = require('child_process');

// Initialize watcher.
const watcher = chokidar.watch('docs', {
  ignored: [/(^|[\/\\])\../,'docs/_build'], // ignore dotfiles
  persistent: true
});

// Something to use when events are received.
const log = console.log.bind(console);
// Add event listeners.
watcher
  .on('add', path => log(`File ${path} has been added`))
  .on('change', path => {triggerBuild();log(`File ${path} has been changed`)})
  .on('unlink', path => log(`File ${path} has been removed`));

// More possible events.
watcher
  .on('addDir', path => log(`Directory ${path} has been added`))
  .on('unlinkDir', path => log(`Directory ${path} has been removed`))
  .on('error', error => log(`Watcher error: ${error}`))
  .on('ready', () => log('Initial scan complete. Ready for changes'))
  .on('raw', (event, path, details) => { // internal
    log('Raw event info:', event, path, details);
  });

// 'add', 'addDir' and 'change' events also receive stat() results as second
// argument when available: https://nodejs.org/api/fs.html#fs_class_fs_stats
watcher.on('change', (path, stats) => {
  if (stats) console.log(`File ${path} changed size to ${stats.size}`);
});

function triggerBuild() {
    console.log('Triggering build');
    const {pid, stdout, stderr} = cp.spawnSync('jb', ['build', 'docs']);
    console.log(stdout.toString());
    console.log(stderr.toString());
}
