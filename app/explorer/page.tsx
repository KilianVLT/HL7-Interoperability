"use client"
import { useEffect, useState } from "react";
import { ChartNoAxesCombined } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";


export function FilesList({ setNumberOfFiles, files, setFiles, setFilesFiltered}) {

    useEffect(() => {
        const fetchFiles = async () => {
            const response = await fetch("http://localhost:5000/documents")
            const data = await response.json()
            setFiles(data)
            setFilesFiltered(data)
            setNumberOfFiles(data.length)
        }

        fetchFiles()
    }, [])

    if (files.length === 0) {
        return <p className="text-muted-foreground">No files found...</p>
    }

    return (
        <Accordion className="w-3/4" type="single" collapsible>
            {files.map((element) => (
                <AccordionItem
                    value={element.PatientInfo.PatientID}
                    key={element.PatientInfo.PatientID}
                >
                    <AccordionTrigger>
                        Patient n°{element.PatientInfo.PatientID}
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-row gap-4 text-balance">
                        <div className="flex flex-col w-1/2 gap-1">
                            <p>
                                Name : {element.PatientInfo.PatientName}
                            </p>
                            <p>
                                Birth date : {element.PatientInfo.DateOfBirth}
                            </p>
                            <p>
                                Sex : {element.PatientInfo.Sex}
                            </p>
                        </div>
                        <div className="flex w-1/2 justify-end m-6">
                            <Link href={`http://localhost:3000/analytics/${element.PatientInfo.PatientID}`} className="flex flex-row gap-2 items-center text-sm font-medium text-slate-700 hover:underline">
                                See analytics
                                <ChartNoAxesCombined />
                            </Link>
                        </div>

                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    )
}


export function Header() {
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

export function InputWithButton({files, setFilesFiltered, setNumberOfFiles}) {

    const [search, setSearch] = useState("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)

        if( e.target.value === ""){
            setFilesFiltered(files)
            setNumberOfFiles(files.length)
            return
        }
    
        const fileFilter = files.filter((file) => file.PatientInfo.PatientID.includes(e.target.value) || file.PatientInfo.PatientName.includes(e.target.value))
        setFilesFiltered(fileFilter)
        setNumberOfFiles(fileFilter.length)
        return
    }

    return (
        <div className="flex w-full items-center gap-2">
            <Input type="text" placeholder="Search patient" value={search} onChange={handleChange}/>
            <Button type="search" variant="outline">
                <Search />
            </Button>
        </div>
    )
}


export default function Home() {
    const [numberOfFiles, setNumberOfFiles] = useState<number>(0)
    const [files, setFiles] = useState<any[]>([])
    const [filesFiltered, setFilesFiltered] = useState<any[]>([])



    return (
        <>
            <Header />
            <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-1 gap-16 sm:p-20">
                <div>
                    <h1 className="text-2xl sm:text-2xl font-extrabold text-center text-slate-700">
                        HL7 Interface test
                    </h1>
                    <p className="text-center pb-2">{numberOfFiles} files found</p>
                    <InputWithButton files={files} setFilesFiltered={setFilesFiltered} setNumberOfFiles={setNumberOfFiles}/>
                </div>
                <main className="flex flex-col items-center w-full justify-center">
                    <FilesList setNumberOfFiles={setNumberOfFiles} files={filesFiltered} setFiles={setFiles} setFilesFiltered={setFilesFiltered} />
                </main>
                <footer className="relative bottom-2">
                    <p className="text-xs">&copy; 2025 HL7 Interface Test, TIGUM group. All rights reserved.</p>
                </footer>
            </div>
        </>
    );
}
