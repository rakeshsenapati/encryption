// /pages/api/message.js
import { dbConnect } from '@/lib/dbConnect';// Setup database connection
import Message from '@/models/messages';
import { NextResponse as Response, type NextRequest } from 'next/server';
const handler = async (req: NextRequest) => {
    await dbConnect();
    if (req.method === 'POST') {
        const formData = await req.formData();
        const message = new Message({
            encryptedMessage: formData.get('encryptedMessage'),
            expiration: formData.get('expirationTime'),
            maxViews: formData.get('maxViews')
        });
        await message.save();
        return Response.json({ id: message._id });
    }
    if (req.method === 'GET') {
        const message = await Message.findById(req.nextUrl.searchParams.get("id"))
        if (!message) {
            return Response.json({ error: "Message not found" }, { status: 404 });
        }
        if (message.viewCount >= message.maxViews) {
            return Response.json({ error: "Message has reached maximum views" }, { status: 429 });
        }
        if (message.expiration && message.expiration < new Date()) {
            return Response.json({ error: "Message has expired" }, { status: 400 });
        }
        const _messageCopy = JSON.parse(JSON.stringify(message))
        message.viewCount = Math.min(message.viewCount + 1, message.maxViews);
        await message.save();
        return Response.json(_messageCopy);
    }
}

export { handler as GET, handler as POST };
