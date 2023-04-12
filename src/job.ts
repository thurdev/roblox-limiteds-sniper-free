import nodecron from "node-cron";

export default class Job {
  constructor(
    public name: string,
    public cron: string,
    public callback: () => void
  ) {}

  public run() {
    nodecron.schedule(this.cron, this.callback);
  }
}
