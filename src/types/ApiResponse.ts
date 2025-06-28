import { Message } from "@/generated/prisma";

export interface ApiResponse {
    success: boolean;
    message: string;
    isAccptingMessages?: boolean;
    messages?: Array<Message>
};