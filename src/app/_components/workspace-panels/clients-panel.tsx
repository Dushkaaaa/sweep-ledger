import { useMemo, useState } from "react";
import type {
  ClientOrder,
  Employee,
  NewClientOrderInput,
} from "../../_data/employees";
import type { CabinetCopy } from "../employees-section-copy";

export function ClientsPanel({
  copy,
  employees,
  orders,
  isSaving,
  onBack,
  onCreateOrder,
  onDeleteOrder,
  onToggleCompleted,
  onToggleTransferred,
}: {
  copy: CabinetCopy;
  employees: Employee[];
  orders: ClientOrder[];
  isSaving: boolean;
  onBack: () => void;
  onCreateOrder: (order: NewClientOrderInput) => void;
  onDeleteOrder: (orderId: string) => void;
  onToggleCompleted: (orderId: string) => void;
  onToggleTransferred: (orderId: string) => void;
}) {
  const initialFormState: NewClientOrderInput = {
    orderDate: new Date().toISOString().slice(0, 10),
    firstName: "",
    lastName: "",
    street: "",
    notes: "",
    assignedEmployeeId: "",
  };

  const [form, setForm] = useState<NewClientOrderInput>(initialFormState);
  const [isTableView, setIsTableView] = useState(true);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.firstName.trim() || !form.lastName.trim()) {
      return;
    }

    onCreateOrder({
      ...form,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      street: form.street.trim(),
      notes: form.notes.trim(),
      assignedEmployeeId: form.assignedEmployeeId,
    });
    setForm(initialFormState);
  }

  const sortedOrders = useMemo(() => {
    return [...orders].sort((left, right) => {
      const leftDate = new Date(left.orderDate).getTime();
      const rightDate = new Date(right.orderDate).getTime();

      return rightDate - leftDate;
    });
  }, [orders]);

  return (
    <section className="rounded-4xl border border-slate-200/70 bg-white/90 p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          {copy.backToMenu}
        </button>
      </div>

      <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
        {copy.clientsTitle}
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
        {copy.clientsDescription}
      </p>

      <div className="mt-5 space-y-6">
        <form
          className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              <span>{copy.orderDate}</span>
              <input
                type="date"
                value={form.orderDate}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    orderDate: event.target.value,
                  }))
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              <span>{copy.firstName}</span>
              <input
                type="text"
                value={form.firstName}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    firstName: event.target.value,
                  }))
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0"
                placeholder={copy.firstName}
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              <span>{copy.lastName}</span>
              <input
                type="text"
                value={form.lastName}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    lastName: event.target.value,
                  }))
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0"
                placeholder={copy.lastName}
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              <span>{copy.assignedEmployee}</span>
              <select
                value={form.assignedEmployeeId}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    assignedEmployeeId: event.target.value,
                  }))
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0"
              >
                <option value="">{copy.selectEmployee}</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              <span>{copy.street}</span>
              <input
                type="text"
                value={form.street}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    street: event.target.value,
                  }))
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0"
                placeholder={copy.street}
              />
            </label>
          </div>

          <label className="mt-4 flex flex-col gap-2 text-sm font-medium text-slate-700">
            <span>{copy.additionalNotes}</span>
            <textarea
              value={form.notes}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  notes: event.target.value,
                }))
              }
              rows={3}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0"
              placeholder={copy.additionalNotes}
            />
          </label>

          <button
            type="submit"
            disabled={
              isSaving || !form.firstName.trim() || !form.lastName.trim()
            }
            className="mt-5 inline-flex items-center justify-center rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {copy.saveClientOrder}
          </button>
        </form>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {copy.clientListTitle}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {copy.clientListSubtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsTableView((current) => !current)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
            >
              {isTableView ? copy.listViewLabel : copy.tableViewLabel}
            </button>
          </div>

          {sortedOrders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-center">
              <p className="text-sm font-semibold text-slate-900">
                {copy.clientsEmptyTitle}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {copy.clientsEmptyDescription}
              </p>
            </div>
          ) : isTableView ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="grid grid-cols-[1fr_1.3fr_1.2fr_1fr_1fr_1fr] gap-2 border-b border-slate-200 bg-slate-50 px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-700">
                <span>{copy.orderDate}</span>
                <span>{copy.clientName}</span>
                <span>{copy.street}</span>
                <span>{copy.assignedEmployee}</span>
                <span>{copy.completed}</span>
                <span></span>
              </div>

              {sortedOrders.map((order) => {
                const assignedEmployee = employees.find(
                  (employee) => employee.id === order.assignedEmployeeId,
                );

                return (
                  <div
                    key={order.id}
                    className="grid grid-cols-[1fr_1.3fr_1.2fr_1fr_1fr_1fr] gap-2 border-b border-slate-100 px-3 py-3 text-sm text-slate-600 last:border-b-0"
                  >
                    <span className="font-medium text-slate-700">
                      {order.orderDate}
                    </span>
                    <span>{`${order.firstName} ${order.lastName}`}</span>
                    <span>{order.street || "—"}</span>
                    <span>
                      {assignedEmployee ? assignedEmployee.name : "—"}
                    </span>
                    <span>{order.isCompleted ? "✓" : "—"}</span>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onToggleCompleted(order.id)}
                        className="rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700"
                      >
                        {order.isCompleted
                          ? copy.completed
                          : copy.markCompleted}
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleTransferred(order.id)}
                        className="rounded-lg border border-sky-200 bg-sky-50 px-2 py-1 text-xs font-semibold text-sky-700"
                      >
                        {order.isTransferred
                          ? copy.transferred
                          : copy.markTransferred}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteOrder(order.id)}
                        className="rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700"
                      >
                        {copy.deleteOrder}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {sortedOrders.map((order) => {
                const assignedEmployee = employees.find(
                  (employee) => employee.id === order.assignedEmployeeId,
                );

                return (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {order.firstName} {order.lastName}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {order.orderDate} • {order.street || "—"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => onToggleCompleted(order.id)}
                          className="rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700"
                        >
                          {order.isCompleted
                            ? copy.completed
                            : copy.markCompleted}
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggleTransferred(order.id)}
                          className="rounded-lg border border-sky-200 bg-sky-50 px-2 py-1 text-xs font-semibold text-sky-700"
                        >
                          {order.isTransferred
                            ? copy.transferred
                            : copy.markTransferred}
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteOrder(order.id)}
                          className="rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700"
                        >
                          {copy.deleteOrder}
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">
                        {assignedEmployee ? assignedEmployee.name : "—"}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">
                        {order.isCompleted
                          ? copy.completed
                          : copy.pendingStatus}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">
                        {order.isTransferred
                          ? copy.transferred
                          : copy.notTransferredStatus}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {order.notes.trim() ? order.notes : copy.noNotes}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
