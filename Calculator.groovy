def reader = System.in.newReader()
def history = []

def readNumber(reader, title) {
    println title
    try {
        return Double.parseDouble(reader.readLine().trim())
    } catch (NumberFormatException e) {
        println 'Это не число: ' + e.message
        return null
    }
}

def apply(a, b, sign) {
    switch (sign) {
        case '+': return a + b
        case '-': return a - b
        case '*': return a * b
        case '/': return b == 0 ? null : a / b
        case '%': return b == 0 ? null : a % b
        default: return null
    }
}

def factorial(n) {
    def result = 1
    if (n < 2) return result
    for (i in 2..n) {
        result = result * i
    }
    return result
}

def power(base, degree) {
    def value = 1
    def steps = degree < 0 ? -degree : degree
    for (i in 0..<steps) {
        value = value * base
    }
    return degree < 0 ? 1 / value : value
}

def arithmetic(reader, history) {
    def a = readNumber(reader, 'Первое число:')
    def b = readNumber(reader, 'Второе число:')
    println 'Знак операции:'
    def sign = reader.readLine().trim()
    if (a == null || b == null) return 'Операция отменена'
    def value = apply(a, b, sign)
    if (value == null) return 'Некорректная операция'
    def note = a + ' ' + sign + ' ' + b + ' = ' + value
    history << note
    return note
}

def show(history) {
    if (history.isEmpty()) {
        println 'История пуста'
        return
    }
    history.each { note -> println note }
    println 'Всего операций: ' + history.size()
}

while (true) {
    println '1 - арифметика, 2 - факториал, 3 - степень, 4 - история, 0 - выход'
    def cmd = reader.readLine()
    if (cmd == null) {
        break
    }
    switch (cmd.trim()) {
        case '1':
            println arithmetic(reader, history)
            break
        case '2':
            def n = readNumber(reader, 'Целое число 0..20:')
            def factValue = n == null || n < 0 || n > 20 ? 'Нет данных' : factorial(n as int)
            history << 'n! = ' + factValue
            println factValue
            break
        case '3':
            def base = readNumber(reader, 'Основание:')
            def degree = readNumber(reader, 'Показатель:')
            def powValue = base == null || degree == null ? 'Нет данных' : power(base, degree as int)
            history << 'Степень = ' + powValue
            println powValue
            break
        case '4':
            show(history)
            break
        case '0':
            println 'Выход'
            return
        default:
            println 'Нет такой команды'
    }
}
