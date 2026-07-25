"use client";

import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Eraser, UploadCloud, Pen } from "lucide-react";

interface SignaturePadProps {
  onSave: (dataUrl: string, type: "DRAW" | "UPLOAD") => void;
  onClear: () => void;
  initialSignature?: string | null;
}

export function SignaturePad({ onSave, onClear, initialSignature }: SignaturePadProps) {
  const padRef = useRef<SignatureCanvas>(null);
  const [activeTab, setActiveTab] = useState<"draw" | "upload">("draw");
  const [uploadedImage, setUploadedImage] = useState<string | null>(initialSignature || null);

  const handleClear = () => {
    if (activeTab === "draw") {
      padRef.current?.clear();
    } else {
      setUploadedImage(null);
    }
    onClear();
  };

  const handleSaveDraw = () => {
    if (padRef.current?.isEmpty()) return;
    const dataUrl = padRef.current?.getTrimmedCanvas().toDataURL("image/png");
    if (dataUrl) {
      onSave(dataUrl, "DRAW");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setUploadedImage(result);
        onSave(result, "UPLOAD");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-sm border rounded-lg overflow-hidden bg-background shadow-sm">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "draw" | "upload")} className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-none border-b h-12">
          <TabsTrigger value="draw" className="flex items-center gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
            <Pen className="w-4 h-4" /> Draw
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
            <UploadCloud className="w-4 h-4" /> Upload
          </TabsTrigger>
        </TabsList>
        
        <div className="p-4 bg-muted/20">
          <TabsContent value="draw" className="mt-0">
            <div className="border bg-white rounded-md overflow-hidden" style={{ height: 160 }}>
              <SignatureCanvas
                ref={padRef}
                canvasProps={{
                  className: "w-full h-full",
                  style: { width: "100%", height: "100%" }
                }}
                onEnd={handleSaveDraw}
                backgroundColor="rgba(255,255,255,1)"
              />
            </div>
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-muted-foreground italic">Sign above</span>
              <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10">
                <Eraser className="w-3 h-3 mr-1" /> Clear
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="mt-0">
            {uploadedImage ? (
              <div className="border bg-white rounded-md h-[160px] flex items-center justify-center relative overflow-hidden group">
                <img src={uploadedImage} alt="Signature" className="max-h-full max-w-full object-contain" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button variant="destructive" size="sm" onClick={handleClear}>
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-md h-[160px] flex flex-col items-center justify-center gap-2 bg-muted/10 transition-colors hover:bg-muted/30">
                <UploadCloud className="w-8 h-8 text-muted-foreground" />
                <Label htmlFor="signature-upload" className="cursor-pointer text-sm font-medium text-primary hover:underline">
                  Click to upload image
                </Label>
                <p className="text-xs text-muted-foreground">PNG, JPG up to 2MB</p>
                <Input 
                  id="signature-upload" 
                  type="file" 
                  accept="image/png, image/jpeg" 
                  className="hidden" 
                  onChange={handleFileUpload}
                />
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
