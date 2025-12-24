'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from './Navbar';

interface WrapCardProps {
  data: {
    year: number;
    user: {
      login: string;
      name: string | null;
      avatar_url: string;
      html_url: string;
    };
    stats: {
      repos: number;
      commits: number;
      prs: number;
    };
  };
}

export default function WrapCard({ data }: WrapCardProps) {
  const { user, stats, year } = data;

  const statCards = [
    {
      id: 'prs',
      value: stats.prs,
      label: 'PRs',
    },
    {
      id: 'repos',
      value: stats.repos,
      label: 'Repos',
    },
    {
      id: 'commits',
      value: stats.commits,
      label: 'Commits',
    }
  ];

  return (
    
    <div className="flex items-center justify-center p-4 font-two bg-linear-to-br from-gray-50 to-white">
   
      <div className="max-w-3xl w-auto bg-blue-600 shadow-lg rounded-lg p-6 text-center border border-gray-100">
        <div className="mb-2">
          <div className="inline-block px-4 py-1 text-black rounded-full text-sm font-normal">
            GitHub Wrap {year}
          </div>
        </div>
       
        <div className="flex flex-col items-center mb-2">
          <div className='border border-gray-900 mb-2 px-4 py-4'>
          <img
            src={user.avatar_url}
            alt={user.login}
            className="w-15 h-15 rounded-full border-2  border-white shadow-md"
          />
          </div>
          <h2 className="text-sm font-bold text-gray-900">
            @{user.name || user.login}
          </h2>
          
        </div>

        <div className="grid grid-cols-3 gap-2 mb-2">
          {statCards.map((card) => (
            <div
              key={card.id}
              className="group relative p-4 border border-gray-900 rounded-sm hover:shadow-md transition-all duration-200"
            >
              <div className="relative">
               
                <div className={`text-xl font-bold mb-2`}>
                  {card.value.toLocaleString()}
                </div>

                <div className={`text-sm font-semibold mb-2`}>
                  {card.label}
                </div>
              
              </div>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <div className="text-xs font-semibold text-gray-800">
            mygitwrap.com
          </div>
        </div>

        <div className="mt-4 mb-6 border-t border-gray-400">
          <div className="text-xs text-gray-400">
            <p className="items-center sm:text-right">
              Generated on {new Date().toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}