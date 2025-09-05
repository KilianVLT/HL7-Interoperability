"use client"

import { ChevronDownIcon } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Toaster, toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"



// Datepicker component
export function DateOfBirthField({value, onChange}) {
    const [open, setOpen] = useState(false)
    
    return (
        <div className="flex flex-col gap-3">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id="date"
                        className="w-48 justify-between font-normal"
                    >
                        {value ? value.toLocaleDateString() : "Select date"}
                        <ChevronDownIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={value}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                            onChange(date)
                            setOpen(false)
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}

//  Toggle group component
export function SexField({value, onChange}) {
    return (
        <ToggleGroup 
            type="single" 
            variant="outline" 
            value={value}
            onValueChange={(val) => val && onChange(val as "male" | "female")}
        >
            <ToggleGroupItem value="male" aria-label="Toggle male">
                <h1>Male</h1>
            </ToggleGroupItem>
            <ToggleGroupItem value="female" aria-label="Toggle female">
                <h1>Female</h1>
            </ToggleGroupItem>
        </ToggleGroup>
    )
}

const FormSchema = z.object({
    name: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    surname: z.string().min(2, {
        message: "Surname must be at least 2 characters.",
    }),
    birthDate: z.date({
        error: issue => issue.input === undefined ? "Required" : "Invalid date"
    }),
    sex: z.enum(["male", "female"])
})

export function RegisterForm() {

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            surname: "",
            birthDate: undefined,
            sex: "male",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data)
        const response = await fetch("http://localhost:5000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })

        console.log(response);
        
        if (response.ok) {
            const data = await response.json()
            toast.success(data.message, {
                style: { backgroundColor: '#D1FAE5', color: '#065F46' }
            })
            form.reset()
        } else {
            toast.error("Error registering patient", {
                style: { backgroundColor: '#FEE2E2', color: '#991B1B' }
            })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Brown" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="surname"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Surname</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Chris" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="birthDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date of birth</FormLabel>
                                <FormControl>
                                    <DateOfBirthField  value={field.value} onChange={field.onChange}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="sex"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sex</FormLabel>
                                <FormControl>
                                    <SexField value={field.value} onChange={field.onChange}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit">Submit</Button>

                <Toaster position="top-center" richColors/>
            </form>
        </Form>
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


export default function Home() {

    return (
        <>
            <Header />
            <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-1 gap-16 sm:p-20">
                <h1 className="text-2xl sm:text-2xl font-extrabold text-center text-slate-700">
                    HL7 Interface test
                </h1>
                <main className="flex flex-col items-center w-full justify-center">
                    <RegisterForm />
                </main>
                <footer className="absolute bottom-4">
                    <p className="text-xs">&copy; 2025 HL7 Interface Test, TIGUM group. All rights reserved.</p>
                </footer>
            </div>
        </>
    );
}
