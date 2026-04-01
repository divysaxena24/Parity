import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { sql } from '@/lib/db';

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env');
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    });
  }

  // Handle the event
  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { 
        email_addresses, 
        username, 
        first_name, 
        last_name, 
        public_metadata 
    } = evt.data;
    
    const email = email_addresses[0]?.email_address;
    const name = `${first_name || ''} ${last_name || ''}`.trim();
    const handle = username || email.split('@')[0];
    
    // Auth metadata
    const role = public_metadata?.role || 'USER';
    const subStatus = public_metadata?.subscriptionStatus || 'INACTIVE';
    // PRD: Default 10% min
    const donationPercentage = Math.max(10, public_metadata?.donationPercentage || 10);

    try {
        await sql`
            INSERT INTO users (id, name, username, email, role, subscription_status, donation_percentage)
            VALUES (${id}, ${name}, ${handle}, ${email}, ${role}, ${subStatus}, ${donationPercentage})
            ON CONFLICT (id) DO UPDATE SET 
                name = EXCLUDED.name,
                username = EXCLUDED.username,
                email = EXCLUDED.email,
                role = EXCLUDED.role,
                subscription_status = EXCLUDED.subscription_status,
                donation_percentage = EXCLUDED.donation_percentage,
                updated_at = CURRENT_TIMESTAMP
        `;
        console.log(`User ${id} synced successfully`);
    } catch (err) {
        console.error('Neon Sync Error:', err);
        return new Response('Database sync failed', { status: 500 });
    }
  }

  return new Response('', { status: 200 });
}
