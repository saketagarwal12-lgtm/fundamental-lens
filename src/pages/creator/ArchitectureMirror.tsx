import { Workflow } from 'lucide-react';
import { ArchitecturePanels } from '../ArchitecturePanels';

// Creator mirror of the architecture / flywheel / lineage panels — the same surface
// that sits behind the pipeline (Data sources -> ... -> Publish).
export const ArchitectureMirror: React.FC = () => (
  <div className="p-6 page-fade">
    <div className="mb-5">
      <div className="flex items-center gap-2">
        <Workflow size={18} style={{ color: '#2DD4BF' }} />
        <h1 className="t-h1 text-primary-text">Architecture &amp; data flywheel</h1>
      </div>
      <p className="t-lead mt-1">How the pipeline you run fits the wider engine — sealed assessment, expert review, versioned lineage, and point-in-time reproducibility.</p>
    </div>
    <ArchitecturePanels />
  </div>
);
