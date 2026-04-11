import { TestimonialsColumn, Testimonial } from "./ui/testimonials-columns-1";
import { motion } from "motion/react";

const testimonials: Testimonial[] = [
  {
    text: "I started investing with Salvage Biz-Hub Ltd about five years ago... Today, I can confidently say that it was one of the best financial decisions I have made.",
    image: "https://picsum.photos/seed/ibrahim/200/200",
    name: "Mr. Ibrahim Musa",
    role: "Long-Term Investor, Abuja",
  },
  {
    text: "Before committing capital, I carried out extensive due diligence... This is a professionally managed agribusiness that aligns well with long-term investment strategies.",
    image: "https://picsum.photos/seed/james/200/200",
    name: "James Whitmore",
    role: "UK Investor, London",
  },
  {
    text: "For the past four years I have invested with Salvage Biz-Hub Ltd... That level of integrity is rare and truly commendable.",
    image: "https://picsum.photos/seed/grace/200/200",
    name: "Mrs. Grace Okafor",
    role: "Investor, Lagos",
  },
  {
    text: "I joined Salvage Biz-Hub Ltd six years ago... Today, I have increased my investment three times because I trust their system and leadership.",
    image: "https://picsum.photos/seed/samuel/200/200",
    name: "Dr. Samuel Danladi",
    role: "Investor, Jos",
  },
  {
    text: "The first time I bought DAD'S RICE, I was surprised by the quality. The rice is very clean, stone-free, and cooks perfectly.",
    image: "https://picsum.photos/seed/halima/200/200",
    name: "Mrs. Halima Bello",
    role: "Customer, Kaduna",
  },
  {
    text: "I have been investing for over three years now. What makes this company different is that they don't just promise profits, they deliver results.",
    image: "https://picsum.photos/seed/chinedu/200/200",
    name: "Mr. Chinedu Nwankwo",
    role: "Investor, Enugu",
  },
  {
    text: "As a food vendor, the quality of rice I use matters greatly. Since I started using DAD'S RICE, my customers often compliment the natural taste.",
    image: "https://picsum.photos/seed/blessing/200/200",
    name: "Mrs. Blessing Adebayo",
    role: "Food Vendor, Ibadan",
  },
  {
    text: "What convinced me to continue reinvesting is the consistency in paying my ROI as at when due. They communicate with investors regularly.",
    image: "https://picsum.photos/seed/abdullahi/200/200",
    name: "Engr. Abdullahi Sani",
    role: "Investor, Kaduna",
  },
  {
    text: "Nigeria's economy has faced many challenges, but SBH has shown resilience and professionalism. They remained committed to paying investors.",
    image: "https://picsum.photos/seed/ifeoma/200/200",
    name: "Barr. Ifeoma Eze",
    role: "Investor, Port Harcourt",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export default function TestimonialsSection() {
  return (
    <section className="bg-background my-20 relative">
      <div className="container z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <div className="flex justify-center">
            <div className="border border-brand-orange/20 py-1 px-4 rounded-lg text-brand-orange font-bold uppercase tracking-wider text-xs">
              Testimonials
            </div>
          </div>

          <h2 className="text-3xl md:text-5xl font-black tracking-tighter mt-5 text-center uppercase">
            Voices of Our Partners & Investors
          </h2>
          <p className="text-center mt-5 text-gray-600 font-medium">
            Hear from those who have joined us in transforming agriculture and building wealth.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
}
