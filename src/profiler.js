const { EventEmitter } = require('events');

const profiles = new EventEmitter();

profiles.on('middleware', ({ req, name, elapsedMS }) => {
  console.log(`${req.method} / ${name}: ${elapsedMS}ms`);
});
profiles.on('route', ({ req, name, elapsedMS }) => {
  console.log(`${req.method} / ${name}: ${elapsedMS}ms`);
});

module.exports.wrap = (fn) => {
  if (fn.length === 2) {
    return function (req, res) {
      const start = Date.now();
      res.once('finish', () => profiles.emit('route', {
        req,
        name: fn.name,
        elapsedMS: Date.now() - start,
      }));

      return fn.apply(this, arguments);
    };
  }
  if (fn.length === 3) {
    return (req, res, next) => {
      const start = Date.now();
      fn.call(this, req, res, () => {
        profiles.emit('middleware', {
          req,
          name: fn.name,
          elapsedMS: Date.now() - start,
        });

        next();
      });
    };
  }

  throw new Error('Function must take 2 or 3 arguments');
};
