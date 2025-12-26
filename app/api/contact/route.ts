import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        console.error('❌ RESEND_API_KEY is missing from environment variables');
        return NextResponse.json(
            { error: 'Server configuration error: Missing API Key' },
            { status: 500 }
        );
    }

    const resend = new Resend(apiKey);

    try {
        const body = await request.json();
        const { name, email, message } = body;

        console.log('📝 Received contact form submission:', { name, email, messageLength: message?.length });

        // Validate input
        if (!name || !email || !message) {
            console.warn('⚠️ Missing required fields:', { name: !!name, email: !!email, message: !!message });
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Send email via Resend
        console.log('🚀 Attempting to send email via Resend...');
        const { data, error } = await resend.emails.send({
            from: 'Portfolio Contact <onboarding@resend.dev>',
            to: ['theflashkrishna@gmail.com'],
            subject: `New Message from ${name}`,
            html: `
                <h2>New Portfolio Contact</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
                <hr />
                <p style="color: #666; font-size: 12px;">Sent from your portfolio contact form</p>
            `,
            replyTo: email,
        });

        if (error) {
            console.error('❌ Resend API Error:', JSON.stringify(error, null, 2));
            return NextResponse.json(
                { error: `Failed to send email: ${error.message}` },
                { status: 500 }
            );
        }

        console.log('✅ Email sent successfully:', data);

        return NextResponse.json(
            { success: true, message: 'Email sent!' },
            { status: 200 }
        );
    } catch (error) {
        console.error('❌ Critical Contact Form Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
