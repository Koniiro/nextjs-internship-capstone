"use client";

import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { useState } from 'react';


interface TanstackProviderProps{
    children:React.ReactNode;
}

export const TanstackProvider = ({children}:TanstackProviderProps) =>{
    const [queryClient]=useState(()=>new QueryClient());
    return <QueryClientProvider client ={queryClient}>{children}</QueryClientProvider>
}
