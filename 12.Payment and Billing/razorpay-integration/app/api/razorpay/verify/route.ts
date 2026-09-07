import { NextResponse, NextRequest } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-guard";

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();

    const body = await request.json(); // simpler than .text() + JSON.parse
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;

    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const generatedSign = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`) // pipe is correct
      .digest("hex");

    if (generatedSign !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Payment Verification Failed" },
        { status: 400 },
      );
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { plan: "PRO" },
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified and plan upgraded",
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { success: false, message: "Payment verification failed" },
      { status: 500 },
    );
  }
}
