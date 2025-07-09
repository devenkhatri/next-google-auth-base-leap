import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase-admin';
import { PLANS } from '@/lib/constants';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planId } = await req.json();
    const plan = PLANS.find(p => p.id === planId);

    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const userId = session.user.id;
    const userRef = db.collection('users').doc(userId);

    await userRef.update({
      plan: JSON.parse(JSON.stringify(plan)), // Convert plan object to plain object for Firestore
      'usage.maxRequests': plan.quota,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Subscription update failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
