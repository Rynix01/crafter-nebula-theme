"use client";

import React, { useState } from "react";
import { User, WallMessage } from "@/lib/types/user";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, Reply, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { getUserAvatarUrl } from "@/lib/helpers/getUserAvatarUrl";

interface ProfileWallTabProps {
  user: User;
  currentUser?: User | null;
  wallMessages: WallMessage[];
  onSendMessage: (message: string) => Promise<void>;
  onReplyMessage: (messageId: string, reply: string) => Promise<void>;
}

export function ProfileWallTab({ 
  user, 
  currentUser,
  wallMessages, 
  onSendMessage, 
  onReplyMessage 
}: ProfileWallTabProps) {
  const [newMessage, setNewMessage] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: tr,
    });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      await onSendMessage(newMessage);
      setNewMessage("");
    } catch (err) {
      // Error handling is done in parent
    }
  };

  const handleReplyMessage = async (messageId: string) => {
    if (!replyMessage.trim()) return;
    
    try {
      await onReplyMessage(messageId, replyMessage);
      setReplyMessage("");
      setReplyingTo(null);
    } catch (err) {
      // Error handling is done in parent
    }
  };

  return (
    <Card className="border-border/50 bg-card/50 h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          Duvar Mesajları
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* New Message Input */}
        <div className="flex gap-4">
          <Avatar className="w-10 h-10 border border-border/50">
            <AvatarImage src={getUserAvatarUrl(currentUser)} />
            <AvatarFallback>{currentUser?.username?.substring(0, 2).toUpperCase() || "?"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Bir mesaj bırakın..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="min-h-[80px] bg-background/50 resize-none"
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleSendMessage} 
                disabled={!newMessage.trim()}
                size="sm"
                className="gap-2"
              >
                <Send className="w-4 h-4" />
                Gönder
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {wallMessages && wallMessages.length > 0 ? (
            wallMessages.map((msg) => (
              <div key={msg.id} className="group flex gap-4 p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-accent/50 transition-all duration-300">
                <Avatar className="w-10 h-10 border border-border/50">
                  <AvatarImage src={getUserAvatarUrl(msg.sender)} />
                  <AvatarFallback>{msg.sender.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{msg.sender.username}</span>
                      <span className="text-xs text-muted-foreground">{formatDate(msg.createdAt)}</span>
                    </div>
                    {user.id === msg.sender.id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setReplyingTo(msg.id)}
                      >
                        <Reply className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <p className="text-sm text-foreground/90">{msg.content}</p>

                  {/* Replies */}
                  {msg.replies && msg.replies.length > 0 && (
                    <div className="pl-4 border-l-2 border-border/50 space-y-3 mt-3">
                      {msg.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-3">
                          <Avatar className="w-6 h-6 border border-border/50">
                            <AvatarImage src={getUserAvatarUrl(reply.sender)} />
                            <AvatarFallback>{reply.sender.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{reply.sender.username}</span>
                              <span className="text-[10px] text-muted-foreground">{formatDate(reply.createdAt)}</span>
                            </div>
                            <p className="text-xs text-foreground/80 mt-0.5">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Input */}
                  {replyingTo === msg.id && (
                    <div className="flex gap-3 mt-3 animate-in fade-in slide-in-from-top-2">
                      <div className="flex-1 flex gap-2">
                        <Textarea
                          placeholder="Yanıt yazın..."
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          className="min-h-[60px] bg-background/50 resize-none text-sm"
                        />
                        <div className="flex flex-col gap-2">
                          <Button 
                            size="icon" 
                            onClick={() => handleReplyMessage(msg.id)}
                            disabled={!replyMessage.trim()}
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setReplyingTo(null)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 text-muted-foreground">
              <MessageSquare className="w-12 h-12 opacity-20" />
              <p>Henüz duvar mesajı bulunmuyor.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
