import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './layout/Layout';
import Login from './pages/public/Login';
import Unauthorized from './pages/public/Unauthorized';
import NotFound from './pages/public/NotFound';
import './App.css';
import { useSelector } from 'react-redux';
import { getHomePageForUser } from './utils/navigation';
import RequireAuth from './components/security/RequireAuth';
import StudentSchedule from './pages/student/StudentSchedule';
import TeacherSchedule from './pages/teacher/TeacherSchedule';
import StudentLayout from './components/student/StudentLayout';
import TeacherLayout from './components/teacher/TeacherLayout';
import { Roles } from './domain/constants';
import StudentSubjects from './pages/student/StudentSubjects';
import StudentClass from './pages/student/StudentClass';
import StudentMarks from './pages/student/StudentMarks';

function App() {
  const roles = useSelector(state => state.auth.roles);

  return (
    <div className="App">
      <Routes>
        <Route path='/' exact element={<Navigate redirect to={getHomePageForUser(roles)} />}></Route>
        <Route path='/login' exact element={<Login />}></Route>
        <Route path='/unauthorized' exact element={<Unauthorized />}></Route>

        <Route path='/student' element={<RequireAuth allowedRoles={[Roles.STUDENT]} />}>
          <Route element={<StudentLayout />}>
            <Route path='schedule' element={<StudentSchedule />}></Route>
            <Route path='subjects' element={<StudentSubjects />}></Route>
            <Route path='class' element={<StudentClass />}></Route>
            <Route path='marks' element={<StudentMarks />}></Route>
          </Route>
        </Route>

        <Route path='/teacher' element={<RequireAuth allowedRoles={[Roles.TEACHER]} />}>
          <Route element={<TeacherLayout />}>
            <Route path='schedule' element={<TeacherSchedule />}></Route>
          </Route>
        </Route>

        <Route path='*' element={<NotFound />}></Route>
      </Routes>
    </div>
  );
}

export default App;
