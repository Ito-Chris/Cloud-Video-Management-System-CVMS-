import { Route, Switch } from "wouter";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Cameras from "./pages/Cameras";
import Incidents from "./pages/Incidents";
import Analytics from "./pages/Analytics";
import IoT from "./pages/IoT";
import EvidencePage from "./pages/Evidence";
import Officers from "./pages/Officers";

export default function App() {
  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/cameras" component={Cameras} />
          <Route path="/incidents" component={Incidents} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/iot" component={IoT} />
          <Route path="/evidence" component={EvidencePage} />
          <Route path="/officers" component={Officers} />
        </Switch>
      </main>
    </div>
  );
}
