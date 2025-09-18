import { useEffect, useRef } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

interface DetailItem {
  year: string;
  round: string;
  amount: string;
  url?: string;
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  body?: string; // HTML string
  status?: string;
  completed?: string; // HTML string
  details?: DetailItem[];
}

export default function Modal({
  open,
  onClose,
  title,
  body,
  status,
  completed,
  details,
}: ModalProps) {
  const linksContainer = useRef<HTMLDivElement | null>(null);

  // Add target="_blank" to all links inside body/details
  useEffect(() => {
    if (linksContainer.current) {
      const links = linksContainer.current.querySelectorAll("a");
      links.forEach((link) => {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      });
    }
  }, [open, body, details]);

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      {/* backdrop */}
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

      {/* modal container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-xl overflow-y-auto max-h-[80vh]">
          {title && (
            <DialogTitle className="text-xl font-bold mb-4">{title}</DialogTitle>
          )}

          <div
            className="prose max-w-none text-sm"
            ref={linksContainer}
          >
            {/* body text (HTML) */}
            {body && (
              <p
                dangerouslySetInnerHTML={{ __html: body || "" }}
                className="mb-4"
              />
            )}

            {/* details table */}
            {details && details.length > 0 && (
              <table className="table-auto w-full border mb-4 text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-2 border">Year</th>
                    <th className="p-2 border">Round</th>
                    <th className="p-2 border">Amount</th>
                    <th className="p-2 border"></th>
                  </tr>
                </thead>
                <tbody>
                  {details.map((item, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-2">{item.year}</td>
                      <td className="p-2">{item.round}</td>
                      <td className="p-2">
                        {item.amount === "0.00"
                          ? "Undisclosed"
                          : `$${item.amount}`}
                      </td>
                      <td className="p-2 text-center">
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Details
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* status badge */}
            {status && (
              <p className="mb-4">
                {status === "Overdue" && (
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                    {status}
                  </span>
                )}
                {status === "In Progress" && (
                  <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs">
                    {status}
                  </span>
                )}
                {status === "Completed" && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                    {status}
                  </span>
                )}
                {status === "Delivered" && (
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                    {status}
                  </span>
                )}
              </p>
            )}

            {/* completed/deliverable content */}
            {status === "Completed" && completed && (
              <div className="mt-4">
                <p className="font-semibold">Completion update</p>
                <span
                  dangerouslySetInnerHTML={{ __html: completed }}
                  className="text-sm break-words"
                />
              </div>
            )}

            {status === "Delivered" && completed && (
              <div className="mt-4">
                <p className="font-semibold">Deliverables</p>
                <span
                  dangerouslySetInnerHTML={{ __html: completed }}
                  className="text-sm break-words"
                />
              </div>
            )}
          </div>

          {/* footer */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-md bg-blue-600 text-white px-4 py-2"
            >
              Close
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
