import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer'
import csv from 'csv-parser';
import { Stream } from 'stream';

interface DataType {
    email: string;
    name?: string;
    [key: string]: any;
}
export async function POST(req: Request) {
    try {
        let allReplacedText: string[] = [];
        const formData = await req.formData()
        const csvFile = formData.get("csvFile") as Blob | null;

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

                for (const data of emailList) {
                    // Get the keys of object
                    const objectKeys = Object.keys(data);
                    allReplacedText = objectKeys
                }
                resolve();
            });
        })

        let json_response = {
            status: "Success",
            result: allReplacedText
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
