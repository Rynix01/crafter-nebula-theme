"use client";

import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  FileText,
  Calendar,
  User,
  ArrowRight,
  Clock,
  ClipboardList,
} from "lucide-react";
import { staffFormService } from "@/lib/api/services/staffFormService";
import { StaffForm } from "@/lib/types/staff-form";
import Title from "../ui/title";
import { useRouter } from "next/navigation";
import MyApplications from "./my-applications";
import { AuthContext } from "@/lib/context/AuthContext";

export default function StaffForms() {
  const staffFormServiceInstance = staffFormService();
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  const [forms, setForms] = useState<StaffForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("forms");
  const router = useRouter();

  if(!isAuthenticated && !isLoading) {
    router.push("/auth/sign-in?return=/staff-forms");
    return null;
  }

  useEffect(() => {
    const fetchForms = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await staffFormServiceInstance.getForms();
        setForms(data);
      } catch (error) {
        console.error("Error fetching staff forms:", error);
        setError("Başvuru formları yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  const filteredForms = forms.filter(
    (form) =>
      form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFormClick = (formSlug: string) => {
    router.push(`/staff-forms/${formSlug}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">
              Başvuru formları yükleniyor...
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
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-card border border-border/50 shadow-2xl shadow-primary/5">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5" />
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        
        <div className="relative px-8 py-16 flex flex-col md:flex-row items-center justify-between gap-8 z-10">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 text-sm font-medium">
              <User className="w-4 h-4" />
              <span>Kariyer & Ekip</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              Başvuru Formları
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              Ekibimize katılmak için açık pozisyonları inceleyin ve başvurunuzu hemen gönderin. Sizi aramızda görmek için sabırsızlanıyoruz!
            </p>
          </div>

          <div className="relative shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center animate-pulse">
              <FileText className="w-16 h-16 md:w-20 md:h-20 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-2 p-1 bg-muted/50 backdrop-blur-sm rounded-full">
            <TabsTrigger 
              value="forms" 
              className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Mevcut Formlar</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="applications" 
              className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                <span>Başvurularım</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Forms Tab */}
        <TabsContent value="forms" className="space-y-8">
          {/* Search Section */}
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              placeholder="Form ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-card/50 backdrop-blur-sm border-border/50 focus:ring-2 focus:ring-purple-500/20 transition-all rounded-xl"
            />
          </div>

          {/* Forms Grid */}
          {filteredForms.length === 0 ? (
            <div className="text-center py-16 bg-card/30 rounded-3xl border border-border/50 border-dashed">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">Form bulunamadı</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                {searchQuery
                  ? "Arama kriterlerinize uygun form bulunamadı."
                  : "Henüz aktif başvuru formu bulunmuyor."}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredForms.map((form) => (
                <Card
                  key={form.id}
                  className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer rounded-2xl"
                  onClick={() => handleFormClick(form.slug)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500" />
                  
                  <CardHeader className="pb-4 relative z-10">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <CardTitle className="text-xl font-bold group-hover:text-purple-600 transition-colors">
                          {form.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 text-sm">
                          {form.description}
                        </CardDescription>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <ArrowRight className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="relative z-10">
                    <div className="space-y-4">
                      <Separator className="bg-border/50" />
                      
                      {/* Form Stats */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-full">
                          <FileText className="h-3.5 w-3.5" />
                          <span>{form.inputs.length} alan</span>
                        </div>
                        <div className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-full">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{formatDate(form.createdAt)}</span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center justify-between pt-2">
                        <Badge
                          variant={form.isActive ? "default" : "secondary"}
                          className={form.isActive ? "bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20" : ""}
                        >
                          {form.isActive ? "Aktif" : "Pasif"}
                        </Badge>

                        <span className="text-xs font-medium text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                          Başvuru Yap &rarr;
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Info Section */}
          {forms.length > 0 && (
            <div className="mt-16 pt-12 border-t border-border/50">
              <div className="max-w-4xl mx-auto text-center space-y-12">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">
                    Başvuru Süreci Nasıl İşler?
                  </h3>
                  <p className="text-muted-foreground">
                    Başvurunuzu tamamlamanız için izlemeniz gereken adımlar
                  </p>
                </div>
                
                <div className="grid gap-8 md:grid-cols-3">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex flex-col items-center gap-4 p-6 rounded-2xl bg-card/50 border border-border/50 hover:border-purple-500/50 transition-colors">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 font-bold text-xl">
                        1
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Formu İnceleyin</h4>
                        <p className="text-sm text-muted-foreground">Size uygun pozisyonu seçin ve detayları okuyun</p>
                      </div>
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex flex-col items-center gap-4 p-6 rounded-2xl bg-card/50 border border-border/50 hover:border-purple-500/50 transition-colors">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 font-bold text-xl">
                        2
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Bilgileri Doldurun</h4>
                        <p className="text-sm text-muted-foreground">İstenen bilgileri eksiksiz ve doğru şekilde girin</p>
                      </div>
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex flex-col items-center gap-4 p-6 rounded-2xl bg-card/50 border border-border/50 hover:border-purple-500/50 transition-colors">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 font-bold text-xl">
                        3
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Başvuruyu Gönderin</h4>
                        <p className="text-sm text-muted-foreground">Başvurunuzu onaylayın ve sonucu bekleyin</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications">
          <MyApplications />
        </TabsContent>
      </Tabs>
    </div>
  );
}
