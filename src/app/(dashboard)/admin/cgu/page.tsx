import { cmsRepository } from "@/lib/repositories/cms";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CguForm } from "@/components/admin/CguForm";
import { CmsDeleteButton } from "@/components/admin/CmsDeleteButton";
import { CmsReorderButtons } from "@/components/admin/CmsReorderButtons";

export default async function AdminCguPage() {
  const sections = await cmsRepository.findAllCgu();
  const orderedIds = sections.map((s) => s.id);

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Conditions Generales d&apos;Utilisation
        </h1>
        <p className="mt-1 text-muted-foreground">
          {sections.length} section{sections.length > 1 ? "s" : ""}
        </p>
      </div>

      {sections.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Ordre</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead className="max-w-xs">Contenu</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sections.map((section, index) => (
                <TableRow key={section.id}>
                  <TableCell>
                    <CmsReorderButtons
                      id={section.id}
                      orderedIds={orderedIds}
                      index={index}
                      type="cgu"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{section.title}</TableCell>
                  <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                    {section.content}
                  </TableCell>
                  <TableCell className="text-right">
                    <CmsDeleteButton id={section.id} type="cgu" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-semibold">Ajouter une section</h2>
        <div className="mt-4 max-w-xl">
          <CguForm />
        </div>
      </div>
    </>
  );
}
