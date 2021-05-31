import * as nodemailer from "nodemailer";



 class MailService {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.configure(
      process.env.GMAIL_ACCOUNT,
      process.env.GMAIL_PASSWORD
    ).then();
  }

  async configure(GMAIL_ACCOUNT, GMAIL_PASSWORD) {
    // create reusable transporter object using the default SMTP transport
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      type: "SMTP",
      host: "smtp.gmail.com",
      // port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: GMAIL_ACCOUNT,
        pass: GMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    } as nodemailer.TransportOptions);
  }


  async sendAppointmentCanceledEmail(from: string, to: string, link?: string) {
    // const template = HandleBars.compile(templates.appointment_canceled.html);
    // const plainTemplate = HandleBars.compile(
    //   templates.appointment_canceled.plain
    // );

    const data = {
      name: from,
      link,
    };

    return this.transporter.sendMail({
      from: `${from} no-reply`,
      to,
      subject: `Appointment canceled at ${from}`,
      text: '',// plainTemplate(data),
      html: ''// template(data),
    });
  }

  async sendReminderEmail(from: string, to: string, htmlContent: string = '') {

    return this.transporter.sendMail({
      from: `${from} no-reply`,
      to,
      subject: `Reminder from ${from}`,
      text: htmlContent,
      html: htmlContent,
    });
  }
}

export const mailService = new MailService();
