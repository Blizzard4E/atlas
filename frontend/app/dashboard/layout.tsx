import Dashboard from "./dashboard";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <Dashboard />
            <div>{children}</div>
        </div>
    );
}
