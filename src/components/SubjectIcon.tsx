import React from "react";
import {
  Activity,
  Bone,
  Dna,
  Microscope,
  Pill,
  Bug,
  Scale,
  Users,
  Eye,
  Ear,
  Stethoscope,
  Scissors,
  Baby,
  Smile,
  Layers,
  Brain,
  Crosshair,
  Scan,
  Wind,
  HelpCircle,
} from "lucide-react";

interface SubjectIconProps {
  name: string;
  className?: string;
}

export const SubjectIcon: React.FC<SubjectIconProps> = ({ name, className = "w-5 h-5" }) => {
  switch (name) {
    case "Bone":
      return <Bone className={className} />;
    case "Activity":
      return <Activity className={className} />;
    case "Dna":
      return <Dna className={className} />;
    case "Microscope":
      return <Microscope className={className} />;
    case "Pill":
      return <Pill className={className} />;
    case "Bug":
      return <Bug className={className} />;
    case "Scale":
      return <Scale className={className} />;
    case "Users":
      return <Users className={className} />;
    case "Eye":
      return <Eye className={className} />;
    case "Ear":
      return <Ear className={className} />;
    case "Stethoscope":
      return <Stethoscope className={className} />;
    case "Scissors":
      return <Scissors className={className} />;
    case "Baby":
      return <Baby className={className} />;
    case "Smile":
      return <Smile className={className} />;
    case "Layers":
      return <Layers className={className} />;
    case "Brain":
      return <Brain className={className} />;
    case "Crosshair":
      return <Crosshair className={className} />;
    case "Scan":
      return <Scan className={className} />;
    case "Wind":
      return <Wind className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
};
