import {
  type Advance,
  type Employee,
  type NewEmployeeInput,
  type WorkDayKey,
  createEmptyWorkLog,
  getDateLabel,
  getMonthKey,
  getMonthLabel,
} from "@/app/_data/employees";
import { supabase } from "./client";

type EmployeeRow = {
  id: string;
  owner_id: string;
  name: string;
  role: string;
  hourly_rate: number;
  status: "active" | "archived";
  created_at: string;
};

type EmployeeWeekRow = {
  id: string;
  employee_id: string;
  week_start_date: string;
  monday_hours: number;
  tuesday_hours: number;
  wednesday_hours: number;
  thursday_hours: number;
  friday_hours: number;
  saturday_hours: number;
  sunday_hours: number;
  is_closed: boolean;
  closed_at: string | null;
  created_at: string;
};

type EmployeeAdvanceRow = {
  id: string;
  employee_week_id: string;
  day_key: WorkDayKey;
  amount: number;
  created_at: string;
};

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getWeekStartDate(date: Date) {
  const copy = new Date(date);
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  copy.setDate(copy.getDate() + diff);
  copy.setHours(0, 0, 0, 0);

  return copy;
}

function getNextWeekStartDate(weekStartDate: string) {
  const next = new Date(`${weekStartDate}T00:00:00`);
  next.setDate(next.getDate() + 7);

  return toIsoDate(next);
}

function mapWeekRowToWorkLog(week: EmployeeWeekRow) {
  return {
    monday: Number(week.monday_hours ?? 0),
    tuesday: Number(week.tuesday_hours ?? 0),
    wednesday: Number(week.wednesday_hours ?? 0),
    thursday: Number(week.thursday_hours ?? 0),
    friday: Number(week.friday_hours ?? 0),
    saturday: Number(week.saturday_hours ?? 0),
    sunday: Number(week.sunday_hours ?? 0),
  };
}

function mapAdvanceRow(advance: EmployeeAdvanceRow): Advance {
  return {
    id: advance.id,
    day: advance.day_key,
    amount: Number(advance.amount),
  };
}

function buildEmployee(
  employeeRow: EmployeeRow,
  weeks: EmployeeWeekRow[],
  advances: EmployeeAdvanceRow[],
): Employee {
  const openWeek = weeks.find((week) => !week.is_closed) ?? null;
  const openWeekAdvances = openWeek
    ? advances.filter((advance) => advance.employee_week_id === openWeek.id)
    : [];
  const closedWeeks = weeks.filter((week) => week.is_closed);

  const weekHistory = closedWeeks
    .map((week) => {
      const weekAdvances = advances.filter(
        (advance) => advance.employee_week_id === week.id,
      );
      const workLog = mapWeekRowToWorkLog(week);
      const mappedAdvances = weekAdvances.map(mapAdvanceRow);
      const totalHours = Object.values(workLog).reduce(
        (total, hours) => total + hours,
        0,
      );
      const grossPay = totalHours * Number(employeeRow.hourly_rate);
      const advancesTotal = mappedAdvances.reduce(
        (total, advance) => total + advance.amount,
        0,
      );
      const closedDate = week.closed_at ? new Date(week.closed_at) : new Date();

      return {
        id: week.id,
        monthKey: getMonthKey(closedDate),
        monthLabel: getMonthLabel(closedDate),
        closedAt: getDateLabel(closedDate),
        weekLabel: `Тиждень закрито ${getDateLabel(closedDate)}`,
        totalHours,
        grossPay,
        advancesTotal,
        pendingPay: Math.max(0, grossPay - advancesTotal),
        workLog,
        advances: mappedAdvances,
      };
    })
    .sort((left, right) => right.closedAt.localeCompare(left.closedAt));

  return {
    id: employeeRow.id,
    name: employeeRow.name,
    role: employeeRow.role,
    hourlyRate: Number(employeeRow.hourly_rate),
    status: "Активний",
    currentWeekId: openWeek?.id ?? null,
    currentWeekStartDate: openWeek?.week_start_date ?? null,
    workLog: openWeek ? mapWeekRowToWorkLog(openWeek) : createEmptyWorkLog(),
    advances: openWeekAdvances.map(mapAdvanceRow),
    weekHistory,
  };
}

async function ensureOpenWeeks(employeeRows: EmployeeRow[], weeks: EmployeeWeekRow[]) {
  const employeeIdsWithoutOpenWeek = employeeRows
    .filter(
      (employee) =>
        !weeks.some(
          (week) => week.employee_id === employee.id && week.is_closed === false,
        ),
    )
    .map((employee) => employee.id);

  if (employeeIdsWithoutOpenWeek.length === 0) {
    return;
  }

  const weekStartDate = toIsoDate(getWeekStartDate(new Date()));

  const { error } = await supabase.from("employee_weeks").insert(
    employeeIdsWithoutOpenWeek.map((employeeId) => ({
      employee_id: employeeId,
      week_start_date: weekStartDate,
    })),
  );

  if (error) {
    throw error;
  }
}

export async function fetchEmployeesForOwner(ownerId: string) {
  const { data: employeeRows, error: employeeError } = await supabase
    .from("employees")
    .select("*")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: true });

  if (employeeError) {
    throw employeeError;
  }

  const typedEmployees = (employeeRows ?? []) as EmployeeRow[];

  if (typedEmployees.length === 0) {
    return [];
  }

  const employeeIds = typedEmployees.map((employee) => employee.id);

  const { data: weekRows, error: weekError } = await supabase
    .from("employee_weeks")
    .select("*")
    .in("employee_id", employeeIds)
    .order("created_at", { ascending: true });

  if (weekError) {
    throw weekError;
  }

  const typedWeeks = (weekRows ?? []) as EmployeeWeekRow[];

  await ensureOpenWeeks(typedEmployees, typedWeeks);

  const { data: refreshedWeekRows, error: refreshedWeekError } = await supabase
    .from("employee_weeks")
    .select("*")
    .in("employee_id", employeeIds)
    .order("created_at", { ascending: true });

  if (refreshedWeekError) {
    throw refreshedWeekError;
  }

  const finalWeeks = (refreshedWeekRows ?? []) as EmployeeWeekRow[];
  const weekIds = finalWeeks.map((week) => week.id);

  const { data: advanceRows, error: advanceError } = weekIds.length
    ? await supabase
        .from("employee_advances")
        .select("*")
        .in("employee_week_id", weekIds)
        .order("created_at", { ascending: true })
    : { data: [], error: null };

  if (advanceError) {
    throw advanceError;
  }

  const typedAdvances = (advanceRows ?? []) as EmployeeAdvanceRow[];

  return typedEmployees.map((employeeRow) => {
    const employeeWeeks = finalWeeks.filter(
      (week) => week.employee_id === employeeRow.id,
    );

    return buildEmployee(employeeRow, employeeWeeks, typedAdvances);
  });
}

export async function createEmployeeForOwner(
  ownerId: string,
  input: NewEmployeeInput,
) {
  const { data: employeeRow, error } = await supabase
    .from("employees")
    .insert({
      owner_id: ownerId,
      name: input.name,
      role: input.role,
      hourly_rate: input.hourlyRate,
      status: "active",
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  const weekStartDate = toIsoDate(getWeekStartDate(new Date()));

  const { error: weekError } = await supabase.from("employee_weeks").insert({
    employee_id: employeeRow.id,
    week_start_date: weekStartDate,
  });

  if (weekError) {
    throw weekError;
  }
}

const dayColumnMap: Record<WorkDayKey, keyof EmployeeWeekRow> = {
  monday: "monday_hours",
  tuesday: "tuesday_hours",
  wednesday: "wednesday_hours",
  thursday: "thursday_hours",
  friday: "friday_hours",
  saturday: "saturday_hours",
  sunday: "sunday_hours",
};

export async function updateEmployeeDayHours(
  currentWeekId: string,
  day: WorkDayKey,
  value: number,
) {
  const { error } = await supabase
    .from("employee_weeks")
    .update({
      [dayColumnMap[day]]: value,
    })
    .eq("id", currentWeekId);

  if (error) {
    throw error;
  }
}

export async function addEmployeeAdvance(
  currentWeekId: string,
  day: WorkDayKey,
  amount: number,
) {
  const { error } = await supabase.from("employee_advances").insert({
    employee_week_id: currentWeekId,
    day_key: day,
    amount,
  });

  if (error) {
    throw error;
  }
}

export async function removeEmployeeAdvance(advanceId: string) {
  const { error } = await supabase
    .from("employee_advances")
    .delete()
    .eq("id", advanceId);

  if (error) {
    throw error;
  }
}

export async function deleteEmployeeById(employeeId: string) {
  const { error } = await supabase.from("employees").delete().eq("id", employeeId);

  if (error) {
    throw error;
  }
}

export async function closeEmployeeWeek(employee: Employee) {
  if (!employee.currentWeekId || !employee.currentWeekStartDate) {
    return;
  }

  const closedAt = new Date().toISOString();

  const { error: closeError } = await supabase
    .from("employee_weeks")
    .update({
      is_closed: true,
      closed_at: closedAt,
    })
    .eq("id", employee.currentWeekId);

  if (closeError) {
    throw closeError;
  }

  const { error: createError } = await supabase.from("employee_weeks").insert({
    employee_id: employee.id,
    week_start_date: getNextWeekStartDate(employee.currentWeekStartDate),
  });

  if (createError) {
    throw createError;
  }
}

export async function signOutOwner() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

export function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error && "message" in error) {
    return String(error.message);
  }

  return "Сталася неочікувана помилка.";
}
