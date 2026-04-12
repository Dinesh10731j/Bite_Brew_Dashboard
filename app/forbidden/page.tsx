"use client";

import Link from 'next/link';
import { Button } from '@/components/shared/ui/Button';
import { ShieldAlert } from 'lucide-react';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-red-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="w-32 h-32 mx-auto bg-rose-100 rounded-3xl flex items-center justify-center">
          <ShieldAlert className="w-16 h-16 text-rose-500" strokeWidth={1.5} />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl font-black bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent">
            403
          </h1>
          <h2 className="text-3xl font-bold text-slate-900">
            Access Forbidden
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed">
            Your account role doesn&apos;t have permission to access the dashboard.
          </p>
        </div>

        <div className="space-y-3 pt-8">
          <Button variant="primary" className="text-lg px-8 h-14">
            <Link href="/login">Return to Login</Link>
          </Button>
          <p className="text-sm text-slate-500">
            Please contact your administrator if you believe this is an error.
          </p>
        </div>
      </div>
    </div>
  );
}

