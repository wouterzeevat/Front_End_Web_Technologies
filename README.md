# Front_End_Web_Technologies
![](https://github.com/wouterzeevat/Front_End_Web_Technologies/blob/main/example.gif))

EXAMPLE!!
this is for the exam

const path = require('path');
const fastifyStatic = require('@fastify/static');

module.exports = async function (fastify, opts) {
  const publicPath = path.join(__dirname, '..', 'public');

  fastify.register(fastifyStatic, {
    root: publicPath,
    prefix: '/',
    index: 'index.html', // Specify the index file
  });
};
