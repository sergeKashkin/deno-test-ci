import Image from "next/image";
import React from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export default async function Home() {
  const url: string = "http://localhost:3000"
  let data = await fetch(`${url}/candies`);
  let posts: { id: number; title: string; date: string; company: string; }[] = await data.json();
  const IMAGE_DIMENSIONS: number = 150;

  return (
    <div className="flex flex-col h-full">
        <header className="bg-gray-700 text-white p-4">
            E-Shop
        </header>
        <main className="flex-grow p-4">
            <Table>
              <TableCaption>A list of most favorite candies in the world</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Invented At</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map(post => (
                  <TableRow key={post.id} className="cursor-pointer">
                    <HoverCard>
                      
                      <TableCell><HoverCardTrigger>{post.title}</HoverCardTrigger></TableCell>
                      <TableCell>{post.company}</TableCell>
                      <TableCell>{post.date}</TableCell>
                      
                      <HoverCardContent className="shadow-md inline-flex w-auto cursor-default">
                        <Image
                          src={`${url}/images/${post.id}.jpg`}
                          width={IMAGE_DIMENSIONS}
                          height={IMAGE_DIMENSIONS}
                          alt={`${post.title} image`}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                        <section className="flex flex-row gap-12 p-2">
                          <div className="flex flex-col w-fit min-w-20">
                            <div>Title:</div>
                            <div>Invented At:</div>
                            <div>At Year:</div>
                          </div>
                          <div className="flex flex-col w-fit min-w-20">
                            <div>{post.title}</div>
                            <div>{post.company}</div>
                            <div>{post.date}</div>
                          </div>
                        </section>
                      </HoverCardContent>
                    </HoverCard>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </main>
        <footer className="bg-gray-700 text-white p-4">
            Copyright Acme, Israel, 2024
        </footer>
    </div>
  );
}
