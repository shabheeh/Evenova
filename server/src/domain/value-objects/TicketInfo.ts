export class TicketInfo {
  constructor(
    public readonly eventName: string,
    public readonly eventDate: Date,
    public readonly venue: string,
    public readonly ticketType: string,
    public readonly price: number,
    public readonly attendeeName: string,
    public readonly ticketId: string
  ) {}

  public toQRCodeData(): string {
    return JSON.stringify({
      ticketId: this.ticketId,
      eventName: this.eventName,
      eventDate: this.eventDate.toISOString(),
      venue: this.venue,
      ticketType: this.ticketType,
      attendeeName: this.attendeeName,
      validationHash: this.generateValidationHash(),
    });
  }

  private generateValidationHash(): string {
    const data = `${this.ticketId}-${this.eventName}-${this.attendeeName}`;
    return Buffer.from(data).toString('base64');
  }
}
