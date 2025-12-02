import {Metadata} from "next";
import {DefaultBreadcrumb} from "@/components/ui/breadcrumb";
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Search, ArrowUpDown, ArrowDown, ArrowUp, Ban, MicOff, AlertTriangle, Calendar, Clock, User, ShieldAlert} from "lucide-react";
import {serverPunishmentService} from "@/lib/api/services/punishmentService";
import {notFound} from "next/navigation";
import {headers} from "next/headers";
import { Badge } from "@/components/ui/badge";

export async function generateMetadata({params}: { params: Promise<{ punishment_type: string }> }): Promise<Metadata> {
    const {punishment_type} = await params;
    const typeMap: Record<string, string> = {
        ban: "Yasaklamalar",
        mute: "Susturulmalar",
        warning: "Uyarılar"
    };

    return {
        title: typeMap[punishment_type] || "Cezalar",
        description: `${typeMap[punishment_type] || "Cezalar"} sayfası`,
    };
}

const punishmentTypeMap: Record<string, { title: string; description: string; color: string; icon: any; gradient: string }> = {
    ban: {
        title: "Yasaklamalar",
        description: "Sunucudan yasaklanan oyuncuların listesi",
        color: "text-red-500",
        icon: Ban,
        gradient: "from-red-500/5 to-orange-500/5"
    },
    mute: {
        title: "Susturulmalar",
        description: "Sohbetten uzaklaştırılan oyuncuların listesi",
        color: "text-purple-500",
        icon: MicOff,
        gradient: "from-purple-500/5 to-pink-500/5"
    },
    warning: {
        title: "Uyarılar",
        description: "Uyarı alan oyuncuların listesi",
        color: "text-yellow-500",
        icon: AlertTriangle,
        gradient: "from-yellow-500/5 to-amber-500/5"
    }
};

function formatDate(dateInput: string): string {
    let date: Date;

    if (/^\d+$/.test(dateInput)) {
        date = new Date(parseInt(dateInput));
    } else {
        date = new Date(dateInput);
    }

    return date.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatDuration(start: string, end: string): string {
    if (end === '-1') {
        return 'Kalıcı';
    }

    let startDate: Date;
    let endDate: Date;

    if (/^\d+$/.test(start)) {
        startDate = new Date(parseInt(start));
    } else {
        startDate = new Date(start);
    }

    if (/^\d+$/.test(end)) {
        endDate = new Date(parseInt(end));
    } else {
        endDate = new Date(end);
    }

    const diffMs = endDate.getTime() - startDate.getTime();

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
        return `${days} gün`;
    } else if (hours > 0) {
        return `${hours} saat`;
    } else {
        return `${minutes} dakika`;
    }
}

export default async function PunishmentTypePage({
                                                     params
                                                 }: {
    params: Promise<{ punishment_type: string }>
}) {
    const {punishment_type: punishmentType} = await params;
    const headersList = await headers();
    const WEBSITE_ID = headersList.get("x-website-id") || "default_website_id";

    if (!punishmentTypeMap[punishmentType]) {
        notFound();
    }

    const typeInfo = punishmentTypeMap[punishmentType];
    const Icon = typeInfo.icon;

    // Fetch punishments data
    const punishmentService = serverPunishmentService(WEBSITE_ID);
    let punishments: any[] = [];
    let pagination = {page: 1, limit: 10, total: 0, totalPages: 0, hasNext: false, hasPrev: false};

    try {
        if (WEBSITE_ID) {
            const response = await punishmentService.getPunishmentsByType(
                WEBSITE_ID,
                punishmentType.toUpperCase(),
                1,
                10
            );
            punishments = response.punishments || [];
            pagination = response.pagination || {
                page: 1,
                limit: 10,
                total: 0,
                totalPages: 0,
                hasNext: false,
                hasPrev: false
            };
        }
    } catch (error) {
        console.error("Error fetching punishments:", error);
    }

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-card border border-border/50 shadow-2xl shadow-primary/5">
                <div className={`absolute inset-0 bg-gradient-to-br ${typeInfo.gradient}`} />
                <div className={`absolute -left-20 -top-20 w-96 h-96 ${typeInfo.color.replace('text-', 'bg-')}/5 rounded-full blur-3xl`} />
                
                <div className="relative px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-8 z-10">
                    <div className="space-y-4 text-center md:text-left">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${typeInfo.color.replace('text-', 'bg-')}/10 border ${typeInfo.color.replace('text-', 'border-')}/20 ${typeInfo.color} text-sm font-medium`}>
                            <Icon className="w-4 h-4" />
                            <span>{typeInfo.title}</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                            {typeInfo.title} Listesi
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl">
                            {typeInfo.description}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <DefaultBreadcrumb
                        items={[
                            {label: "Cezalar", href: "/punishments"},
                            {label: typeInfo.title, href: `/punishments/${punishmentType}`}
                        ]}
                    />

                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"/>
                        <Input
                            placeholder={`${typeInfo.title} Ara...`}
                            className="pl-10 w-full md:w-64 bg-card/50 backdrop-blur-sm border-border/50"
                        />
                    </div>
                </div>

                <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden">
                    <CardHeader className="border-b border-border/50 bg-muted/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Son İşlemler</CardTitle>
                                <CardDescription>
                                    Toplam {pagination.total} kayıt bulundu
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className="border-b border-border/50 bg-muted/10">
                                    <th className="text-left py-4 px-6 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                            Kullanıcı
                                        </div>
                                    </th>
                                    <th className="text-left py-4 px-6 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                            Yetkili
                                        </div>
                                    </th>
                                    <th className="text-left py-4 px-6 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                                        Sebep
                                    </th>
                                    <th className="text-left py-4 px-6 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                                        Süre
                                    </th>
                                    <th className="text-left py-4 px-6 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                                        Tarih
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                {punishments.length > 0 ? (
                                    punishments.map((punishment) => (
                                        <tr key={punishment.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="w-10 h-10 border-2 border-border/50">
                                                        <AvatarImage
                                                            src={`https://mc-heads.net/avatar/${punishment.uuid}`}/>
                                                        <AvatarFallback
                                                            className="bg-gradient-to-br from-gray-500 to-gray-700">
                                                            {punishment.name.charAt(0).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm">{punishment.name}</span>
                                                        <span className="text-xs text-muted-foreground font-mono">ID: {punishment.id}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="w-6 h-6">
                                                        <AvatarImage
                                                            src={`https://mc-heads.net/avatar/${punishment.operator}`}/>
                                                        <AvatarFallback>OP</AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm font-medium text-muted-foreground">{punishment.operator}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium max-w-[200px] truncate" title={punishment.reason}>
                                                        {punishment.reason === 'none' ? 'Sebep belirtilmemiş' : punishment.reason}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <Badge variant="outline" className="font-mono text-xs">
                                                    {formatDuration(punishment.start, punishment.end)}
                                                </Badge>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col text-xs text-muted-foreground">
                                                    <span className="font-medium text-foreground">{formatDate(punishment.start).split(' ')[0]}</span>
                                                    <span>{formatDate(punishment.start).split(' ')[1]}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-16 text-center">
                                            <div className="flex flex-col items-center justify-center gap-4">
                                                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
                                                    <ShieldAlert className="w-8 h-8 text-muted-foreground" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="font-semibold text-lg">Kayıt Bulunamadı</h3>
                                                    <p className="text-muted-foreground">Henüz {typeInfo.title.toLowerCase()} listesinde bir kayıt bulunmuyor.</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        {punishments.length > 0 && (
                            <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-border/50 bg-muted/10 gap-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>Sayfa başına</span>
                                    <select className="h-8 px-2 border border-border rounded-md bg-background text-xs">
                                        <option value="10">10</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                    </select>
                                    <span>kayıt</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" disabled={!pagination.hasPrev} className="h-8 w-8 p-0">
                                        <ArrowUp className="w-4 h-4 rotate-[-90deg]" />
                                    </Button>
                                    <div className="px-4 py-1 bg-background border border-border rounded-md text-sm font-medium min-w-[3rem] text-center">
                                        {pagination.page}
                                    </div>
                                    <Button variant="outline" size="sm" disabled={!pagination.hasNext} className="h-8 w-8 p-0">
                                        <ArrowDown className="w-4 h-4 rotate-[-90deg]" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
