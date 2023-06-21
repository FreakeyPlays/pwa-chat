export class Logger {
  private static instance: Logger;
  private oldConsoleLog: any = null;

  private constructor() {}

  static getInstance() {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return this.instance;
  }

  public enableLogging() {
    if (this.oldConsoleLog === null) {
      return;
    }

    console.log('[Logger] - logging enabled');

    window['console']['log'] = this.oldConsoleLog;
  }

  public disableLogging() {
    console.log('[Logger] - logging disabled');

    this.oldConsoleLog = console.log;

    window['console']['log'] = function () {};
  }
}
