exports.getRedisInfo =function  () {
  return new Promise((resolve, reject) => {
	client.hgetall(event.sender.id, function(err, obj) {
			redisData = obj;
			      if (err) {
        // Reject the Promise with an error
        return reject(err);
      }

      // Resolve (or fulfill) the promise with data
      return resolve(obj);
		});
  })
}
