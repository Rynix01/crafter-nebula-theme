"use client";

import { useState, useEffect, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ticketService } from "@/lib/api/services/ticketService";
import { Ticket, ReplyTicketDto } from "@/lib/types/ticket";
import { lexicalToString } from "@/lib/helpers/lexicalToString";
import { SerializedEditorState } from "lexical";
import { Editor } from "@/components/blocks/editor-00/editor";
import { AuthContext } from "@/lib/context/AuthContext";
import { cn } from "@/lib/utils";
import { 
  Loader2, 
  Send, 
  User as UserIcon, 
  Shield, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MessageCircle,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";

export default function TicketDetail() {
  const ticketServiceInstance = ticketService();
  const params = useParams();
  const router = useRouter();
  const ticketId = params.ticket_id as string;
  const { user, isAuthenticated, isLoading } = useContext(AuthContext);

  if (!isLoading && !isAuthenticated) {
    router.push(`/auth/sign-in?return=/support/${ticketId}`);
  }

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState<SerializedEditorState>({
    root: {
      children: [
        {
          children: [],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "paragraph",
          version: 1,
        },
      ],
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  } as unknown as SerializedEditorState);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (ticketId) {
      loadTicket();
    }
  }, [ticketId]);

  const loadTicket = async () => {
    try {
      setLoading(true);
      const ticketData = await ticketServiceInstance.getTicket({ ticketId });
      setTicket(ticketData);
    } catch (error) {
      console.error("Error loading ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!ticket || !replyContent) return;

    try {
      setSubmitting(true);

      const replyDto: ReplyTicketDto = {
        message: replyContent,
      };

      await ticketServiceInstance.replyToTicket({
        ticketId: ticket.id,
        reply: replyDto,
      });

      setReplyContent({
        root: {
          children: [
            {
              children: [],
              direction: "ltr",
              format: "",
              indent: 0,
              type: "paragraph",
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      } as unknown as SerializedEditorState);

      await loadTicket();
    } catch (error) {
      console.error("Error replying to ticket:", error);
    } finally {
      setSubmitting(false);
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
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold">Talep Bulunamadı</h2>
        <Button variant="outline" onClick={() => router.push('/support')}>
          Geri Dön
        </Button>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(ticket.status);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-card border border-border/50 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-fuchsia-500/5" />
        
        <div className="relative p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2">
                <Link 
                  href="/support" 
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-background/50 hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Link>
                <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
                  #{ticket.id.substring(0, 8)}
                </Badge>
                <Badge variant="outline" className={cn("border", getStatusColor(ticket.status))}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {getStatusText(ticket.status)}
                </Badge>
              </div>
              
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
                  {ticket.title}
                </h1>
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
            </div>

            <div className="flex items-center gap-3 bg-background/30 p-3 rounded-xl border border-border/50 backdrop-blur-sm">
              <Avatar className="h-10 w-10 border border-border/50">
                <AvatarImage src={`https://mc-heads.net/avatar/${ticket.createdByUser?.username || 'Steve'}/256`} />
                <AvatarFallback>
                  <UserIcon className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <div className="font-medium">{ticket.createdByUser?.username || "Kullanıcı"}</div>
                <div className="text-xs text-muted-foreground">Talep Sahibi</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="space-y-6">
        {ticket.messages.map((message, index) => {
          const isMe = message.senderId === user?.id;
          const isStaff = !isMe; // Basit bir varsayım, geliştirilebilir

          return (
            <div 
              key={index} 
              className={cn(
                "flex gap-4 max-w-3xl",
                isMe ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <Avatar className={cn(
                "h-10 w-10 border-2 shrink-0",
                isMe ? "border-primary/20" : "border-violet-500/20"
              )}>
                <AvatarImage src={`https://mc-heads.net/avatar/${message.sender?.username || 'Steve'}/256`} />
                <AvatarFallback>
                  {isStaff ? <Shield className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>

              <div className={cn(
                "flex flex-col gap-1 min-w-0",
                isMe ? "items-end" : "items-start"
              )}>
                <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
                  <span className="font-medium text-foreground">
                    {message.sender?.username || "Bilinmeyen"}
                  </span>
                  {isStaff && (
                    <Badge variant="secondary" className="h-4 px-1 text-[10px] bg-violet-500/10 text-violet-500 border-violet-500/20">
                      Yetkili
                    </Badge>
                  )}
                </div>

                <div className={cn(
                  "rounded-2xl p-4 text-sm shadow-sm border",
                  isMe 
                    ? "bg-primary text-primary-foreground border-primary rounded-tr-none" 
                    : "bg-card border-border/50 rounded-tl-none"
                )}>
                  <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                    {lexicalToString(message.content)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reply Section */}
      {ticket.status !== "CLOSED" ? (
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
          <CardHeader className="bg-muted/30 pb-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Yanıt Yaz</CardTitle>
            </div>
            <CardDescription>
              Sorununuzla ilgili detayları veya eklemek istediklerinizi aşağıya yazabilirsiniz.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="min-h-[200px] border-y border-border/50 bg-background/50">
              <Editor
                editorSerializedState={replyContent}
                onSerializedChange={(value) => setReplyContent(value)}
              />
            </div>
            <div className="p-4 bg-muted/30 flex justify-end">
              <Button
                onClick={handleReply}
                disabled={submitting}
                className="min-w-[140px] shadow-lg shadow-primary/20"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Gönderiliyor
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Yanıtı Gönder
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-muted/30 border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-green-500 mb-2" />
            <h3 className="font-semibold text-lg">Bu talep kapatılmıştır</h3>
            <p className="text-muted-foreground text-sm max-w-md">
              Bu destek talebi çözüme kavuştuğu için yeni yanıtlara kapatılmıştır. 
              Yeni bir sorununuz varsa lütfen yeni bir talep oluşturun.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => router.push('/support')}>
              Destek Merkezine Dön
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
