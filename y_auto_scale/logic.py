import math

def get_nice_ticks(data_min, data_max, n_target=7):
    """
    Рассчитывает 'красивые' деления для оси графика.
    """
    delta = data_max - data_min
    if delta == 0: 
        return [data_min - 1, data_min, data_min + 1]
    
    # Небольшой отступ от краев (5%)
    v_min = data_min - (delta * 0.05)
    v_max = data_max + (delta * 0.05)
    range_val = v_max - v_min
    
    rough_step = range_val / (n_target - 1)
    exponent = math.floor(math.log10(rough_step))
    fraction = rough_step / (10 ** exponent)

    # Выбор 'красивого' шага
    if fraction < 1.5: m_nice = 1
    elif fraction < 3.0: m_nice = 2
    elif fraction < 4.5: m_nice = 2.5
    elif fraction < 7.5: m_nice = 5
    else: m_nice = 10

    step = m_nice * (10 ** exponent)
    axis_min = math.floor(v_min / step) * step
    axis_max = math.ceil(v_max / step) * step

    # Чтобы ось не уходила в минус для положительных данных
    if data_min >= 0 and axis_min < 0: 
        axis_min = 0

    ticks = []
    current = axis_min
    while current <= (axis_max + (step / 10)):
        ticks.append(round(current, 10))
        current += step
    return ticks
