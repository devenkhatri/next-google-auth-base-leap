import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function POST() {
  console.log("Monthly usage reset API triggered.");
  
  // NOTE: In a production application, this endpoint should be protected.
  // You could secure it with a secret key passed in the headers,
  // checked against an environment variable. This is often called a "cron secret".
  
  try {
    const usersRef = db.collection('users');
    const freeUsersQuery = usersRef.where('plan.id', '==', 'free');
    const snapshot = await freeUsersQuery.get();

    if (snapshot.empty) {
        console.log("No free-tier users found to reset.");
        return NextResponse.json({ success: true, message: "No free-tier users found to reset." });
    }

    const batch = db.batch();
    snapshot.docs.forEach(doc => {
        batch.update(doc.ref, { 'usage.requests': 0 });
    });

    await batch.commit();

    const message = `Successfully reset usage for ${snapshot.size} free-tier users.`;
    console.log(message);
    return NextResponse.json({
        success: true,
        message: message
    });
  } catch (error) {
    console.error("Failed to reset usage:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
