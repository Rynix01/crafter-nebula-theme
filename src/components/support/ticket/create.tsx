"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ticketService } from "@/lib/api/services/ticketService";
import { TicketCategory, CreateTicketDto } from "@/lib/types/ticket";
import { SerializedEditorState } from "lexical";
import Editor00 from "../../blocks/editor-00";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send, PenLine, Tag, MessageSquarePlus, AlertCircle, HelpCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface CreateTicketProps {
  categories: TicketCategory[];
  onTicketCreated: () => void;
}

export default function CreateTicket({ categories, onTicketCreated }: CreateTicketProps) {
  const ticketServiceInstance = ticketService();
  const [newTicket, setNewTicket] = useState({
    title: "",
    categoryId: "",
    message: undefined as SerializedEditorState | undefined,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleCreateTicket = async () => {
    if (!newTicket.title || !newTicket.categoryId || !newTicket.message) {
      return;
    }

    try {
      setSubmitting(true);
      
      const createTicketDto: CreateTicketDto = {
        title: newTicket.title,
        categoryId: newTicket.categoryId,
        message: newTicket.message,
      };

      await ticketServiceInstance.createTicket({ ticket: createTicketDto });
      
      // Form'u temizle
      setNewTicket({
        title: "",
        categoryId: "",
        message: undefined,
      });
      
      onTicketCreated(); // Parent component'e bildir
    } catch (error) {
      console.error("Error creating ticket:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditorChange = (value: SerializedEditorState) => {
    setNewTicket({ ...newTicket, message: value });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-fuchsia-500/5 pointer-events-none" />
          
          <CardHeader className="relative border-b border-border/50 bg-muted/20 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <MessageSquarePlus className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Yeni Destek Talebi</CardTitle>
                <CardDescription>
                  Sorununuzu detaylı bir şekilde açıklayarak bize iletin.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="relative p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <Label htmlFor="title" className="text-sm font-medium flex items-center gap-2">
                  <PenLine className="w-3.5 h-3.5 text-muted-foreground" />
                  Başlık
                </Label>
                <Input
                  id="title"
                  placeholder="Örn: Ödeme sorunu yaşıyorum"
                  value={newTicket.title}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, title: e.target.value })
                  }
                  className="bg-background/50 border-border/50 focus:ring-primary/20 h-11"
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="category" className="text-sm font-medium flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                  Kategori
                </Label>
                <Select
                  value={newTicket.categoryId}
                  onValueChange={(value) =>
                    setNewTicket({ ...newTicket, categoryId: value })
                  }
                >
                  <SelectTrigger className="bg-background/50 border-border/50 h-11">
                    <SelectValue placeholder="Kategori seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((cat) => cat.isActive)
                      .sort((a, b) => a.order - b.order)
                      .map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: category.color || 'currentColor' }}
                            />
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="message" className="text-sm font-medium flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
                Mesajınız
              </Label>
              <div className="min-h-[300px] rounded-xl border border-border/50 bg-background/50 overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <Editor00
                  editorSerializedState={newTicket.message}
                  onSerializedChange={handleEditorChange}
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={handleCreateTicket}
                disabled={
                  !newTicket.title ||
                  !newTicket.categoryId ||
                  !newTicket.message ||
                  submitting
                }
                size="lg"
                className="w-full md:w-auto min-w-[160px] shadow-lg shadow-primary/20"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Oluşturuluyor...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Talebi Gönder
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="bg-blue-500/5 border-blue-500/20 shadow-sm">
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-blue-500">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-semibold">Dikkat Edilmesi Gerekenler</h3>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>Talebinizi oluştururken mümkün olduğunca detaylı bilgi verin.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>Ekran görüntüsü veya video linkleri eklemek çözüm sürecini hızlandırır.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>Yetkililerimiz en kısa sürede size dönüş yapacaktır, lütfen sabırlı olun.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Sıkça Sorulan Sorular</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              <div className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="text-sm font-medium mb-1">Ödeme yaptım ama kredim gelmedi?</div>
                <div className="text-xs text-muted-foreground">Genellikle 5-10 dakika içinde yüklenir. Gelmezse ödeme dekontu ile talep açın.</div>
              </div>
              <div className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="text-sm font-medium mb-1">Şifremi unuttum?</div>
                <div className="text-xs text-muted-foreground">Giriş sayfasındaki "Şifremi Unuttum" bağlantısını kullanabilirsiniz.</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
