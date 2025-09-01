import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function FilesList() {
  return (
    <Accordion
      className="w-3/4"
      type="single"
      collapsible
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>Product Information</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            Our flagship product combines cutting-edge technology with sleek
            design. Built with premium materials, it offers unparalleled
            performance and reliability.
          </p>
          <p>
            Key features include advanced processing capabilities, and an
            intuitive user interface designed for both beginners and experts.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Shipping Details</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            We offer worldwide shipping through trusted courier partners.
            Standard delivery takes 3-5 business days, while express shipping
            ensures delivery within 1-2 business days.
          </p>
          <p>
            All orders are carefully packaged and fully insured. Track your
            shipment in real-time through our dedicated tracking portal.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Return Policy</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            We stand behind our products with a comprehensive 30-day return
            policy. If you&apos;re not completely satisfied, simply return the
            item in its original condition.
          </p>
          <p>
            Our hassle-free return process includes free return shipping and
            full refunds processed within 48 hours of receiving the returned
            item.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )

}

export function Header(){
  return (
    <header className="m-3 absolute top-0 left-0 z-10 flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700">
        <a href="http://localhost:3000" className="mr-3 hover:underline-offset-1 hover:underline">
          Home
        </a>
        <a href="http://localhost:3000/explorer" className="hover:underline-offset-1 hover:underline">
          File explorer
        </a>
      </header>
  )
}

export function InputWithButton() {
  return (
    <div className="flex w-full items-center gap-2">
      <Input type="text" placeholder="Search patient" />
      <Button type="search" variant="outline">
        <Search />
      </Button>
    </div>
  )
}


export default function Home() {
  return (
    <>
      <Header/>
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-1 gap-16 sm:p-20">
        <div>
            <h1 className="text-2xl sm:text-2xl font-extrabold text-center text-slate-700">
                HL7 Interface test
            </h1>
            <p className="text-center pb-2">X files found</p>
            <InputWithButton />
        </div>
        <main className="flex flex-col items-center w-full justify-center">
            <FilesList />
        </main>
        <footer className="absolute bottom-4">
            <p className="text-xs">&copy; 2024 HL7 Interface Test, TIGUM group. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
