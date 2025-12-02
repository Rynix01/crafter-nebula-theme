"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { staffFormService } from "@/lib/api/services/staffFormService";
import { StaffFormApplication } from "@/lib/types/staff-form";
import Title from "../ui/title";
import { useRouter } from "next/navigation";

export default function MyApplications() {
  const staffFormServiceInstance = staffFormService();
  const [applications, setApplications] = useState<StaffFormApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await staffFormServiceInstance.getMyApplications();
        setApplications(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
        setError("Başvurularınız yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="default" className="bg-green-500">Onaylandı</Badge>;
      case "rejected":
        return <Badge variant="destructive">Reddedildi</Badge>;
      case "pending":
        return <Badge variant="secondary">Beklemede</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  if (loading) {
    return (
      <div className="container px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">
              Başvurularınız yükleniyor...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Applications List */}
      {applications.length === 0 ? (
        <div className="text-center py-16 bg-card/30 rounded-3xl border border-border/50 border-dashed">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2">Henüz başvuru yapmadınız</h3>
          <p className="text-muted-foreground max-w-sm mx-auto mb-6">
            Aktif pozisyonlar için başvuru yaparak ekibimizin bir parçası olabilirsiniz.
          </p>
          <Button 
            onClick={() => router.push("/staff-forms")}
            className="rounded-full px-8"
          >
            Başvuru Formlarını Görüntüle
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {applications.map((application) => (
            <Card key={application.id} className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="border-b border-border/50 bg-muted/20">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      {application.form?.title || "Bilinmeyen Form"}
                      <Badge variant="outline" className="text-xs font-normal">
                        ID: {application.id}
                      </Badge>
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDate(application.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Son Güncelleme: {formatDate(application.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(application.status)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Status Message */}
                  {application.status === "pending" && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-600">
                      <Clock className="h-5 w-5 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Başvurunuz İnceleniyor</p>
                        <p className="text-sm opacity-90">
                          Başvurunuz yetkili ekibimiz tarafından incelenmektedir. Bu süreç genellikle 1-3 iş günü sürmektedir.
                        </p>
                      </div>
                    </div>
                  )}

                  {application.status === "approved" && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600">
                      <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Tebrikler! Başvurunuz Onaylandı</p>
                        <p className="text-sm opacity-90">
                          Başvurunuz kabul edilmiştir. Ekibimiz en kısa sürede sizinle iletişime geçecektir.
                        </p>
                      </div>
                    </div>
                  )}

                  {application.status === "rejected" && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600">
                      <XCircle className="h-5 w-5 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Başvurunuz Onaylanmadı</p>
                        <p className="text-sm opacity-90">
                          Maalesef başvurunuz şu an için olumlu değerlendirilemedi. İlerleyen zamanlarda tekrar başvurabilirsiniz.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Form Values Preview */}
                  {application.values.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Gönderilen Bilgiler</h4>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {application.values.slice(0, 6).map((value, index) => (
                          <div key={index} className="p-3 rounded-lg bg-background/50 border border-border/50">
                            <p className="text-xs text-muted-foreground mb-1">
                              {value.inputId}
                            </p>
                            <p className="text-sm font-medium truncate">
                              {value.value}
                            </p>
                          </div>
                        ))}
                      </div>
                      {application.values.length > 6 && (
                        <p className="text-xs text-muted-foreground text-center">
                          ve {application.values.length - 6} diğer alan...
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
