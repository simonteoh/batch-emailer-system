import { Stream } from "stream";
import { sendMail } from "./common/mailer";
interface DataType {
    email: string;
    name?: string;
    replacedMjml?: any;
    [key: string]: any;
  }
const fs = require('fs');
const csv = require('csv-parser');
const Agenda = require('agenda');
const { MongoClient } = require('mongodb');
const emailScheduler = async (mongoConnectionString: string, dateTime: any, csvFile: any, emailFrom: any, emailSubject: any, mjmlContent: string) => {
    try {


        const agenda = new Agenda({
            db: { address: mongoConnectionString },
        });
        const mongoClient = new MongoClient(mongoConnectionString);
        const newDate = dateTime.replace(".000Z", "")
        const specificDate = new Date(newDate);
        const unixTime = Math.floor(specificDate.getTime() / 1000);
        agenda.define(`Send mail ${unixTime}`, async (job: any) => {
            const emailList = job.attrs.data.data.emailData;
            let i = 1;  
            for (const emailData of emailList) {
                await sendMail(emailData);
                console.log(`Sent Mail ${i} out of ${emailList.length}`)
                i++;
              }
            
            job.done();
        });
        const scheduleEmail = async (scheduledDate: any, emailData: any) => {
            const jobAttributes = {
                name: `Send mail ${unixTime}`,
                data: { emailData },
                schedule: scheduledDate,
            };
            
            agenda.schedule(scheduledDate, `Send mail ${unixTime}`, jobAttributes);
        };

        // Initialize agenda with the MongoDB connection
        agenda.mongo(mongoClient.db());

        const readStream = new Stream.Readable();
        const emailList: DataType[] = [];
        readStream.push(csvFile);
    readStream.push(null);
        readStream
            .pipe(csv())
            .on('data', (data: DataType) => {
                let replacedMjml: string = mjmlContent;
                const emailData: DataType = { email: data.email };
                    for (const key in data) {
                        const value = data[key];
                        replacedMjml = replacedMjml.replace(`{${key}}`, value);
                    }
                    emailData.replacedMjml = replacedMjml;
                    emailData.emailFrom = emailFrom
                    emailData.emailSubject = emailSubject
                    emailList.push(emailData);
            })
            .on('end', () => {
                scheduleEmail(newDate, emailList);
                agenda.start();
            })
            .on('error', (error: any) => {
                // Handle errors
                console.error('Error:', error.message);
            });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

export { emailScheduler };
