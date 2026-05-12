import React, { useState } from "react";
import { Plus, Users, Info, Building2, ShieldCheck, Activity } from "lucide-react";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

// Project specific components
import SuppliersList from "./components/SuppliersList";
import AddSuppliersModal from "./components/AddSuppliersModal";

const SupplierPages = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSupplierAdded = (supplierData) => {
    console.log('Synchronizing new entity:', supplierData);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className=" mx-auto py-8 space-y-8 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-widest">
            <Building2 className="w-3.5 h-3.5" />
            Supply Chain Operations
          </div>
          <h1 className="text-3xl font-black tracking-tighter sm:text-4xl">
            Suppliers <span className="text-primary italic">Registry</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Maintain and audit global vendor relationships and payment protocols.
          </p>
        </div>

        <Button 
          onClick={() => setIsModalOpen(true)}
          className="rounded-full px-6 shadow-lg shadow-primary/20 font-bold uppercase text-[11px] tracking-widest h-11"
        >
          <Plus className="w-4 h-4 mr-2" />
          Register New Supplier
        </Button>
      </div>

      <Separator className="bg-border/60" />

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Alert className="bg-primary/5 border-primary/10 rounded-2xl">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <AlertTitle className="text-xs font-bold uppercase tracking-wider">Compliance</AlertTitle>
          <AlertDescription className="text-xs text-muted-foreground font-medium">
            All registered entities are currently verified.
          </AlertDescription>
        </Alert>

        <Alert className="bg-muted/30 border-border rounded-2xl">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <AlertTitle className="text-xs font-bold uppercase tracking-wider">System Status</AlertTitle>
          <AlertDescription className="text-xs text-muted-foreground font-medium">
            Registry synchronized with financial records.
          </AlertDescription>
        </Alert>

        <Alert className="bg-muted/30 border-border rounded-2xl">
          <Users className="h-4 w-4 text-muted-foreground" />
          <AlertTitle className="text-xs font-bold uppercase tracking-wider">Audit Log</AlertTitle>
          <AlertDescription className="text-xs text-muted-foreground font-medium">
            Tracking changes for {refreshKey > 0 ? refreshKey : 'all'} updates today.
          </AlertDescription>
        </Alert>
      </div>

      {/* Info Card - Replacing InfoCard with shadcn Alert */}
      <Alert className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/10 dark:border-blue-900 rounded-2xl">
        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertTitle className="text-sm font-bold text-blue-800 dark:text-blue-300">
          Supplier Database Management
        </AlertTitle>
        <AlertDescription className="text-sm text-blue-700/80 dark:text-blue-400/80 leading-relaxed">
          Maintain a comprehensive database of your suppliers with contact information, payment terms, and status tracking. 
          Suppliers are linked to purchase orders, GRNs, and payments for complete supply chain visibility.
        </AlertDescription>
      </Alert>

      {/* Main List Container */}
      <Card className="rounded-[2rem] border-muted/60 shadow-xl shadow-black/[0.02] overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg font-bold tracking-tight">Active Partners</CardTitle>
          <CardDescription className="text-xs uppercase tracking-widest font-semibold opacity-70">
            Real-time Vendor Master Data
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <SuppliersList key={refreshKey} />
        </CardContent>
      </Card>

      {/* Modals */}
      <AddSuppliersModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSupplierAdded}
      />
    </div>
  );
};

export default SupplierPages;