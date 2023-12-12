import Link from "next/link";

export default function Dashboard() {
    return (
        <nav className="bg-gray-950 p-4 flex items-center gap-8">
            <h1 className="text-xl font-bold text-white">
                <Link href={"/dashboard"}>Dashboard</Link>
            </h1>
            <ul className="flex gap-8">
                <li>
                    <Link
                        href={"/"}
                        className="block text-md text-white hover:text-emerald-500 "
                    >
                        Home
                    </Link>
                </li>
                <li>
                    <Link
                        href={"/dashboard/create-character"}
                        className="block text-md text-white hover:text-emerald-500 "
                    >
                        Create Character
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
