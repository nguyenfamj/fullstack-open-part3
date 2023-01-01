const errorHandler = (error, request, response, next) => {
  console.log(error.message);
  console.log(error.name);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }

  next(error);
};

module.exports = { errorHandler };
