import { TestimonialsColumn, Testimonial } from "./ui/testimonials-columns-1";
import { motion } from "motion/react";

const testimonials: Testimonial[] = [
  {
    text: "I have gotten over 250,000 Naira ever since I signed up for the rice investment program. The returns are real and consistent.",
    image: "https://raw.githubusercontent.com/ghostshadow526/jtech/main/download.jpg",
    name: "Joshua David",
    role: "Rice Investor",
  },
  {
    text: "The quality of the rice is top-notch. I buy in bulk for my family and the savings are incredible. No stones at all!",
    image: "https://raw.githubusercontent.com/ghostshadow526/jtech/main/images.jpg",
    name: "Olawale Adeyemi",
    role: "Regular Customer",
  },
  {
    text: "Being a part of the SMCS cooperative has changed my life. I've seen a 30% increase in my farming profits this year.",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=200&h=200&auto=format&fit=crop",
    name: "Chidi Okafor",
    role: "Cooperative Member",
  },
  {
    text: "I was skeptical at first, but after my first payout of 150k, I'm now a regular investor. Highly recommended!",
    image: "https://raw.githubusercontent.com/ghostshadow526/jtech/main/download.jpg",
    name: "Aisha Bello",
    role: "Investor",
  },
  {
    text: "The training programs taught me modern rice farming techniques that doubled my yield this season. God bless SMCS.",
    image: "https://raw.githubusercontent.com/ghostshadow526/jtech/main/images.jpg",
    name: "Samuel Adeyemi",
    role: "Farmer",
  },
  {
    text: "The digital platform makes it so easy to track my rice investments. I've already earned back my initial capital and more.",
    image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=200&h=200&auto=format&fit=crop",
    name: "Fatima Yusuf",
    role: "Digital Investor",
  },
  {
    text: "I've been buying rice from here for months. It's clean, stone-free, and very affordable compared to the local market.",
    image: "https://raw.githubusercontent.com/ghostshadow526/jtech/main/download.jpg",
    name: "Blessing Okoro",
    role: "Wholesale Buyer",
  },
  {
    text: "The cooperative support is amazing. They helped me get the right fertilizers and seeds for my rice farm in Kebbi.",
    image: "https://raw.githubusercontent.com/ghostshadow526/jtech/main/images.jpg",
    name: "Emeka Nwosu",
    role: "Rice Farmer",
  },
  {
    text: "Investing in agriculture is the future of Nigeria. I'm glad I chose this platform for my rice investment journey.",
    image: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?q=80&w=200&h=200&auto=format&fit=crop",
    name: "Tunde Bakare",
    role: "Strategic Investor",
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
            What our customers say
          </h2>
          <p className="text-center mt-5 text-gray-600 font-medium">
            See what our customers have to say about us.
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
