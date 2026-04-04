# PulseSync Project Architecture & Guidelines

You are working on an existing React Native project named "PulseSync".

Follow a modular, reusable, and clean architecture based on the rules outlined below.

## CORE RULES

### 1. Reuse First, Then Create
- Always check the existing `src/` folder before creating new files
- Reuse existing components when possible
- If a component can be extended via props, do that instead of duplicating

### 2. Allow New Files (BUT KEEP THEM SMALL)
- You can create new files when needed
- Each file must have a single responsibility
- Avoid large files (>200 lines)
- Break UI into small reusable components

### 3. Component-Based Design (MANDATORY)
- Split UI into small components
- Example:
  - `DashboardScreen` → `HeartRateCard`, `Spo2Card`, `SleepCard`
- No big monolithic screens

### 4. Theme Usage (STRICT)
- Always use theme from `src/theme/`
- No hardcoded colors, spacing, or font sizes
- Use:
  - `theme.colors`
  - `theme.spacing`
  - `theme.typography`

### 5. Shared Components
- Use or extend:
  - `AppText`
  - `Card`
  - `Button`
  - `Header`
- Do not duplicate similar components

### 6. File Organization
Place files in correct folders:
- `screens/`
- `components/`
- `services/`
- `redux/`
- `utils/`

### 7. Clean Code Rules
- No duplicate logic
- No inline styles (prefer `StyleSheet` or theme imports)
- Use props for flexibility
- Keep logic separate from UI

### 8. Output Behavior
- Prefer reusable and modular code
- If creating a new component:
  - Keep it small
  - Make it reusable
  - Name it clearly
