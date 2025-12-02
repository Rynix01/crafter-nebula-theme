"use client";

import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { FileText, Calendar, User, CheckCircle, AlertCircle } from "lucide-react";
import { StaffForm, StaffFormApplicationValue, StaffFormInput } from "@/lib/types/staff-form";
import { staffFormService } from "@/lib/api/services/staffFormService";
import Title from "../ui/title";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/lib/context/AuthContext";

interface StaffFormDetailProps {
  form: StaffForm;
}

export default function StaffFormDetail({ form }: StaffFormDetailProps) {
  const staffFormServiceInstance = staffFormService();
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  const [formValues, setFormValues] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  if(!isAuthenticated && !isLoading) {
    router.push("/auth/sign-in?return=/staff-forms");
    return null;
  }

  const handleInputChange = (inputId: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [inputId]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.isActive) {
      setError("Bu form artık aktif değil.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const values: StaffFormApplicationValue[] = Object.entries(formValues).map(([inputId, value]) => ({
        inputId,
        value
      }));

      await staffFormServiceInstance.submitFormApplication(form.id, values);
      setSuccess(true);
      
      // Redirect to main staff forms page after successful submission
      setTimeout(() => {
        router.push("/staff-forms");
      }, 3000);
    } catch (error) {
      console.error("Error submitting application:", error);
      setError("Başvuru gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderInputField = (input: StaffFormInput) => {
    const inputId = input.name;
    const value = formValues[inputId] || "";

    switch (input.type) {
      case "text":
        return (
          <Input
            id={input.index.toString()}
            name={input.name}
            placeholder={`${input.name} giriniz`}
            value={value}
            onChange={(e) => handleInputChange(inputId, e.target.value)}
            required
          />
        );
      
      case "textarea":
        return (
          <Textarea
            id={input.index.toString()}
            name={input.name}
            placeholder={`${input.name} giriniz`}
            value={value}
            onChange={(e) => handleInputChange(inputId, e.target.value)}
            rows={4}
            required
          />
        );

      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={input.index.toString()}
              checked={value === "true"}
              onCheckedChange={(checked) => handleInputChange(inputId, checked ? "true" : "false")}
            />
            <label htmlFor={inputId} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {input.name}
            </label>
          </div>
        );
      
      default:
        return (
          <Input
            id={input.index.toString()}
            name={input.name}
            placeholder={`${input.name} giriniz`}
            value={value}
            onChange={(e) => handleInputChange(inputId, e.target.value)}
            required
          />
        );
    }
  };

  if (success) {
    return (
      <div className="container px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto animate-in zoom-in duration-500">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Başvurunuz Alındı!</h1>
            <p className="text-muted-foreground text-lg">
              <span className="font-semibold text-foreground">{form.title}</span> pozisyonu için başvurunuz başarıyla sistemimize kaydedildi.
            </p>
          </div>
          <div className="p-6 bg-card border border-border/50 rounded-2xl text-sm text-muted-foreground">
            <p>
              Başvurunuz yetkili ekibimiz tarafından incelenecektir. Başvuru durumunuzu "Başvurularım" sayfasından takip edebilirsiniz.
            </p>
          </div>
          <div className="flex justify-center gap-4 pt-4">
            <Button variant="outline" onClick={() => router.push("/staff-forms")}>
              Diğer Formlara Dön
            </Button>
            <Button onClick={() => router.push("/staff-forms?tab=applications")}>
              Başvurularıma Git
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-card border border-border/50 shadow-2xl shadow-primary/5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
        <div className="absolute -left-20 -top-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        
        <div className="relative px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-8 z-10">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 text-sm font-medium">
              <FileText className="w-4 h-4" />
              <span>Başvuru Formu</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              {form.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {form.description}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form Details Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/50">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-primary" />
                Form Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/50">
                <span className="text-sm text-muted-foreground">Durum</span>
                <Badge variant={form.isActive ? "default" : "secondary"} className={form.isActive ? "bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20" : ""}>
                  {form.isActive ? "Aktif" : "Pasif"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/50">
                <span className="text-sm text-muted-foreground">Soru Sayısı</span>
                <span className="text-sm font-bold">{form.inputs.length}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/50">
                <span className="text-sm text-muted-foreground">Oluşturulma</span>
                <span className="text-sm font-medium">{formatDate(form.createdAt)}</span>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-primary" />
                  Önemli Bilgilendirme
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Lütfen formu doldururken verdiğiniz bilgilerin doğruluğundan emin olun. Yanlış veya eksik bilgi içeren başvurular değerlendirmeye alınmayacaktır.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Form Area */}
        <div className="lg:col-span-2">
          <Card className="border-border/50 bg-card shadow-xl">
            <CardHeader>
              <CardTitle>Başvuru Detayları</CardTitle>
              <CardDescription>
                Aşağıdaki alanları eksiksiz doldurarak başvurunuzu tamamlayın.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6 animate-in slide-in-from-top-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {form.inputs.map((input) => (
                  <div key={input.index} className="space-y-2 group">
                    <label 
                      htmlFor={input.name} 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 group-hover:text-primary transition-colors"
                    >
                      {input.name} <span className="text-red-500">*</span>
                    </label>
                    {renderInputField(input)}
                  </div>
                ))}

                <div className="pt-6">
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all" 
                    disabled={loading || !form.isActive}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <span>Gönderiliyor...</span>
                      </div>
                    ) : (
                      "Başvuruyu Gönder"
                    )}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    Başvuruyu göndererek, verdiğim bilgilerin doğruluğunu kabul ediyorum.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );  return (
    <div className="container px-4 py-8">
      {/* Form Header */}
      <div className="mb-8">
        <Title
          title={form.title}
          description={form.description}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form Details Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Form Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Durum:</span>
                <Badge variant={form.isActive ? "default" : "secondary"}>
                  {form.isActive ? "Aktif" : "Pasif"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Alan Sayısı:</span>
                <span className="text-sm font-medium">{form.inputs.length}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Oluşturulma:</span>
                <span className="text-sm font-medium">{formatDate(form.createdAt)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Başvuru Formu</CardTitle>
              <CardDescription>
                Lütfen tüm alanları eksiksiz olarak doldurunuz.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!form.isActive && (
                <Alert className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Bu form artık aktif değil ve yeni başvuru kabul etmemektedir.
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {form.inputs.map((input, index) => (
                  <div key={input.name} className="space-y-2">
                    <label htmlFor={input.name} className="text-sm font-medium">
                      {input.name}
                      {input.type !== "checkbox" && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {renderInputField(input)}
                  </div>
                ))}

                <Separator />

                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/staff-forms")}
                    disabled={loading}
                  >
                    Geri Dön
                  </Button>
                  
                  <Button
                    type="submit"
                    disabled={!form.isActive || loading}
                    className="min-w-[120px]"
                  >
                    {loading ? "Gönderiliyor..." : "Başvuruyu Gönder"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
