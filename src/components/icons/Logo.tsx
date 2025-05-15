import type { SVGProps } from 'react';
import { BrainCircuit } from 'lucide-react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return <BrainCircuit {...props} />;
}
