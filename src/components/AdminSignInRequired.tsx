import { Key } from 'lucide-react';
import Button from './ui/Button';
import { accountLoginUrl } from '../lib/api';

interface AdminSignInRequiredProps {
    message: string;
}

export default function AdminSignInRequired({ message }: AdminSignInRequiredProps) {
    return (
        <div className="min-h-full flex items-center justify-center p-6">
            <div className="max-w-md text-center">
                <Key className="mx-auto mb-4 text-violet-400" />
                <h1 className="text-xl font-semibold text-zinc-100">Admin sign-in required</h1>
                <p className="mt-2 text-sm text-zinc-500">{message}</p>
                <Button className="mt-5" onClick={() => window.location.assign(accountLoginUrl(window.location.href))}>
                    Continue with CheFu Account
                </Button>
            </div>
        </div>
    );
}
