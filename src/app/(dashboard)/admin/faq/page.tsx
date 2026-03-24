import { cmsRepository } from "@/lib/repositories/cms";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaqForm } from "@/components/admin/FaqForm";
import { CmsDeleteButton } from "@/components/admin/CmsDeleteButton";
import { CmsReorderButtons } from "@/components/admin/CmsReorderButtons";

export default async function AdminFaqPage() {
  const entries = await cmsRepository.findAllFaq();
  const orderedIds = entries.map((e) => e.id);

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Foire aux Questions
        </h1>
        <p className="mt-1 text-muted-foreground">
          {entries.length} question{entries.length > 1 ? "s" : ""}
        </p>
      </div>

      {entries.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Ordre</TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Titre reponse</TableHead>
                <TableHead className="max-w-xs">Contenu</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry, index) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <CmsReorderButtons
                      id={entry.id}
                      orderedIds={orderedIds}
                      index={index}
                      type="faq"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{entry.question}</TableCell>
                  <TableCell className="text-sm">{entry.answerTitle}</TableCell>
                  <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                    {entry.answerContent}
                  </TableCell>
                  <TableCell className="text-right">
                    <CmsDeleteButton id={entry.id} type="faq" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-semibold">Ajouter une question</h2>
        <div className="mt-4 max-w-xl">
          <FaqForm />
        </div>
      </div>
    </>
  );
}
