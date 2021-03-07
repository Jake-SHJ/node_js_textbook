const SSE = require("sse");

module.exports = (server) => {
  const sse = new SSE(server);
  sse.on("connection", (client) => {
    setInterval(() => {
      client.send(new Date().valueOf().toString());
    }, 1000);
  });
};

// sse는 ie, edge를 지원하지 않는다
