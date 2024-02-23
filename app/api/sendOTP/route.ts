import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from 'nodemailer'
import fs from 'fs';
import mjml2html from 'mjml'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
    try {
        const { emailOTP } = await req.json();
        //GET 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        //    const user = await prisma.users.create({
        //         data:{
        //             email: "simonteoh1996@gmail.com",
        //             password: "secret",
        //             otp: otp
        //         }
        //       });
        // const user = prisma.users.findUnique({
        //     where: {
        //         email: email
        //     }
        // })
        const user = await prisma.users.findUnique({
            where: { email: emailOTP }
        })
        if (!user) {
            return new NextResponse(JSON.stringify({ error: "User not found" }),
                { status: 404 }
            );
        }
        const mjmlFilePath = './bvs.mjml';
        const mjmlContent = fs.readFileSync(mjmlFilePath, 'utf-8');
        const replaceVariable = `This is your email OTP: ${otp}`
        const replacedContent = mjmlContent.replace('{content}', replaceVariable);
        const otpLogin = await prisma.users.update({
            where: {
                email: emailOTP,
            },
            data: { otp },
        });
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST ?? 'smtp.ethereal.email',
            port: parseFloat(process.env.SMTP_PORT ?? "587"),
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD
            },
        });
        const info = await transporter.sendMail({
            from: process.env.SMTP_EMAIL_FROM,
            to: emailOTP,
            subject: "BVS OTP",
            html: mjml2html(replacedContent, {filePath: mjmlFilePath}).html
        });
        const json_response = {
            status: 200,
            result: "OTP Sent"
        }
        return new NextResponse(JSON.stringify(json_response))
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: "Error sending OTP" }),
            { status: 400 }
        );
    }
}