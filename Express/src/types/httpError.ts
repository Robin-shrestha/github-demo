export class HttpError extends Error {
  static statusCode = 500;
  status: number;

  constructor(status = HttpError.statusCode, message?: string) {
    super(message);
    this.name = new.target.name;
    this.status = status;
  }
}

export class BadRequest extends HttpError {
  static statusCode = 400;

  constructor(message = "Bad Request") {
    super(BadRequest.statusCode, message);
  }
}

export class Unauthorized extends HttpError {
  static statusCode = 401;

  constructor(message = "Unauthorized") {
    super(Unauthorized.statusCode, message);
  }
}

export class Forbidden extends HttpError {
  static statusCode = 403;

  constructor(message = "Forbidden") {
    super(Forbidden.statusCode, message);
  }
}

export class NotFound extends HttpError {
  static statusCode = 404;

  constructor(message = "Not Found") {
    super(NotFound.statusCode, message);
  }
}

export class Conflict extends HttpError {
  static statusCode = 409;

  constructor(message = "Conflict") {
    super(Conflict.statusCode, message);
  }
}

export class InternalServerError extends HttpError {
  static statusCode = 500;

  constructor(message = "Internal Server Error") {
    super(InternalServerError.statusCode, message);
  }
}
