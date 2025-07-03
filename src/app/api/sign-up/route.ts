import { prisma } from "@/lib/prismaClient";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";

export async function POST(request: Request) {
    try {
        const { username, email, password } = await request.json();

        const existingVerifiedUserByUsername = await prisma.user.findUnique({
            where: {
                username,
                isVerified: true
            }
        });

        if (existingVerifiedUserByUsername) {
            return Response.json(
                {
                    success: false,
                    message: 'Username is allready taken',
                },
                { status: 400 }
            );
        }

        const existingUserByEmail = await prisma.user.findUnique({
            where: {
                email
            }
        });

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: 'User already exists with this email',
                    },
                    { status: 400 }
                );
            } else {
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
            await prisma.user.update({
                where: {
                    email: existingUserByEmail.email
                },
                data: {
                    verifyCode: existingUserByEmail.verifyCode,
                    verifyCodeExpiry: existingUserByEmail.verifyCodeExpiry,
                    updatedAt: new Date(),
                }
            })
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser =  await prisma.user.create({
                data:{
                    username,
                    email,
                    password: hashedPassword,
                    verifyCode,
                    verifyCodeExpiry: expiryDate,
                    isVerified:false,
                    isAcceptingMessages: true,
                    messages: {
                        create:[]
                    }
                }
            })

        }
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        );
        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                { status: 500 }
            );
        }

        return Response.json(
            {
                success: true,
                message: 'User registered successfully. Please verify your account.',
            },
            { status: 201 }
        );


    } catch (error) {
        console.error('Error registering user:', error);
        return Response.json(
            {
                success: false,
                message: 'Error registering user',
            },
            { status: 500 }
        );
    }
} 