import tkinter as tk
from tkinter import messagebox
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import random

# Импортируем нашу общую логику
from logic import get_nice_ticks 

class ModernChartApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Data Visualizer Desktop (Tkinter)")
        self.root.geometry("1000x600")
        self.root.configure(bg="#f5f5f5")

        # Настройки стилей
        self.primary_color = "#b56ea9"
        
        self._setup_ui()
        self.plot()

    def _setup_ui(self):
        """Создание элементов интерфейса"""
        # Боковая панель
        side_panel = tk.Frame(self.root, bg="#dcdcdc", width=250)
        side_panel.pack(side=tk.LEFT, fill=tk.Y)
        side_panel.pack_propagate(False)

        tk.Label(side_panel, text="НАСТРОЙКИ", bg="#dcdcdc", font=("Arial", 12, "bold")).pack(pady=20)

        # Поля ввода
        self.entry_text = self._create_input(side_panel, "Данные (через запятую):", "124, 450, 300, 800")
        self.entry_min = self._create_input(side_panel, "Минимум Y (опционально):", "")
        self.entry_max = self._create_input(side_panel, "Максимум Y (опционально):", "")
        self.entry_n = self._create_input(side_panel, "Число делений:", "7")

        # Кнопки
        tk.Button(side_panel, text="ПОСТРОИТЬ", bg="#28a745", fg="white", command=self.plot).pack(pady=10, fill="x", padx=20)
        tk.Button(side_panel, text="РАНДОМ", command=self.generate_random).pack(pady=5, fill="x", padx=20)

        # Область графика
        self.fig, self.ax = plt.subplots(figsize=(5, 4), facecolor="#f5f5f5")
        self.canvas = FigureCanvasTkAgg(self.fig, master=self.root)
        self.canvas.get_tk_widget().pack(side=tk.RIGHT, fill=tk.BOTH, expand=True, padx=20, pady=20)

    def _create_input(self, parent, label_text, default_val):
        tk.Label(parent, text=label_text, bg="#dcdcdc").pack(anchor="w", padx=20)
        ent = tk.Entry(parent)
        ent.pack(fill="x", padx=20, pady=(0, 10))
        ent.insert(0, default_val)
        return ent

    def generate_random(self):
        vals = [random.randint(100, 500)]
        for _ in range(25):
            vals.append(vals[-1] + random.randint(-50, 50))
        self.entry_text.delete(0, tk.END)
        self.entry_text.insert(0, ", ".join(map(str, vals)))
        self.plot()

    def plot(self):
        try:
            # 1. Получаем и проверяем данные
            raw_data = self.entry_text.get()
            y_values = [float(x.strip()) for x in raw_data.split(",") if x.strip()]
            
            # 2. Математика (используем импортированную функцию)
            n_target = int(self.entry_n.get())
            
            d_min, d_max = min(y_values), max(y_values)
            auto_ticks = get_nice_ticks(d_min, d_max, n_target)

            # Лимиты
            f_min = float(self.entry_min.get()) if self.entry_min.get() else min(auto_ticks)
            f_max = float(self.entry_max.get()) if self.entry_max.get() else max(auto_ticks)
            
            # Финальные тики под выбранные лимиты
            final_ticks = get_nice_ticks(f_min, f_max, n_target)
            visible_ticks = [t for t in final_ticks if f_min <= t <= f_max]

            # 3. Отрисовка
            self.ax.clear()
            self.ax.plot(y_values, marker='o', color=self.primary_color, linewidth=2)
            self.ax.set_ylim(f_min, f_max)
            self.ax.set_yticks(visible_ticks)
            self.ax.grid(True, linestyle='--', alpha=0.6)
            self.canvas.draw()

        except ValueError:
            messagebox.showerror("Ошибка", "Проверьте корректность введенных чисел")

if __name__ == "__main__":
    root = tk.Tk()
    app = ModernChartApp(root)
    root.mainloop()
