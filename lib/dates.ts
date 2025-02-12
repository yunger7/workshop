export function formatDate(dateString: string): string {
    const [year, month, day] = dateString.split("-").map(Number);

    if (!year || !month || !day) {
        throw new Error("Invalid date string");
    }

    const date = new Date(year, month - 1, day);

    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    return `${months[date.getMonth()]} ${date.getDate()?.toString().padStart(2, "0")}, ${date.getFullYear()}`;
}
