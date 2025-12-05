// import { NextResponse } from "next/server";
// import User from "@/lib/models/user";
// import crypto from "crypto";
// import connectDB from "@/lib/dbConnect";
// import { Resend } from "resend";

// export async function POST(req) {
//   try {
//     await connectDB();
//     const { email } = await req.json();

//     // Initialize Resend inside handler
//     const resend = new Resend(process.env.RESEND_API_KEY);

//     // 1️⃣ Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       return NextResponse.json(
//         { error: "Email not found" },
//         { status: 400 }
//       );
//     }

//     // 2️⃣ Create reset token
//     const token = crypto.randomBytes(32).toString("hex");

//     // Save token + expiry
//     user.resetToken = token;
//     user.resetTokenExpiry = Date.now() + 10 * 60 * 1000;
//     await user.save();

//     // 3️⃣ Use your production site URL
//     const baseURL = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_API_URL;

//     const resetURL = `${baseURL}/forgotpassword?token=${token}`;

//     // 4️⃣ Send email
//     await resend.emails.send({
//       from: "Reset Password <noreply@yourdomain.com>",
//       to: email,
//       subject: "Reset Your Password",
//       html: `
//         <p>Hello ${user.name},</p>
//         <p>You requested to reset your password.</p>

//         <p>
//           <a href="${resetURL}" 
//              style="padding: 10px 15px; background: #2563EB; 
//                     color: white; text-decoration: none; border-radius: 6px;">
//             Reset Password
//           </a>
//         </p>

//         <p>Or copy this link:</p>
//         <p>${resetURL}</p>

//         <p>This link expires in 10 minutes.</p>
//       `,
//     });

//     return NextResponse.json({ success: true });

//   } catch (error) {
//     console.error("Forgot Password Error:", error);
//     return NextResponse.json(
//       { error: "Server error" },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from "next/server";
import User from "@/lib/models/user";
import crypto from "crypto";
import connectDB from "@/lib/dbConnect";
import { Resend } from "resend";

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();

    const resend = new Resend(process.env.RESEND_API_KEY);

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    const baseURL = process.env.NEXTAUTH_URL || "http://localhost:3000";

    const resetURL = `${baseURL}/forgotpassword?token=${token}`;

    const emailRes = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Reset Password",
      html: `<p>Click link to reset</p><p>${resetURL}</p>`,
    });

    if (emailRes.error) {
      console.log(emailRes.error);
      return NextResponse.json({ error: "Email failed to send" }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
