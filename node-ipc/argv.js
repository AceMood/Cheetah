'use strict';

/**
 * 解析命令行参数
 * @param {Array} args process.argv数组
 */
function parse(args) {
  var argv = {};
  var _ = [];
  args = args.slice(2);

  for (let i = 0; i < args.length; ++i) {
    var piece = args[i];

    if (piece.charAt(0) !== '-') {
      _.push(piece);
    } else {
      piece = piece.replace(/^-*/, '').split('');
      piece.forEach(c => {
        argv[c] = true;
    });

    if (args[i + 1] && args[i + 1].charAt(0) !== '-') {
      argv[piece.pop()] = args[i + 1];
      ++i;
    }
  }
}

argv._ = _;
return argv;
}

exports.parse = parse;