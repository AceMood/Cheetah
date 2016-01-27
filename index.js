

var child_process = require('child_process');

const spawn = child_process.spawn;


// OSX diskutil erasevolume HFS+ 'RAM Disk' `hdiutil attach -nomount ram://XXXXX`
// 生成500MB RAM
const child = spawn('diskutil', [
  'erasevolume',
  'HFS+',
  '\'.cache\'',
  '`hdiutil attach -nomount ram://1024000`'
], {
  detached: true,
  stdio: [ 'ignore', out, err ]
});

child.unref();