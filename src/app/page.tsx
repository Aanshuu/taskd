import TaskPage from "./task/page";
import ProtectedRoute from "../components/ProtectedRoute";

export default function Home() {
  return (
    <div>
      <ProtectedRoute>
        <TaskPage />
      </ProtectedRoute>
    </div>
  );
}
