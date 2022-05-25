import React, { useMemo } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/public/Login';
import Unauthorized from './pages/public/Unauthorized';
import NotFound from './pages/public/NotFound';
import './App.css';
import { useSelector } from 'react-redux';
import { getHomePageForUser } from './utils/navigation';
import RequireAuth from './components/security/RequireAuth';
import StudentSchedule from './pages/student/StudentSchedule';
import TeacherSchedule from './pages/teacher/TeacherSchedule';
import { Roles } from './domain/constants';
import StudentSubjects from './pages/student/StudentSubjects';
import StudentClass from './pages/student/StudentClass';
import StudentMarks from './pages/student/StudentMarks';
import TeacherSubjects from './pages/teacher/TeacherSubjects';
import FormTeacherClass from './pages/formteacher/FormTeacherClass';
import FormTeacherClassMarkBook from './pages/formteacher/FormTeacherClassMarkBook';
import TeacherMarkBook from './pages/teacher/TeacherMarkBook';
import AuthLayout from './layout/AuthLayout';
import PublicLayout from './layout/PublicLayout';

function App() {
  const roles = useSelector(state => state.auth.roles);
  const isFormTeacher = useMemo(() => {
    return !!roles && roles.includes(Roles.FORMTEACHER);
  }, [roles]);

  return (
    <div className="App">
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path='/' exact element={<Navigate redirect to={getHomePageForUser(roles)} />}></Route>
          <Route path='/login' exact element={<Login />}></Route>
          <Route path='/unauthorized' exact element={<Unauthorized />}></Route>
          <Route path='*' element={<NotFound />}></Route>
        </Route>

        <Route element={<AuthLayout />}>
          <Route path='/student' element={<RequireAuth allowedRoles={[Roles.STUDENT]} />}>
              <Route path='schedule' element={<StudentSchedule />}></Route>
              <Route path='subjects' element={<StudentSubjects />}></Route>
              <Route path='class' element={<StudentClass />}></Route>
              <Route path='marks' element={<StudentMarks />}></Route>
          </Route>

          <Route path='/teacher' element={<RequireAuth allowedRoles={[Roles.TEACHER, Roles.FORMTEACHER]} />}>
              <Route path='schedule' element={<TeacherSchedule />}></Route>
              <Route path='subjects' element={<TeacherSubjects />}></Route>
              <Route path='markBook' element={<TeacherMarkBook />}></Route>
            </Route>

          <Route path='/formteacher' element={<RequireAuth allowedRoles={[Roles.FORMTEACHER]} />}>
              <Route path='class' element={<FormTeacherClass />}></Route>
              <Route path='classMarkBook' element={<FormTeacherClassMarkBook />}></Route>
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
