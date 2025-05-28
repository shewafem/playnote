"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import ChordElement from "@/components/chords/chord-element";
import { LearnedPositionWithChordDetails } from "./student-info";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

interface LearnedChordsTableProps {
  learnedPositions: LearnedPositionWithChordDetails[];
}

interface GroupedLearnedChord {
  chordId: number;
  key: string;
  suffix: string;
  fullName: string;
  positions: LearnedPositionWithChordDetails[];
}

type SortKey = "chordKey" | "chordSuffix" | "none";
type SortDirection = "asc" | "desc";

export default function LearnedChordsTable({ learnedPositions }: LearnedChordsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("chordKey");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const groupedAndSortedChords = useMemo(() => {
    const groupedByChord: Record<string, GroupedLearnedChord> = {};
    learnedPositions.forEach((pos) => {
      const chordIdentifier = `${pos.chord.key}-${pos.chord.suffix}-${pos.chord.id}`;
      if (!groupedByChord[chordIdentifier]) {
        groupedByChord[chordIdentifier] = {
          chordId: pos.chord.id,
          key: pos.chord.key,
          suffix: pos.chord.suffix,
          fullName: `${pos.chord.key} ${pos.chord.suffix}`.toLowerCase(),
          positions: [],
        };
      }
      groupedByChord[chordIdentifier].positions.push(pos);
    });

    let items: GroupedLearnedChord[] = Object.values(groupedByChord);

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase().trim();
      if (lowerSearchTerm) {
        items = items.filter(
          (group) => group.fullName.includes(lowerSearchTerm)
        );
      }
    }

    if (sortKey !== "none") {
      items.sort((a, b) => {
        let valA: string = "";
        let valB: string = "";

        if (sortKey === "chordKey") {
          valA = a.key;
          valB = b.key;
        } else if (sortKey === "chordSuffix") {
          valA = a.suffix;
          valB = b.suffix;
        }
        if (valA < valB) return sortDirection === "asc" ? -1 : 1;
        if (valA > valB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    items.forEach(group => {
        group.positions.sort((p1, p2) => p1.baseFret - p2.baseFret);
    });

    return items;
  }, [learnedPositions, searchTerm, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  if (!learnedPositions || learnedPositions.length === 0) {
    return <p className="text-muted-foreground">Вы еще не выучили ни одного аккорда.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Поиск по аккорду..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("chordKey")}
                >
                  Аккорд
                  {sortKey === 'chordKey' && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
              </TableHead>
              <TableHead>Выученные позиции</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupedAndSortedChords.length > 0 ? (
              groupedAndSortedChords.map((group) => (
                <TableRow key={group.chordId}>
                  <TableCell className="font-medium text-center align-top pt-4">
                    {group.key} {group.suffix}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-4">
                      {group.positions.map((pos, posIndex) => (
                        <div key={pos.id} className="w-32 md:w-40">
                          <ChordElement
                            position={pos}
                            chordKey={group.key}
                            suffix={group.suffix}
                            posIndex={posIndex}
                            isInitiallyLearned={true}
                          />
                        </div>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center">
                  Ничего не найдено.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}