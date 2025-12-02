import { Metadata } from "next"
import Posts from "@/components/posts"
import { DefaultBreadcrumb } from "@/components/ui/breadcrumb"
import { Newspaper, Rss } from "lucide-react"

export const metadata: Metadata = {
    title: 'Haberler',
    description: 'Sunucumuzdan en son haberler, duyurular ve güncellemeler.',
}

export default function PostsPage() {
    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-card border border-border/50 shadow-2xl shadow-primary/5">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5" />
                <div className="absolute -left-20 -top-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
                
                <div className="relative px-8 py-16 flex flex-col md:flex-row items-center justify-between gap-8 z-10">
                    <div className="space-y-4 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 text-sm font-medium">
                            <Rss className="w-4 h-4" />
                            <span>Haber Merkezi</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                            Haberler & Duyurular
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-xl">
                            Sunucumuzla ilgili en son gelişmeleri, etkinlikleri ve güncellemeleri buradan takip edebilirsiniz.
                        </p>
                    </div>

                    <div className="relative shrink-0">
                        <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center animate-pulse">
                            <Newspaper className="w-16 h-16 md:w-20 md:h-20 text-blue-600" />
                        </div>
                    </div>
                </div>
            </div>

            <DefaultBreadcrumb items={[{ label: "Haberler", href: "/posts" }]} />
            <Posts />
        </div>
    )
}
