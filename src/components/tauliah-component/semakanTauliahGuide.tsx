import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@components/components/ui/card";

export default function SemakanTauliahGuide() {
  return (
    <Card className="mt-10 mb-7 bg-gradient-to-r from-gray-50 to-slate-50 border-gray-100">
      <CardHeader>
        <CardTitle className="text-lg">Panduan Penghantaran Borang</CardTitle>
        <CardDescription>
          Ikuti langkah-langkah berikut untuk melengkapkan proses penghantaran
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            {
              step: 1,
              title: "Semak Semua Borang",
              desc: "Pastikan semua borang telah disemak dan dilengkapkan dengan maklumat yang betul."
            },
            {
              step: 2,
              title: "Tandatangan Borang",
              desc: "Setelah semua borang disemak, tandatangani borang untuk mengesahkan maklumat."
            },
            {
              step: 3,
              title: "Hantar Borang",
              desc: 'Klik butang "Hantar Borang" untuk menghantar borang yang telah lengkap.'
            }
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex items-start gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-medium text-sm">
                {step}
              </div>
              <div>
                <h3 className="font-medium">{title}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-gray-500">
          Jika anda menghadapi sebarang masalah, sila hubungi pentadbir sistem.
        </p>
      </CardFooter>
    </Card>
  );
}
