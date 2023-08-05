export class SuccessResponse {
  static send(message = 'OK', metadata = {}) {
    return {
      status: 'success',
      message: message,
      metadata,
    };
  }
}
