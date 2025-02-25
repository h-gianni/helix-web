import { Check, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/core/Badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/core/Accordion";
import { Button } from "@/components/ui/core/Button";

const faqs = [
  {
    question: "Is it complicated to set up?",
    answer:
      "Not at all. Simply create an account, invite your team members, and start scoring actions in minutes—no technical background required.",
  },
  {
    question: "How secure is my data?",
    answer:
      "We use industry-standard encryption and secure servers to protect all your company’s information, so only authorized users can access performance data.",
  },
  {
    question: "Is this suitable for both small teams and large organizations?",
    answer:
      "Absolutely. Our app scales to meet the needs of any size team—from startups with a handful of employees to enterprise-level departments.",
  },
  {
    question: "Do my team members see their own scores in real time?",
    answer:
      "Yes—transparency is key. Team members can track their progress and improvements instantly, which promotes engagement and accountability.",
  },
  {
    question: "How does this integrate with our existing HR tools?",
    answer:
      "We offer seamless integrations and easy data exports, letting you sync performance metrics with common HR platforms or payroll systems.",
  },
  {
    question:
      "What does the free ‘On Us’ plan include, and can I upgrade later?",
    answer:
      "The ‘On Us’ plan gives you core performance tracking features at no cost—no credit card required. You can upgrade to our Professional plan any time for advanced analytics and extended functionality.",
  },
  {
    question: "Does it work for remote or hybrid teams?",
    answer:
      "Yes. Our real-time scoring and AI-driven insights are accessible from anywhere, making it easy to manage performance across different locations and time zones.",
  },
  {
    question: "How is this different from traditional annual reviews?",
    answer:
      "Traditional reviews often rely on memory and subjectivity. Our app captures actions and behaviors as they happen, giving you AI-powered insights for fair, ongoing feedback instead of once-a-year surprises.",
  },
];

export const FAQ = () => (
  <div className="w-full py-20 lg:py-40">
    <div className="container mx-auto">
      <div className="flex flex-col gap-10">
        <div className="flex text-center justify-center items-center gap-4 flex-col">
          <Badge variant="outline">FAQ</Badge>
          <div className="flex gap-2 flex-col">
            <h4 className="text-3xl md:text-5xl tracking-tighter max-w-xl text-center font-regular">
              Frequently Asked Questions
            </h4>
            <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl text-center">
              Still have questions about how our AI-powered performance
              management app works, or whether it’s right for your team? Check
              out these FAQs to get the answers you need—fast. If you don’t see
              your question here, feel free to reach out and we’ll be happy to
              help.
            </p>
          </div>
          <div>
            <Button className="gap-4" variant="outline">
              Any questions? Reach out <PhoneCall className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="max-w-3xl w-full mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  </div>
);
