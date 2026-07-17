import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";

interface AdminModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AdminModal({ open, onOpenChange }: AdminModalProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === "44774") {
      setLocation("/admin");
      onOpenChange(false);
      setCode("");
      setError("");
    } else {
      setError("Invalid access code");
      setCode("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Admin Access</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Access Code</Label>
            <Input
              id="code"
              type="password"
              placeholder="Enter access code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError("");
              }}
              className="text-center tracking-widest"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
          <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-800">
            Access Admin Panel
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
