# Multi-Calculator

A comprehensive multi-mode desktop calculator application built with Electron, React, and TypeScript. Features five different calculator modes, dark/light themes, calculation history, memory functions, and more.

![Multi-Calculator](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Features

### 🔢 Calculator Modes

1. **Basic Calculator**
   - Standard arithmetic operations (+, -, ×, ÷)
   - Percentage, square root, square
   - Memory functions (MC, MR, MS, M+, M-)
   - Copy/paste support
   - Keyboard shortcuts

2. **Scientific Calculator**
   - Trigonometric functions (sin, cos, tan, asin, acos, atan)
   - Logarithmic functions (log, ln)
   - Exponential and power functions
   - Constants (π, e)
   - Factorial, absolute value
   - Degree/Radian mode toggle

3. **Programmer Calculator**
   - Number base conversion (Binary, Octal, Decimal, Hexadecimal)
   - Bitwise operations (AND, OR, XOR, NOT)
   - Bit shifting (left shift, right shift)
   - Multiple bit widths (8, 16, 32, 64-bit)
   - Binary representation display

4. **Graphing Calculator**
   - Plot mathematical functions
   - Multiple functions on the same graph
   - Adjustable X and Y ranges
   - Function visibility toggle
   - Color-coded graphs
   - Zoom and pan capabilities

5. **Financial Calculator**
   - Loan payment calculations
   - Compound and simple interest
   - Future and present value
   - Return on Investment (ROI)
   - Depreciation (straight-line method)
   - Multiple financial formulas

### 🎨 Additional Features

- **Dark/Light Theme**: Toggle between dark and light themes
- **Calculation History**: Persistent history with timestamps
- **Memory Functions**: Store and recall values across calculations
- **Unit Converter**: Convert between different units (length, weight, temperature, etc.)
- **Keyboard Support**: Full keyboard navigation and shortcuts
- **Copy/Paste**: Clipboard integration for easy data transfer
- **Responsive UI**: Adapts to different window sizes
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Error Boundaries**: Graceful error handling with user-friendly error messages
- **Comprehensive Testing**: Unit tests for all calculation engines

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd Calculator
```

2. Install dependencies:
```bash
npm install
```

## Development

Run the application in development mode:

```bash
npm run dev
```

This will start the Vite development server and launch the Electron application with hot reload enabled.

## Testing

Run unit tests for the calculation engines:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

The test suite includes comprehensive coverage for:
- BasicCalculatorEngine (arithmetic operations, memory, etc.)
- ScientificCalculatorEngine (trigonometry, logarithms, etc.)
- ProgrammerCalculatorEngine (base conversion, bitwise operations)
- FinancialCalculatorEngine (loan calculations, interest, NPV, etc.)

## Building

### Build for Development

```bash
npm run build
```

This compiles both the renderer (React) and main (Electron) processes.

### Package for Distribution

Build installers for your platform:

```bash
# Build for current platform
npm run package

# Build for Windows
npm run package:win

# Build for macOS
npm run package:mac

# Build for Linux
npm run package:linux
```

The packaged applications will be available in the `release` directory.

## Usage

### Keyboard Shortcuts

#### Global Shortcuts

- `Ctrl/Cmd + 1`: Switch to Basic mode
- `Ctrl/Cmd + 2`: Switch to Scientific mode
- `Ctrl/Cmd + 3`: Switch to Programmer mode
- `Ctrl/Cmd + 4`: Switch to Graphing mode
- `Ctrl/Cmd + 5`: Switch to Financial mode
- `Ctrl/Cmd + T`: Toggle theme (Dark/Light)
- `Ctrl/Cmd + Q`: Quit application

#### Calculator Shortcuts

- `0-9`: Number input
- `+, -, *, /`: Arithmetic operators
- `.`: Decimal point
- `Enter` or `=`: Calculate result
- `Escape`: Clear
- `Backspace`: Delete last digit

### Mode Switching

Click on any of the mode buttons at the top of the application:
- 🔢 Basic
- 🔬 Scientific
- 💻 Programmer
- 📈 Graphing
- 💰 Financial

### History

- Click the 📜 icon to view calculation history
- History is persisted across sessions
- Click "Clear All" to remove all history entries
- Hover over entries to see delete button

### Memory Functions

- Click the 💾 icon to view memory slots
- **MC**: Memory Clear
- **MR**: Memory Recall
- **MS**: Memory Store
- **M+**: Add to memory
- **M-**: Subtract from memory

### Theme Toggle

Click the 🌙/☀️ icon in the top-right corner to switch between dark and light themes. Your preference is saved automatically.

## Project Structure

```
Calculator/
├── src/
│   ├── main/                 # Electron main process
│   │   ├── main.ts          # Main entry point
│   │   └── preload.ts       # Preload script
│   ├── renderer/            # React application
│   │   ├── components/      # React components
│   │   │   ├── BasicCalculator/
│   │   │   ├── ScientificCalculator/
│   │   │   ├── ProgrammerCalculator/
│   │   │   ├── GraphingCalculator/
│   │   │   ├── FinancialCalculator/
│   │   │   ├── ModeToggle/
│   │   │   ├── ThemeToggle/
│   │   │   ├── History/
│   │   │   ├── Memory/
│   │   │   └── UnitConverter/
│   │   ├── engines/         # Calculation engines
│   │   │   ├── basicEngine.ts
│   │   │   ├── scientificEngine.ts
│   │   │   ├── programmerEngine.ts
│   │   │   └── financialEngine.ts
│   │   ├── hooks/           # Custom React hooks
│   │   │   ├── useTheme.ts
│   │   │   ├── useHistory.ts
│   │   │   ├── useMemory.ts
│   │   │   └── useKeyboard.ts
│   │   ├── utils/           # Utility functions
│   │   │   ├── storage.ts
│   │   │   └── unitConverter.ts
│   │   ├── styles/          # Global styles
│   │   ├── App.tsx          # Main App component
│   │   └── main.tsx         # React entry point
│   └── shared/              # Shared types and constants
│       ├── types.ts
│       └── constants.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Technologies Used

- **Electron**: Cross-platform desktop application framework
- **React**: UI library for building interactive interfaces
- **TypeScript**: Typed superset of JavaScript
- **Vite**: Fast build tool and development server
- **Math.js**: Advanced mathematics library
- **Chart.js**: Graphing and data visualization
- **Local Storage**: Persistent data storage

## Features by Mode

### Basic Calculator
- Addition, Subtraction, Multiplication, Division
- Percentage calculations
- Square and Square root
- Sign inversion (+/-)
- Clear and Clear Entry

### Scientific Calculator
- All basic operations
- Trigonometric functions (deg/rad modes)
- Inverse trigonometric functions
- Natural and base-10 logarithms
- Exponential functions
- Power and root operations
- Factorial
- Mathematical constants (π, e)

### Programmer Calculator
- Binary (Base 2)
- Octal (Base 8)
- Decimal (Base 10)
- Hexadecimal (Base 16)
- Bitwise AND, OR, XOR, NOT
- Left and Right bit shifts
- 8, 16, 32, 64-bit modes

### Graphing Calculator
- Plot functions using standard mathematical notation
- Multiple functions simultaneously
- Custom X and Y axis ranges
- Color-coded function lines
- Toggle function visibility
- Legend with function expressions

### Financial Calculator
- Loan payment calculations (monthly payments)
- Compound interest calculations
- Simple interest calculations
- Future value calculations
- Present value calculations
- Return on Investment (ROI)
- Straight-line depreciation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

## Roadmap

Completed:
- [x] Unit tests for all calculation engines
- [x] Error boundaries for production error handling
- [x] Energy, Power, and Pressure unit conversions

Future enhancements planned:
- [ ] Integration tests for components
- [ ] Export history to CSV/PDF
- [ ] Custom themes
- [ ] Plugin system for custom calculators
- [ ] Statistics mode
- [ ] Matrix calculator mode
- [ ] Currency converter with live exchange rates
- [ ] More unit conversion categories

## Acknowledgments

- Math.js for powerful mathematical operations
- Chart.js for beautiful graphs
- Electron for cross-platform capabilities
- React team for the amazing UI library
