import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
    const data = await req.json();
    const user = await prisma.users.findFirst({
        where: {
            email: data.input,
            otp: data.otp
        }
    })
    if (!user) {
        return new NextResponse(JSON.stringify({ error: "Error login with OTP" }),
            { status: 404 }
        );
    }
    const tokenData = { email: data.input };
    const token = jwt.sign(tokenData, process.env.JWT_TOKEN_SECRET ?? "", { expiresIn: "1d", });

    const json_response = NextResponse.json({
        status: 200,
        result: "Login successful"
    })
    json_response.cookies.set("token",token);
    return json_response;
}