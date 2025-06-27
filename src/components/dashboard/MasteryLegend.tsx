"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { masteryLevels } from '@/lib/mastery';
import { cn } from '@/lib/utils';
import { BookHeart, Info } from 'lucide-react';

const masteryDescriptions = [
    "Cette question est nouvelle ou a reçu une réponse incorrecte. Elle apparaîtra lors de votre prochaine session d'étude.",
    "Vous commencez à l'apprendre. Elle réapparaîtra dans 2 sessions pour renforcer votre mémoire.",
    "Vous vous familiarisez avec cette notion. Elle réapparaîtra dans 4 sessions.",
    "Vous avez une bonne compréhension du sujet. Elle réapparaîtra dans 6 sessions pour assurer une rétention à long terme.",
    "Vous maîtrisez cette question ! Elle réapparaîtra dans 8 sessions pour la garder fraîche dans votre esprit."
];

export function MasteryLegend() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Info className="h-6 w-6 text-accent" />
                    Guide des Niveaux de Maîtrise
                </CardTitle>
                <CardDescription>
                    Votre niveau de maîtrise pour chaque question est basé sur le principe de la répétition espacée.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {masteryLevels.map((mastery, index) => (
                        <li key={mastery.level} className="flex flex-col sm:flex-row items-start gap-3">
                            <span className={cn(
                                "flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap",
                                mastery.className
                            )}>
                                <BookHeart className="h-3.5 w-3.5" />
                                {mastery.level}
                            </span>
                            <p className="text-sm text-muted-foreground mt-0.5 sm:mt-0">
                                {masteryDescriptions[index]}
                            </p>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
