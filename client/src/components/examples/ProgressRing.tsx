import ProgressRing from '../ProgressRing';

export default function ProgressRingExample() {
  return (
    <div className="flex items-center gap-8 p-8">
      <ProgressRing progress={25} size="sm" />
      <ProgressRing progress={50} size="md" />
      <ProgressRing progress={75} size="lg" />
    </div>
  );
}
