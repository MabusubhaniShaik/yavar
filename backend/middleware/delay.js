export function delayMiddleware(request, reply, done) {
  if (request.url.includes("/slow/")) {
    const delay = Math.floor(Math.random() * 5000) + 5000;

    request.log.info(`Slow endpoint detected. Adding ${delay}ms delay...`);

    setTimeout(() => {
      done();
    }, delay);
  } else {
    done();
  }
}
