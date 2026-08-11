const secret = process.env.PAYSTACK_SECRET_KEY;

export async function initializePaystack(email: string, amountNaira: number, reference: string, callbackUrl: string) {
  if (!secret) throw new Error("PAYSTACK_SECRET_KEY is not configured.");

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      amount: Math.round(amountNaira * 100),
      reference,
      callback_url: callbackUrl
    })
  });

  const data = await response.json();
  if (!response.ok || !data.status) {
    throw new Error(data.message || "Unable to initialize payment.");
  }
  return data.data as { authorization_url: string; access_code: string; reference: string };
}

export async function verifyPaystack(reference: string) {
  if (!secret) throw new Error("PAYSTACK_SECRET_KEY is not configured.");

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${secret}` },
      cache: "no-store"
    }
  );

  const data = await response.json();
  if (!response.ok || !data.status) {
    throw new Error(data.message || "Unable to verify payment.");
  }
  return data.data as { status: string; reference: string; amount: number; currency: string };
}
