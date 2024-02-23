import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer'
import csv from 'csv-parser';
import { Stream } from 'stream';
import schedule from 'node-schedule'
import fs from 'fs';
import { mailerConfig, sendMail } from '@/common/mailer';
import Agenda from 'agenda';
import { emailScheduler } from '@/emailScheduler'

interface DataType {
  email: string;
  name?: string;
  [key: string]: any;
}
export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const csvFile = formData.get("csvFile") as Blob | null;
    const mjmlContent = formData.get("mjmlContent") as string
    const emailFrom = formData.get("emailFrom") as string
    const emailSubject = formData.get("subject") as string

    if (!csvFile) {
      return new NextResponse(JSON.stringify({ error: "File is required." }),
        { status: 400 }
      );
    }

    const csvBuffer = Buffer.from(await csvFile.arrayBuffer());
    const emailList: DataType[] = [];
    const readStream = new Stream.Readable();
    readStream.push(csvBuffer);
    readStream.push(null);
    await new Promise<void>((resolve) => {
      readStream.pipe(csv())
        .on('data', (data: DataType) => emailList.push(data))
        .on('end', async () => {
          if (!formData.get("dateTime")) {

            for (const data of emailList) {
              const { email } = data;
              let replacedMjml = mjmlContent;

              // Access the all object keys
              for (const key in data) {
                const value = data[key];
                replacedMjml = replacedMjml.replace(`{${key}}`, value);
              }
              await sendMail({ emailFrom, email, emailSubject, replacedMjml });
            }
          }
          else {
            const dateTime = formData.get("dateTime")
            const mongoConnectionString = process.env.MONGODB ?? "";
            await emailScheduler(mongoConnectionString,dateTime,csvBuffer,emailFrom, emailSubject, mjmlContent)

          }
          console.log("Message sent!");
          resolve()
        });

    });
    let json_response = {
      result: "Success"
    };
    return new NextResponse(JSON.stringify(json_response), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new NextResponse(JSON.stringify({ error: "Error complete sending email process" }),
      { status: 400 }
    );
  }

}

