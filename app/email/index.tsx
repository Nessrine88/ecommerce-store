// email/index.ts
import { Resend } from 'resend';
import PurchaseReceiptEmail from './purchase-receipt';
import { SENDER_EMAIL, APP_NAME } from '@/lib/constants';
import { Order } from '@/types';

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const sendPurchaseReceipt = async ({ order }: { order: Order }) => {
  const { data, error } = await resend.emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: order.user.email,
    subject: `Order Confirmation ${order.id}`,
    react: PurchaseReceiptEmail({ order }),
  });

  if (error) {
    console.error('❌ Resend failed to send receipt:', error);
    throw new Error(`Failed to send purchase receipt: ${error.message}`);
  }

  console.log('✅ Resend accepted receipt:', data?.id);
  return data;
};