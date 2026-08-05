import { createContext, useContext, useReducer } from "react";

function reduer(theme, action) {
  switch (action.type) {
    case "set":
      return action.theme;
    default:
      return theme;
  }
}

const ThemeContext = createContext(null);

function DisplayTheme() {
  const { theme } = useContext(ThemeContext);
  return <div>当前主题：{theme}</div>;
}

function ToggleTheme() {
  const { theme, dispatch } = useContext(ThemeContext);
  
  return <button onClick={() => dispatch({ type: "set", theme: theme === "dark" ? "light" : "dark"})}>切换主题</button>;
}

export default function Demo() {
  const [theme, dispatch] = useReducer(reduer, "dark");
  return (
    <ThemeContext.Provider value={{ theme, dispatch }}>
      <DisplayTheme />
      <ToggleTheme />
    </ThemeContext.Provider>
  );
}
