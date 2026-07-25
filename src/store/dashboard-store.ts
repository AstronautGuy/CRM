import { create } from "zustand";
import { persist } from "zustand/middleware";
export interface DashboardWidget {
  id: string;
  title: string;
  visible: boolean;
  layout: any;
}

export const defaultWidgets: DashboardWidget[] = [
  { id: "kpi-contacts", title: "Total Contacts", visible: true, layout: { i: "kpi-contacts", x: 0, y: 0, w: 3, h: 2, minW: 2, minH: 1 } },
  { id: "kpi-pipeline", title: "Active Pipeline", visible: true, layout: { i: "kpi-pipeline", x: 3, y: 0, w: 3, h: 2, minW: 2, minH: 1 } },
  { id: "kpi-invoices", title: "Unpaid Invoices", visible: true, layout: { i: "kpi-invoices", x: 6, y: 0, w: 3, h: 2, minW: 2, minH: 1 } },
  { id: "kpi-tasks", title: "Tasks Due", visible: true, layout: { i: "kpi-tasks", x: 9, y: 0, w: 3, h: 2, minW: 2, minH: 1 } },
  { id: "chart-pipeline", title: "Pipeline Overview", visible: true, layout: { i: "chart-pipeline", x: 0, y: 2, w: 6, h: 4, minW: 3, minH: 3 } },
  { id: "table-activity", title: "Recent Activity", visible: true, layout: { i: "table-activity", x: 6, y: 2, w: 6, h: 4, minW: 3, minH: 3 } },
];

interface DashboardState {
  widgets: DashboardWidget[];
  toggleWidget: (id: string) => void;
  updateLayout: (layouts: any[]) => void;
  resetLayout: () => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      widgets: defaultWidgets,
      toggleWidget: (id) =>
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, visible: !w.visible } : w
          ),
        })),
      updateLayout: (newLayouts) =>
        set((state) => ({
          widgets: state.widgets.map((w) => {
            const updatedLayout = newLayouts.find((l) => l.i === w.id);
            return updatedLayout ? { ...w, layout: updatedLayout } : w;
          }),
        })),
      resetLayout: () => set({ widgets: defaultWidgets }),
    }),
    {
      name: "dashboard-layout", // unique name for localStorage key
    }
  )
);
