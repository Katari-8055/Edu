import Stripe from 'stripe';
import { Request, Response } from 'express';
import prisma from '../../../db/prisma';
import dotenv from 'dotenv';
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {});
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
export const createPaymentIntent = async (req: Request, res: Response) => {
    const { courseId } = req.body;
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const course = await prisma.course.findUnique({
            where: { id: courseId },
        });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(course.price * 100),
            currency: "inr",
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: "never",
            },
            metadata: {
                userId: req.user.id,
                courseId: course.id,
            },
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
 export const webhookHandler = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string;
    const webhookSecret = endpointSecret;
    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    }
    catch (err) {
        console.error('Webhook signature verification failed:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        return res.status(400).send(`Webhook Error: ${errorMessage}`);
    }
    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const userId = paymentIntent.metadata.userId;
        const courseId = paymentIntent.metadata.courseId;
        try {
            await prisma.enrollment.create({
                data: {
                    userId: userId,
                    courseId: courseId,
                },
            });
            console.log(`Enrollment created for user ${userId} and course ${courseId}`);
        }
        catch (err) {
            console.error('Error creating enrollment:', err);
        }
    }
    res.json({ received: true });
};

