"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import {
  type ClientOrder,
  type Employee,
  type NewClientOrderInput,
  type NewEmployeeInput,
  type WorkDayKey,
  hasCurrentWeekActivity,
} from "../../_data/employees";

function normalizeClientOrder(order: Partial<ClientOrder>): ClientOrder {
  return {
    id: order.id ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    orderDate: order.orderDate ?? "",
    firstName: order.firstName ?? "",
    lastName: order.lastName ?? "",
    street: order.street ?? "",
    notes: order.notes ?? "",
    assignedEmployeeId: order.assignedEmployeeId ?? null,
    isCompleted: Boolean(order.isCompleted),
    isTransferred: Boolean(order.isTransferred),
  };
}
import { useLanguage } from "../../_i18n/language-provider";
import { supabase } from "@/lib/supabase/client";
import {
  fetchProfile,
  updateOwnerPassword,
  updateProfileLogo,
} from "@/lib/supabase/profiles";
import {
  addEmployeeAdvance,
  closeEmployeeWeek,
  createClientOrderForOwner,
  createEmployeeForOwner,
  deleteClientOrderById,
  deleteEmployeeById,
  fetchClientOrdersForOwner,
  fetchEmployeesForOwner,
  getErrorMessage,
  removeEmployeeAdvance,
  signOutOwner,
  updateClientOrderById,
  updateEmployeeDayHours,
} from "@/lib/supabase/tracker";
import { downloadMonthlyReportPdf } from "../monthly-report-pdf";
import {
  cabinetCopy,
  trackerName,
  type CabinetSection,
} from "../employees-section-copy";
import {
  getPreferredLanguage,
  getSessionCompanyName,
} from "./session-language";
import { getWorkspaceSummary } from "./workspace-summary";

export function useEmployeesWorkspace() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const copy = cabinetCopy[language];
  const [activeSection, setActiveSection] = useState<CabinetSection>("home");
  const [session, setSession] = useState<Session | null>(null);
  const [companyName, setCompanyName] = useState(trackerName);
  const [companyLogoDataUrl, setCompanyLogoDataUrl] = useState<string | null>(
    null,
  );
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [clientOrders, setClientOrders] = useState<ClientOrder[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    null,
  );
  const [isCreatingEmployee, setIsCreatingEmployee] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const selectedEmployee =
    employees.find((employee) => employee.id === selectedEmployeeId) ?? null;

  const summaryStats = useMemo(
    () => getWorkspaceSummary(employees, language),
    [employees, language],
  );

  const loadWorkspace = useCallback(
    async (
      ownerId: string,
      activeSession: Session | null,
      fallbackCompanyName = trackerName,
    ) => {
      const [profile, employeeList, orderList] = await Promise.all([
        fetchProfile(ownerId),
        fetchEmployeesForOwner(ownerId),
        fetchClientOrdersForOwner(ownerId),
      ]);

      setCompanyName(
        profile?.company_name ??
          getSessionCompanyName(activeSession) ??
          fallbackCompanyName,
      );

      const profileLanguage = getPreferredLanguage(
        profile?.preferred_language,
        activeSession,
      );

      if (profileLanguage) {
        setLanguage(profileLanguage);
      }

      setCompanyLogoDataUrl(profile?.logo_data_url ?? null);
      setEmployees(employeeList);
      setClientOrders(orderList.map((order) => normalizeClientOrder(order)));
    },
    [setLanguage],
  );

  const reloadWorkspace = useCallback(
    async (ownerId: string) => {
      setErrorMessage("");
      await loadWorkspace(ownerId, session, trackerName);
    },
    [loadWorkspace, session],
  );

  useEffect(() => {
    let active = true;

    async function initialize() {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (!active) {
        return;
      }

      setSession(currentSession);

      if (!currentSession?.user) {
        setEmployees([]);
        setClientOrders([]);
        setCompanyName(trackerName);
        setCompanyLogoDataUrl(null);
        setIsLoading(false);
        return;
      }

      try {
        await loadWorkspace(
          currentSession.user.id,
          currentSession,
          getSessionCompanyName(currentSession) ?? trackerName,
        );
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);

      if (!nextSession?.user) {
        setEmployees([]);
        setClientOrders([]);
        setSelectedEmployeeId(null);
        setCompanyName(trackerName);
        setCompanyLogoDataUrl(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      void loadWorkspace(
        nextSession.user.id,
        nextSession,
        getSessionCompanyName(nextSession) ?? trackerName,
      )
        .catch((error) => {
          setErrorMessage(getErrorMessage(error));
        })
        .finally(() => {
          setIsLoading(false);
        });
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [loadWorkspace]);

  async function handleDeleteEmployee(employeeId: string) {
    if (!session?.user) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      await deleteEmployeeById(employeeId);
      await reloadWorkspace(session.user.id);
      setSelectedEmployeeId(null);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleCreateEmployee(employee: NewEmployeeInput) {
    if (!session?.user) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      await createEmployeeForOwner(session.user.id, employee);
      await reloadWorkspace(session.user.id);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleCreateClientOrder(order: NewClientOrderInput) {
    if (!session?.user) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      const createdOrder = await createClientOrderForOwner(
        session.user.id,
        order,
      );

      setClientOrders((current) => [createdOrder, ...current]);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggleClientOrderCompletion(orderId: string) {
    const currentOrder = clientOrders.find((order) => order.id === orderId);

    if (!currentOrder) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      const updatedOrder = await updateClientOrderById(orderId, {
        is_completed: !currentOrder.isCompleted,
      });

      setClientOrders((current) =>
        current.map((order) =>
          order.id === orderId ? normalizeClientOrder(updatedOrder) : order,
        ),
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggleClientOrderTransfer(orderId: string) {
    const currentOrder = clientOrders.find((order) => order.id === orderId);

    if (!currentOrder) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      const updatedOrder = await updateClientOrderById(orderId, {
        is_transferred: !currentOrder.isTransferred,
      });

      setClientOrders((current) =>
        current.map((order) =>
          order.id === orderId ? normalizeClientOrder(updatedOrder) : order,
        ),
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteClientOrder(orderId: string) {
    setIsSaving(true);
    setErrorMessage("");

    try {
      await deleteClientOrderById(orderId);
      setClientOrders((current) =>
        current.filter((order) => order.id !== orderId),
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleCloseWeek() {
    if (!session?.user) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      await Promise.all(
        employees
          .filter((employee) => hasCurrentWeekActivity(employee))
          .map((employee) => closeEmployeeWeek(employee)),
      );
      await reloadWorkspace(session.user.id);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDayHoursChange(
    employeeId: string,
    day: WorkDayKey,
    value: number,
  ) {
    if (!session?.user) {
      return;
    }

    const employee = employees.find((item) => item.id === employeeId);

    if (!employee?.currentWeekId) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      await updateEmployeeDayHours(
        employee.currentWeekId,
        day,
        Math.max(0, value),
      );
      await reloadWorkspace(session.user.id);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAddAdvance(
    employeeId: string,
    day: WorkDayKey,
    amount: number,
  ) {
    if (!session?.user) {
      return;
    }

    const employee = employees.find((item) => item.id === employeeId);

    if (!employee?.currentWeekId) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      await addEmployeeAdvance(employee.currentWeekId, day, amount);
      await reloadWorkspace(session.user.id);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleRemoveAdvance(_employeeId: string, advanceId: string) {
    if (!session?.user) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      await removeEmployeeAdvance(advanceId);
      await reloadWorkspace(session.user.id);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSignOut() {
    setIsSaving(true);
    setErrorMessage("");

    try {
      await signOutOwner();
      router.push("/sign-in");
      router.refresh();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDownloadMonthlyReport() {
    await downloadMonthlyReportPdf({
      companyName,
      employees,
      language,
      currency: t.common.currency,
      hoursLabel: t.common.hoursShort,
    });
  }

  async function handleSaveCompanyLogo(logoDataUrl: string | null) {
    setIsSaving(true);
    setErrorMessage("");

    try {
      await updateProfileLogo(logoDataUrl);
      setCompanyLogoDataUrl(logoDataUrl);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      throw error;
    } finally {
      setIsSaving(false);
    }
  }

  async function handleChangePassword(
    currentPassword: string,
    nextPassword: string,
  ) {
    if (!session?.user.email) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: session.user.email,
        password: currentPassword,
      });

      if (signInError) {
        throw signInError;
      }

      await updateOwnerPassword(nextPassword);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      throw error;
    } finally {
      setIsSaving(false);
    }
  }

  return {
    activeSection,
    clientOrders,
    companyLogoDataUrl,
    companyName,
    copy,
    employees,
    errorMessage,
    isCreatingEmployee,
    isLoading,
    isSaving,
    language,
    selectedEmployee,
    session,
    summaryStats,
    t,
    actions: {
      addAdvance: handleAddAdvance,
      changePassword: handleChangePassword,
      closeWeek: handleCloseWeek,
      createClientOrder: handleCreateClientOrder,
      createEmployee: handleCreateEmployee,
      deleteClientOrder: handleDeleteClientOrder,
      deleteEmployee: handleDeleteEmployee,
      downloadMonthlyReport: handleDownloadMonthlyReport,
      removeAdvance: handleRemoveAdvance,
      saveCompanyLogo: handleSaveCompanyLogo,
      selectEmployee: setSelectedEmployeeId,
      setActiveSection,
      setIsCreatingEmployee,
      signOut: handleSignOut,
      toggleClientOrderCompletion: handleToggleClientOrderCompletion,
      toggleClientOrderTransfer: handleToggleClientOrderTransfer,
      updateDayHours: handleDayHoursChange,
    },
  };
}
