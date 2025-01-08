export default function HomeLayout({ children }){
    return (
        <main className="h-screen w-screen flex items-center justify-center bg-gray-50">
            {children}
        </main>
    )
}