import { FolderKanban } from "lucide-react";

export default function ProyectosPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-nx-text tracking-tight flex items-center gap-3">
        <FolderKanban className="h-6 w-6 text-nx-primary" />
        Proyectos
      </h1>
      <p className="text-sm text-nx-text-muted mt-1">
        Solar FV, BESS, bancos de capacitores, VFDs, LED y migración al MEM.
      </p>
      <div className="mt-12 flex items-center justify-center rounded-xl border border-dashed border-nx-border py-20">
        <p className="text-sm text-nx-text-muted">Módulo en desarrollo — próximamente</p>
      </div>
    </div>
  );
}
