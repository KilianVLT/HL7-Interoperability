"use client"
import { useEffect, useState, use } from "react";
import { Button } from "@/components/ui/button";

import { Play, Square } from "lucide-react";
import Chart from "chart.js";

export function Header() {
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


export default function Analytics({ params }: { params: Promise<{ patientId: string }> }) {
    const [patient, setPatient] = useState<any>(null)
    const { patientId } = use(params)

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/analytics/${patientId}`)
                if (!response.ok) throw new Error("Failed to fetch")
                const data = await response.json()
                setPatient(data)
            } catch (err) {
                console.error("❌ Error fetching patient:", err)
            }
        }
        fetchPatientData()
    }, [patientId])

    useEffect(() => {
        if (!patient) return

        const canvas = document.getElementById("line-chart") as HTMLCanvasElement | null
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return


        // Get chart data from patient record
        let record: Array<any> = patient.Records && patient.Records.length > 0 ? patient.Records : null
        record = record.reverse() // Reverse to have chronological order

        const chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: record.map(d => new Date(d.Timestamp).getHours()),
                datasets: [
                    {
                        label: record[0].Units,
                        data: record.map(d => d.ObservationValue[0]),
                        borderColor: "#111",
                        backgroundColor: "#111",
                        fill: false,
                    }
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    xAxes: {
                        type: "time",
                        time: {
                            tooltipFormat: "dd/MM/yyyy HH:mm", // tooltip = date complète
                        },
                        ticks: {
                            autoSkip: true,
                            maxRotation: 0,
                            callback: (val, index, ticks) => {
                                const current = new Date((ticks[index] as any).value)
                                const prev = index > 0 ? new Date((ticks[index - 1] as any).value) : null

                                // Si pas de précédent ou changement de jour → affiche la date
                                if (!prev || current.getDate() !== prev.getDate() ||
                                    current.getMonth() !== prev.getMonth() ||
                                    current.getFullYear() !== prev.getFullYear()) {
                                    return current.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })
                                }

                                // Sinon affiche l'heure
                                return current.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
                            }
                        }
                    },
                    yAxes: {
                        beginAtZero: true
                    }
                }
            }
        })

        return () => {
            chart.destroy() // ✅ cleanup when component unmounts
        }
    }, [patient]) // re-run when patient data changes

    if (!patient?.PatientInfo) {
        return <p className="text-muted-foreground">No patient found...</p>
    }

    return (
        <>
            <Header />
            <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen gap-16 sm:p-10">
                <main className="flex flex-row w-full h-full m-auto gap-[32px] row-start-2 items-center sm:items-start">

                    {/* Patient Info */}
                    <div className="flex flex-col w-1/3 mt-15">
                        <div className="flex flex-col justify-left border-l-2 pl-4">
                            <h2 className="text-2xl font-bold">Patient infos</h2>
                            <p>Name: {patient.PatientInfo.PatientName}</p>
                            <p>Birth date: {patient.PatientInfo.DateOfBirth}</p>
                            <p>Sex: {patient.PatientInfo.Sex}</p>
                        </div>
                        <div className="flex flex-row mt-5 ml-5 gap-2">
                            <Button>
                                <Play />
                            </Button>
                            <Button disabled={true} variant="secondary">
                                <Square color="black" fill="true" />
                            </Button>
                        </div>
                    </div>
                    {/* Chart */}
                    <div className="w-2/3 bg-white h-full rounded shadow">
                        <div className="relative h-[400px]">
                            <canvas id="line-chart"></canvas>
                        </div>
                    </div>

                </main>
                <footer className="absolute bottom-4">
                    <p className="text-xs">&copy; 2025 HL7 Interface Test, TIGUM group. All rights reserved.</p>
                </footer>
            </div>
        </>
    )
}