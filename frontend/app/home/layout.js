export default function HomeLayout({ children }){
    return (
        <main className="p-4 max-h-screen max-w-screen h-screen w-screen flex items-center justify-center bg-gray-50">
            {children}
        </main>
    )
}