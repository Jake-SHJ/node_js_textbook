const cluster = require("cluster");
const http = require("http");
const numCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  console.log(`마스터 프로세스 아이디: ${process.pid}`);
  // CPU 개수만큼 워커를 생산
  for (let i = 0; i < numCPUs; i += 1) {
    cluster.fork();
  }
  // 워커가 종료되었을 때
  cluster.on("exit", (worker, code, signal) => {
    console.log(`${worker.process.pid}번 워커가 종료되었습니다.`);
    cluster.fork(); // 종료 시 워커 재생성
  });
} else {
  //워커들이 포트에서 대기
  http
    .createServer((req, res) => {
      res.write("<h1>Hello Node!</h1>");
      res.end("<p>Hello Cluster!</p>");
      setTimeout(() => {
        process.exit(1); // localhost 접속시 워커 1개씩 종료 (새로고침 마다)
      }, 1000);
    })
    .listen(8085);
  console.log(`${process.pid}번 워커 실행`);
}
