"use client";

import React, { useState, useRef } from "react";
import useSWR, { mutate } from "swr";
import { dataClient } from "@/lib/dataClient";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Badge from "@/components/ui/Badge";
import { BatchStatus } from "@prisma/client";

const BatchRow = ({ batch }: { batch: any }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      await dataClient.analyzeBatch(batch.id);
      mutate("/api/batches");
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const statusVariants: Record<BatchStatus, any> = {
    PENDING: "neutral",
    PROCESSING: "warning",
    DONE: "success",
    ERROR: "danger",
  };

  return (
    <tr className="border-b border-[#F1F5F9] last:border-0">
      <td className="py-4 px-4">
        <div className="font-bold text-[#1E293B]">{batch.name}</div>
        <div className="text-xs text-[#94A3B8]">{new Date(batch.uploadedAt).toLocaleString()}</div>
      </td>
      <td className="py-4 px-4 text-center">
        <div className="text-sm font-bold text-[#1E293B]">{batch.rowCount}</div>
        <div className="text-[10px] text-[#94A3B8] uppercase font-bold">Total</div>
      </td>
      <td className="py-4 px-4 text-center">
        <div className="text-sm font-bold text-[#10B981]">{batch.processedCount}</div>
        <div className="text-[10px] text-[#94A3B8] uppercase font-bold">Done</div>
      </td>
      <td className="py-4 px-4 text-center">
        <div className="text-sm font-bold text-[#EF4444]">{batch.errorCount}</div>
        <div className="text-[10px] text-[#94A3B8] uppercase font-bold">Errors</div>
      </td>
      <td className="py-4 px-4 text-center">
        <Badge variant={statusVariants[batch.status as BatchStatus]}>{batch.status}</Badge>
      </td>
      <td className="py-4 px-4 text-right">
        {batch.status !== "PROCESSING" && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleAnalyze}
            isLoading={isAnalyzing}
            disabled={batch.status === "DONE"}
          >
            {batch.status === "PENDING" ? "Run Analysis" : "Retry Errors"}
          </Button>
        )}
        {batch.status === "PROCESSING" && (
          <div className="flex items-center justify-end gap-2 text-[#00828D] text-sm font-bold">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Processing...
          </div>
        )}
      </td>
    </tr>
  );
};

export default function DataAdminPage() {
  const { data: batches, error, isLoading } = useSWR("/api/batches", () => dataClient.getBatches(), {
    refreshInterval: 5000, // Poll every 5s
  });

  const [isUploading, setIsUploading] = useState(false);
  const [batchName, setBatchName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file || !batchName) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("batchName", batchName);

    try {
      await dataClient.uploadFile(formData);
      setBatchName("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      mutate("/api/batches");
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1E293B]">Data Administration</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Upload New Batch" className="lg:col-span-1 h-fit">
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#64748B] uppercase mb-1">Batch Name</label>
              <input
                type="text"
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                placeholder="e.g. Q1 Support Tickets"
                className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm outline-none focus:border-[#00828D]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#64748B] uppercase mb-1">Select File (CSV/XLSX)</label>
              <input
                type="file"
                ref={fileInputRef}
                accept=".csv,.xlsx,.xls"
                className="w-full text-sm text-[#64748B] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-[#F1F5F9] file:text-[#00828D] hover:file:bg-[#E2E8F0]"
                required
              />
            </div>
            <Button type="submit" className="w-full" isLoading={isUploading}>
              Upload and Parse
            </Button>
          </form>
        </Card>

        <Card title="Upload History" className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                  <th className="pb-3 px-4">Batch Details</th>
                  <th className="pb-3 px-4 text-center">Size</th>
                  <th className="pb-3 px-4 text-center">Processed</th>
                  <th className="pb-3 px-4 text-center">Errors</th>
                  <th className="pb-3 px-4 text-center">Status</th>
                  <th className="pb-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {batches?.map((batch) => (
                  <BatchRow key={batch.id} batch={batch} />
                ))}
                {batches?.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#64748B]">
                      <Icon name="Database" size={40} className="mx-auto mb-2 opacity-20" />
                      <p>No batches uploaded yet.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
