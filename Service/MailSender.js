const nodemailer = require("nodemailer");
require("dotenv").config();

class Emailer {
  constructor() {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "chimdi4332@gmail.com",
        pass: process.env.NODEMAILER_PASS,
      },
    });

    this.transporter = transporter;
  }

  async sendAlert(res, { subject, msg, email }) {
    try {
      const _subject = subject
        ? `Reach out from ${subject}`
        : msg.length > 15
        ? "Reach out from" + " " + (msg.substring(0, 15) + "...")
        : msg;
      console.log({ _subject });
      const body = `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <title> PERSONAL SITE </title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style type="text/css">
            /* email styles */
            body {
              font-family: Arial, sans-serif;
              font-size: 14px;
              line-height: 1.6;
              background-color: #f6f6f6;
              margin: 0;
              padding: 0;
            }
            table {
              border-collapse: separate;
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
            }
            th,
            td {
              padding: 20px;
              text-align: left;
              vertical-align: top;
              border-collapse: collapse;
            }
            th {
              background-color: #f5f5f5;
              font-weight: bold;
              color: #444;
              border-bottom: 1px solid #ddd;
            }
            td {
              border-bottom: 1px solid #ddd;
            }
            h1,
            h2,
            h3 {
              margin: 0;
              line-height: 1.2;
              color: #333;
            }
            p {
              margin: 0 0 1em;
            }
            /* button styles */
            .button {
              display: inline-block;
              margin-bottom: 0;
              font-weight: 400;
              text-align: center;
              white-space: nowrap;
              vertical-align: middle;
              cursor: pointer;
              border: 1px solid transparent;
              padding: 0.5rem 1rem;
              font-size: 1rem;
              line-height: 1.5;
              border-radius: 0.25rem;
              color: #fff;
              background-color: #17a2b8;
              border-color: #17a2b8;
              text-decoration: none;
            }
            .button:hover {
              color: #fff;
              background-color: #138496;
              border-color: #117a8b;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <table>
            <thead>
              <tr>
                <th colspan="2">
                  <h1>${_subject}</h1>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="2">
                  <p>Recent Portfolio Message,</p>
                  <p>${msg}</p>
                  <br/>
                  <p>You can reach you to me via: ${email}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
      `;

      const mailOptions = {
        from: "chimdi4332@gmail.com",
        to: "chimdi4332@gmail.com",
        subject: _subject,
        html: body,
      };

      const sent = await this.transporter.sendMail(mailOptions);
      console.log({ sent });
      return res
        .status(201)
        .json({ message: "Message sent", status: 201 })
        .end();
    } catch (error) {
      console.log({ error });
      console.error(error.message);
      return res.status(500).json({ message: error.message }).end();
    }
  }
}

module.exports = new Emailer();
