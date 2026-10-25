import React from "react";
import { BRAND } from "@/lib/constants";

export const metadata = {
  title: "Frequently Asked Questions",
  description: "Common inquiries regarding sizing, nationwide delivery, and payment methods at ROYAL SHOES.",
};

export default function FAQPage() {
  const faqs = [
    {
      q: "How do I choose the correct shoe size?",
      a: "Our footwear follows standard European (EU) sizing standards (39-45 for men, 36-41 for women). If you are between sizes, we recommend selecting your larger size or contacting our concierge via WhatsApp at 03481702710 for personalized measurement advice.",
    },
    {
      q: "What payment methods are supported?",
      a: "We support Cash on Delivery (COD) across Pakistan, Easypaisa mobile wallet payments (account 03481702710), and direct online bank transfers to our Meezan Bank corporate account.",
    },
    {
      q: "What are the shipping charges?",
      a: "Orders above Rs. 5,000 enjoy complimentary nationwide delivery. Orders below Rs. 5,000 are delivered for a nominal flat rate of Rs. 250 anywhere in Pakistan.",
    },
    {
      q: "What is your return or exchange policy?",
      a: "We offer a 7-day hassle-free size exchange guarantee on all unworn footwear in original packaging.",
    },
    {
      q: "How long does delivery take?",
      a: "Deliveries to major cities (Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad) typically arrive within 2 to 4 working days. Regional destinations arrive in 3 to 6 working days.",
    },
  ];

  return (
    <div className="py-12 max-w-3xl mx-auto space-y-8">
      <div className="border-b border-[#E4DDD3] pb-4">
        <span className="text-[10px] font-bold tracking-brand uppercase text-[#795548]">
          CLIENT GUIDE
        </span>
        <h1 className="font-brand text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-luxury text-[#4A342E] mt-0.5">
          FREQUENTLY ASKED QUESTIONS
        </h1>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="p-5 bg-[#FFFFFF] border border-[#E4DDD3] space-y-2">
            <h3 className="font-brand text-sm font-bold text-[#4A342E] uppercase tracking-wide">
              {faq.q}
            </h3>
            <p className="text-xs text-[#6B635B] leading-relaxed">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
