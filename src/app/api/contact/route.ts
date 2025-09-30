// src/app/api/contact/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(5),
  honey: z.string().optional(), // honeypot (antispam)
});

export async function POST(req: Request) {
  const form = await req.formData();
  const data = Object.fromEntries(form) as Record<string, string>;

  const parsed = schema.safeParse({
    name: data.name ?? "",
    email: data.email ?? "",
    phone: data.phone ?? "",
    message: data.message ?? "",
    honey: data.honey ?? "",
  });

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { name, email, phone, message, honey } = parsed.data;

  // tiché OK pre botov (neposielame nič)
  if (honey && honey.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const to = process.env.CONTACT_TO ?? "info@gpcs.sk";
  const from = process.env.CONTACT_FROM ?? "no-reply@gpcs.sk";

  try {
    await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: "Nová požiadavka z webu GPCS",
      text: `Meno: ${name}
E-mail: ${email}
Telefón: ${phone || "-"}

Správa:
${message}`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Email send failed:", err);
    return NextResponse.json({ ok: false, error: "SEND_FAILED" }, { status: 500 });
  }
}
