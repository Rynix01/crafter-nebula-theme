"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageSquare, 
  Plus, 
  Search, 
  LifeBuoy, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MessageCircle,
  ChevronRight,
  Loader2
} from "lucide-react";
import { ticketService } from "@/lib/api/services/ticketService";
import { Ticket, TicketCategory } from "@/lib/types/ticket";
import { lexicalToString } from "@/lib/helpers/lexicalToString";
import CreateTicket from "./ticket/create";
import { AuthContext } from "@/lib/context/AuthContext";
import { cn } from "@/lib/utils";

export default function Support() {
  const router = useRouter();
  const {isAuthenticated, isLoading} = useContext(AuthContext);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [categories, setCategories] = useState<TicketCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("tickets");

  const ticketServiceInstance = ticketService();

  if(!isLoading && !isAuthenticated) {
    router.push("/auth/sign-in?return=/support");
  }

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ticketsData, categoriesData] = await Promise.all([
        ticketServiceInstance.getTickets(),
        ticketServiceInstance.getTicketCategories(),
      ]);
      setTickets(ticketsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "REPLIED":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "ON_OPERATE":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "CLOSED":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "OPEN":
        return "Açık";
      case "REPLIED":
        return "Yanıtlandı";
      case "ON_OPERATE":
        return "İşlemde";
      case "CLOSED":
        return "Çözüldü";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "OPEN":
        return AlertCircle;
      case "REPLIED":
        return MessageCircle;
      case "ON_OPERATE":
        return Clock;
      case "CLOSED":
        return CheckCircle2;
      default:
        return AlertCircle;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const filteredTickets = tickets.filter(ticket => 
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTicketCreated = () => {
    setActiveTab("tickets");
    loadData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-card border border-border/50 shadow-2xl shadow-primary/5">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-fuchsia-500/5" />
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        
        <div className="relative px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-8 z-10">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-500 text-sm font-medium border border-violet-500/20">
              <LifeBuoy className="w-4 h-4" />
              <span>Destek Merkezi</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              Size Nasıl Yardımcı Olabiliriz?
            </h1>
            <p className="text-muted-foreground max-w-lg text-lg">
              Sorunlarınızı çözmek ve sorularınızı yanıtlamak için buradayız. 
              Yeni bir talep oluşturun veya mevcut taleplerinizi takip edin.
            </p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold">{tickets.length}</div>
                <div className="text-xs text-muted-foreground">Toplam Talep</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold">
                  {tickets.filter(t => t.status === 'CLOSED').length}
                </div>
                <div className="text-xs text-muted-foreground">Çözülen</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-8">
          <TabsTrigger value="tickets">Destek Talepleri</TabsTrigger>
          <TabsTrigger value="create">Yeni Talep Oluştur</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card/30 p-4 rounded-xl border border-border/50 backdrop-blur-sm">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Talep ID veya başlık ara..." 
                className="pl-9 bg-background/50 border-border/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Toplam <span className="font-medium text-foreground">{filteredTickets.length}</span> talep listeleniyor
            </div>
          </div>

          {/* Tickets List */}
          <div className="grid gap-4">
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => {
                const StatusIcon = getStatusIcon(ticket.status);
                return (
                  <Link href={`/support/${ticket.id}`} key={ticket.id}>
                    <Card className="group hover:shadow-lg hover:border-primary/20 transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/50">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                          {/* Status Icon */}
                          <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                            ticket.status === 'OPEN' ? "bg-blue-500/10 text-blue-500" :
                            ticket.status === 'REPLIED' ? "bg-yellow-500/10 text-yellow-500" :
                            ticket.status === 'CLOSED' ? "bg-green-500/10 text-green-500" :
                            "bg-gray-500/10 text-gray-500"
                          )}>
                            <StatusIcon className="w-6 h-6" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                                {ticket.title}
                              </h3>
                              <Badge variant="outline" className={cn("border", getStatusColor(ticket.status))}>
                                {getStatusText(ticket.status)}
                              </Badge>
                              <Badge variant="secondary" className="text-xs bg-muted/50">
                                #{ticket.id.substring(0, 8)}
                              </Badge>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-primary/50" />
                                {ticket.category?.name || "Genel"}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                {formatDate(ticket.createdAt)}
                              </div>
                            </div>
                          </div>

                          {/* Arrow */}
                          <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-background/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <ChevronRight className="w-5 h-5" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })
            ) : (
              <Card className="bg-card/50 backdrop-blur-sm border-border/50 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
                    <Search className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Talep Bulunamadı</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                      {searchTerm 
                        ? 'Arama kriterlerinize uygun destek talebi bulunamadı.'
                        : 'Henüz hiç destek talebi oluşturmadınız.'
                      }
                    </p>
                    {!searchTerm && (
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveTab("create")}
                        className="mt-4"
                      >
                        İlk Talebini Oluştur
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="create">
          <CreateTicket categories={categories} onTicketCreated={handleTicketCreated} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
