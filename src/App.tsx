import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import Home from "./routes/Home";
import Search from "./routes/Search";
import Tv from "./routes/Tv";

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Header />
      <Switch>
        <Route path={["/tv", "/tv/toprated/:id", "/tv/popular/:id"]}>
          <Tv />
        </Route>
        <Route path={["/search", "/search?keyword=:id"]}>
          <Search />
        </Route>
        <Route path={["/", "/movie/:"]}>
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}
export default App;
