import React, { useState } from "react";
import { Plus, Users, Info, Building2, ShieldCheck, Activity } from "lucide-react";

// shadcn/ui components
import { Button } from "@/Components/UI/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/UI/card";
import { Alert, AlertDescription, AlertTitle } from "@/Components/UI/alert";
import { Separator } from "@/Components/UI/separator";

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
    <div className="space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Suppliers
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage vendor relationships, contact details, and payment terms.
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      <Separator className="bg-border/60" />

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Alert className="bg-primary/5 border-primary/10 rounded-2xl">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <AlertTitle className="text-sm font-medium">Compliance</AlertTitle>
          <AlertDescription className="text-xs text-muted-foreground font-medium">
            All registered entities are currently verified.
          </AlertDescription>
        </Alert>

        <Alert className="bg-muted/30 border-border rounded-2xl">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <AlertTitle className="text-sm font-medium">System Status</AlertTitle>
          <AlertDescription className="text-xs text-muted-foreground font-medium">
            Registry synchronized with financial records.
          </AlertDescription>
        </Alert>

        <Alert className="bg-muted/30 border-border rounded-2xl">
          <Users className="h-4 w-4 text-muted-foreground" />
          <AlertTitle className="text-sm font-medium">Audit Log</AlertTitle>
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
      <Card className="border shadow-sm overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg font-semibold">Supplier List</CardTitle>
          <CardDescription>
            View and manage registered suppliers.
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

