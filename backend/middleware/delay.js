// Middleware to add random delay (5-10 seconds) for slow endpoints

export function delayMiddleware(request, reply, done) {
  // Check if this is a "slow" endpoint
  if (request.url.includes("/slow/")) {
    // Random delay between 5000ms and 10000ms
    const delay = Math.floor(Math.random() * 5000) + 5000;

    request.log.info(`Slow endpoint detected. Adding ${delay}ms delay...`);

    setTimeout(() => {
      done();
    }, delay);
  } else {
    done();
  }
}
