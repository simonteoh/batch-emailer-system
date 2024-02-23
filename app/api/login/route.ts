import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const tokenData = { email: email };
            const token = jwt.sign(tokenData, process.env.JWT_TOKEN_SECRET ?? "", { expiresIn: "1d", });

            const json_response = NextResponse.json({
                status: 200,
                result: "Login successful",
                access_token: token
            })
            json_response.cookies.set("token", token);
            return json_response;
        }
       
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: "Error login 2" }),
            { status: 400 }
        );
    }
}