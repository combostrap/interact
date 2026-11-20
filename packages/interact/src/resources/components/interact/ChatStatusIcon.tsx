import {
    CircleAlertIcon,
    CircleCheckIcon,
    LoaderCircleIcon,
} from "lucide-react"

export function ChatStatusIcon({ status }: { status?: "running" | "error" }) {
    if (status === "running") {
        return <LoaderCircleIcon className="animate-spin" />
    }

    if (status === "error") {
        return <CircleAlertIcon />
    }

    return <CircleCheckIcon />
}