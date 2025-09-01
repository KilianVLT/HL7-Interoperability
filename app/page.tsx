import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function InputWithButton() {
  return (
    <div className="flex w-full max-w-sm items-center gap-2">
      <Input type="text" placeholder="XXX-XX-XXXX" />
      <Button type="search" variant="outline">
        <Search />
      </Button>
    </div>
  )
}

export function Header(){
  return (
    <header className="m-3 absolute top-0 left-0 z-10 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-700">
        <a href="http://localhost:3000" className="mr-3 hover:underline-offset-1 hover:underline">
          Home
        </a>
        <a href="http://localhost:3000/explorer" className="hover:underline-offset-1 hover:underline">
          File explorer
        </a>
      </header>
  )
}


export default function Home() {
  return (
    <>
      <Header/>
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center sm:text-left">
            HL7 Interface test
          </h1>
          <p>
            Get patient data by entering their patient number below 👇:
          </p>

          <div className="w-full flex justify-center">
            <InputWithButton />
          </div>
        </main>
        <footer className="absolute bottom-4">
            <p className="text-xs">&copy; 2024 HL7 Interface Test, TIGUM group. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
